import { Button } from "@/components/ui/button"
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { useEffect, useState } from "react"
import Token from "../common/Token"
import SVGArrowDownMid from "@/lib/svgs/svg_arrow_down_mid"
import QuestionMarkToolTip from "../common/QuestionMarkToolTip"
import { useAccount, useChainId, useChains,useClient} from 'wagmi'
import Spinner from "../common/Spinner"
import SVGWarning from "@/lib/svgs/svg_warning"
import { IContextUtil, useContextUtil } from "../providers/ContextUtilProvider"
import { Decimal } from 'decimal.js'
import { ChainId } from '@uniswap/sdk-core'
import ReviewSwap from "./ReviewSwap"
import { LocalChainIds, QuotesParameterType, TokenType } from "@/common/types"
import logger from "@/common/Logger"


type NoQuotesProps = {
  handlePrevStep: () => void
}
const NoQuotes: React.FC<NoQuotesProps> = ({handlePrevStep}) => {
  
  return (
    <div className="flex flex-col items-center justify-center w-full h-80">
      <SVGWarning className="text-red-400 w-20 h-20"/>
      <div className="text-xl font-semibold">No quotes available</div>
      <div className="text-zinc-500 text-sm my-2">Try adjusting the amount or slippage settings and try again</div>
      <div className="border-[2px] border-pink-600 hover:text-pink-600 px-4 py-2 rounded-full cursor-pointer my-2" onClick={handlePrevStep}>
        <span>Go back</span>
      </div>
    </div>
  )
}

const span = 60

type QuotesProps = {
  tokenFrom: TokenType;
  tokenTo: TokenType;
  swapAmount: number;
  setting: {slipage: number, deadline: number | ''}
  handlePrevStep: () => void
}
const Quotes:React.FC<QuotesProps> = ({tokenFrom, tokenTo, swapAmount, setting, handlePrevStep}) => {
    const {tokenPrices} = useContextUtil() as IContextUtil
    const { isConnected, address} = useAccount()
    const { openConnectModal } = useConnectModal()
    const [loading, setLoading] = useState<boolean>(false) // loading flag is set only when we first load the page
    const [hiddenLoading, setHiddenLoading] = useState<boolean>(false)  // the loading flag is set when an time interval is ended
    const [quote, setQuote] = useState('')
    const [estimatedGasUsed, setEstimatedGasUsed] = useState('')
    const [estimatedGasUsedUSD, setEstimatedGasUsedUSD] = useState('')
    const [isError, setIsError] = useState(false)
    const [seconds, setSeconds] = useState(30)
    const [startCountDown, setStartCountDown] = useState(false)
    const [tokenInUSD, setTokenInUSD] = useState('')
    const [tokenOutUSD, setTokenOutUSD] = useState('')
    const [loss, setLoss] = useState('')

    const [calldata, setCalldata] = useState<`0x${string}`>('0x')

    const [openModal, setOpenModal] = useState(false)

    const chainId = useChainId() as (ChainId | LocalChainIds)
    const chains = useChains()
    const client = useClient()
    const chain = chains.find((chain) => chain.id === chainId)
    const rpcUrl  = client?.transport.url // we can make sure rpcUrl is not empty

    const updateUSD = (quote: string) => {
      const targetChainId = chainId === 31337 ? ChainId.MAINNET : chainId   // for test

      const inPrice = tokenPrices[targetChainId]?.get(tokenFrom?.address)
      const outPrice = tokenPrices[targetChainId]?.get(tokenTo?.address)
      if (inPrice && outPrice) {
        const poolValue = new Decimal(outPrice).times(new Decimal(quote))
        const heldValue = new Decimal(inPrice).times(new Decimal(swapAmount))
        setTokenInUSD(heldValue.toDecimalPlaces(3, Decimal.ROUND_HALF_UP).toString())
        setTokenOutUSD(poolValue.toDecimalPlaces(3, Decimal.ROUND_HALF_UP).toString())
        const loss = heldValue.isZero() ? '' : poolValue.dividedBy(heldValue).minus(new Decimal(1)).times(100).toDecimalPlaces(3, Decimal.ROUND_HALF_UP).toString()
        setLoss(loss)
        logger.debug('[Quotes] poolValue:', poolValue.toString())
        logger.debug('[Quotes] heldValue:', heldValue.toString())
        logger.debug('[Quotes] loss:', loss)
      } else {
        setLoss('')
      }
    }
    
    useEffect(() => {
        (async () => {
            await updateQuotes(true)
            setSeconds(span)
            setStartCountDown(true)
        })()
    }, [])

    useEffect(() => {
      let interval = null
      if(startCountDown) {
        if (seconds > 0) {
          interval = setInterval(() => setSeconds((prev) => prev - 1), 1000)
        } else if (seconds === 0) {
          (async () => {
            logger.debug('[Quotes] running updateQuotes')
            await updateQuotes(false)
            setSeconds(span)  // start a new time interval
            logger.debug('[Quotes] done updateQuotes')
          })()
        }
      }
      return () => {
        if (interval) clearInterval(interval)
      }
    }, [startCountDown, seconds])

    const updateQuotes = async (first: boolean) => {
      if (first) setLoading(true)
      else setHiddenLoading(true)
      const data: QuotesParameterType = {
        chainId: chainId === 31337 ? ChainId.MAINNET : chainId,   // for test
        rpcUrl: chainId === 31337 ? `https://eth-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_ID}` : rpcUrl,   // for test
        //rpcUrl: chainId === 31337 ? `https://mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_ID}` : rpcUrl,   // for test
        recipient: address!,
        slippage: setting.slipage * 100, // one ten-thousandth
        deadline: setting.deadline === '' ? 1800 : setting.deadline * 60, // in seconds
        amountIn: swapAmount,
        tokenIn: tokenFrom,
        tokenOut: tokenTo
      }

      logger.debug('[Quotes] data:', data)
      try {
        const response = await fetch('/api/quotes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        const result = await response.json();
        if (!result.success) throw new Error('failed to read /api/quotes')
        logger.debug('[Quotes] result:', result)
        setQuote(result.quote)
        updateUSD(result.quote)
        setEstimatedGasUsed(result.estimatedGasUsed)
        setEstimatedGasUsedUSD(result.estimatedGasUsedUSD)
        setCalldata(result.calldata)
      } catch (e) {
        logger.error('[Quotes] failed to get quotes due to:', e)
        setIsError(true)
        setStartCountDown(false)
      }
      if (first) setLoading(false)
      else setHiddenLoading(false)
    }

    const handleSwap = () => {
      setOpenModal(true)
    }

    return (
        <div>
          {
            loading 
              ? <div className="flex w-full h-80 justify-center items-center"><Spinner/></div>
              : isError
                ? <NoQuotes handlePrevStep={handlePrevStep}/>
                : <>
                    <div className="flex flex-col items-center">
                      <div className="my-2"><span className="text-xs text-zinc-400">{hiddenLoading ? 'Calculating new quotes...' : `New Quotes in 0:${seconds}`}</span></div>
                      <div className="flex items-center"><span className="px-2">{swapAmount}</span><Token token={tokenFrom} imageSize={40}/> <span className="text-zinc-400">{tokenInUSD ? `($${tokenInUSD})` : ''}</span></div>
                      <div><SVGArrowDownMid className="size-6 text-zinc-400"/></div>
                      <div className="my-2"><Token token={tokenTo} imageSize={40}/></div>
                      <div className="my-2"><span className="text-4xl">{quote}</span></div>
                      <div><span className="text-zinc-400">{tokenOutUSD ? `($${tokenOutUSD})` : ''}</span><span className="text-pink-600 font-semibold mx-2">{loss ? `${loss}%` : ''}</span></div>
                    </div>
                    <div className="border-y-[1px] border-zinc-600 py-3 my-10">
                      <div className="flex justify-between">
                        <div className="flex items-center">
                            <span>Estimated Gas Fee</span>
                            <QuestionMarkToolTip>
                              <div className="w-[200px] text-xs">BEST dex doesn't make money from gas fees. These fees are estimates and can change based on how busy the network is and how complex a transaction is</div>
                            </QuestionMarkToolTip>
                        </div>
                        <div>{estimatedGasUsed} {chain?.nativeCurrency.symbol}</div>
                      </div>
                      <div className="flex justify-end mt-1">
                        <div className="flex">
                          <div>Estimated fee:</div><div className="text-pink-600 pl-1">${estimatedGasUsedUSD}</div>
                        </div>
                      </div>
                    </div>
                    <div className='flex justify-center'>
                      <Button 
                          className='w-full bg-pink-600 hover:bg-pink-700 disabled:bg-zinc-600 active:bg-pink-700/80' 
                          disabled={isConnected ? !tokenFrom || !tokenTo || !swapAmount : false}
                          onClick={isConnected ? handleSwap : openConnectModal}>{isConnected ? 'Swap' :'Connect Wallet'}
                      </Button>
                    </div>
                    {
                      openModal && <ReviewSwap 
                                      tokenFrom={tokenFrom} 
                                      tokenTo={tokenTo} 
                                      swapAmount={`${swapAmount}`}
                                      quote={quote}
                                      tokenInUSD={tokenInUSD}
                                      tokenOutUSD={tokenOutUSD}
                                      calldata={calldata}
                                      setOpenModal={setOpenModal}/>
                    }
                  </>
          }
        </div>
    )
}

export default Quotes