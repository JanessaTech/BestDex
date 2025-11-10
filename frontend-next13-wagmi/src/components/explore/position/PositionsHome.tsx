import { TabsContent} from "@/components/ui/tabs"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import SVGPlus from "@/lib/svgs/svg_plus"
import SVGMinus from "@/lib/svgs/svg_minus"
import SVGWithdraw from "@/lib/svgs/svg_withdraw"
import Token from "@/components/common/Token"
import ToolTipHelper from "@/components/common/ToolTipHelper"
import { PositionListData } from "@/lib/data"
import { useState } from "react"
import IncreaseLiquidity from "@/components/pool/IncreaseLiquidity"
import DecreaseLiquidity from "@/components/pool/DecreaseLiquidity"
import CollectFee from "@/components/pool/CollectFee"
import { IContextUtil, useContextUtil } from "@/components/providers/ContextUtilProvider"
import { toast } from 'sonner'
import { useChainId, usePublicClient} from 'wagmi'
import { NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS, UNISWAP_V3_POSITION_MANAGER_ABI } from "@/config/constants"
import { fetchLatestPoolInfo } from "@/lib/client/pool"
import { PoolInfo, PositionProps, TokenType } from "@/common/types"


type GlobalVariableType = {
    poolInfo?: PoolInfo;
    position: PositionProps
}
type PositionsHomeProps = {}
const PositionsHome: React.FC<PositionsHomeProps> = () => {
    //for test
    const chainId = useChainId()    
    const publicClient = usePublicClient({chainId})

    const [openIncreaseLiquidity, setOpenIncreaseLiquidity] = useState(false)
    const [openDecreaseLiquidity, setOpenDecreaseLiquidity] = useState(false)
    const [openCollectFee, setOpenCollectFee] = useState(false)

    const [global, setGlobal] = useState<GlobalVariableType>()
    const [tokenBalances, setTokenBalances] = useState<{token0: string, token1: string}>({token0: '999999999999999999999', token1: '999999999999999999'})
    const {getPoolAddress} = useContextUtil() as IContextUtil
    
    // for test
    const getPositionDetail = async (tokenId: bigint) => {
        try {
            if (!publicClient) throw new Error('publicClient is null')
            const postion = await publicClient.readContract({
                abi:UNISWAP_V3_POSITION_MANAGER_ABI,
                address: NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS,
                functionName:'positions',
                args:[tokenId]
            }) 
            console.log('[PositionsHome] postion=', postion)
            return postion  
        } catch (error) {
          console.log('failed to get position details:', error) 
          throw error 
        } 
    }
    
    const closeIncreaseLiquidityModal = () => {
        setOpenIncreaseLiquidity(false)
    }

    const closeDecreaseLiquidity = () => {
        setOpenDecreaseLiquidity(false)
    }

    const closeCollectFee = () => {
        setOpenCollectFee(false)
    }

    const getPosition = async (tokenId: bigint) => {
        const details = await getPositionDetail(tokenId) as [bigint, `0x${string}`, `0x${string}`, `0x${string}`, number, number, number, bigint, bigint, bigint, bigint, bigint]
        const token0: TokenType = {chainId: 31337, name: 'USD Coin', symbol: 'USDC', alias: 'usdc', decimal: 6, address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'}
        const token1: TokenType = {chainId: 31337, name: 'Wrapped Ether', symbol: 'WETH', alias: 'weth', decimal: 18, address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'}
        const position: PositionProps = {
            id: tokenId, 
            token0: token0, 
            token1: token1, 
            lowerTick: details[5], 
            upperTick: details[6], 
            liquidity: details[7], 
            tokensOwed0:details[10], 
            tokensOwed1:details[11], 
            status: false, 
            fee: details[4], 
            wallet: ''}
        return position
    }

    const handleOpenIncreaseLiquidity = async () => {
        // we should call backend API instead
        try {
            const position = await getPosition(BigInt(1046268))
            const poolAddress = await getPoolAddress(position.token0.address, position.token1.address, position.fee)
            const poolInfo = await fetchLatestPoolInfo(poolAddress, chainId)
            if (!poolInfo) throw new Error('Failed to get poolInfo')
            setOpenIncreaseLiquidity(true)
            setGlobal({poolInfo: poolInfo, position: position})
        } catch (error) {
            console.log(error)
            toast.error('Failed to increase liquidity. Please try again')
        }
    }

    const handleOpenDecreaseLiquidity = async () => {
        try {
            const position = await getPosition(BigInt(1046268))
            setOpenDecreaseLiquidity(true)
            setGlobal({position: position})
        } catch (error) {
            console.log(error)
            toast.error('Failed to decrease liquidity. Please try again')
        }
    }

    const handleOpenCollectFee = async () => {
        try {
            const position = await getPosition(BigInt(1046268))
            setOpenCollectFee(true)
            setGlobal({position: position})
        } catch(error) {
            console.log(error)
            toast.error('Failed to collect fee. Please try again')
        }
    }

    return (
        <div>
            <TabsContent value="positions">
                <Table>
                    <TableCaption>A list of recent positions.</TableCaption>
                    <TableHeader className="bg-zinc-700 sticky top-20">
                        <TableRow>
                            <TableHead className="text-white font-bold">Position ID</TableHead>
                            <TableHead className="text-white font-bold">Token0<br/>Token1</TableHead>
                            <TableHead className={`text-white font-bold max-md:hidden`}>Ticks</TableHead>
                            <TableHead className={`text-white font-bold max-md:hidden`}>Liquidity</TableHead>
                            <TableHead className={`text-white font-bold max-md:hidden`}>Status</TableHead>
                            <TableHead className="text-white font-bold">Fee</TableHead>
                            <TableHead className={`text-white font-bold max-md:hidden`}>Wallet</TableHead>
                            <TableHead className="text-center text-white">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                    {
                        PositionListData.map((position, index) => (
                            <>
                                <TableRow key={index} className="border-zinc-400/40 hover:bg-muted/20">
                                    <TableCell className="font-medium ">{position.id}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-col space-y-1">
                                            <Token token={position.token0} imageSize={20}/>
                                            <Token token={position.token1} imageSize={20}/>
                                        </div>
                                    </TableCell>
                                    <TableCell className={`max-md:hidden`}>
                                        <div>
                                            <div><span className="font-bold">Low:</span>{position.lowerTick}</div>
                                            <div><span className="font-bold">High:</span>{position.upperTick}</div>
                                        </div>
                                    </TableCell>
                                    <TableCell className={`max-md:hidden`}>
                                        <ToolTipHelper content={`${position.liquidity}`}>
                                            <div className="w-[100px] truncate">{position.liquidity.toString()}</div>
                                        </ToolTipHelper>
                                    </TableCell>
                                    <TableCell className={`max-md:hidden`}>   
                                        <ToolTipHelper content={`${position.status ? 'In range': 'Out of range'}`}>
                                            <div className={`w-3 h-3 rounded-full ${position.status ? 'bg-lime-500' : 'bg-red-500'}`}/>
                                        </ToolTipHelper>                                
                                        
                                    </TableCell>
                                    <TableCell>{position.fee}%</TableCell>
                                    <TableCell className={`max-md:hidden`}>
                                        <ToolTipHelper content={<p><strong>Address : </strong>{position.wallet}</p>}>
                                            <div className="w-[78px] truncate">{position.wallet}</div>
                                        </ToolTipHelper>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <div>
                                            <div>
                                                <ToolTipHelper content="Increase liquidlity">
                                                    <SVGPlus className="cursor-pointer w-5 h-5 hover:text-pink-600" 
                                                            onClick={() => handleOpenIncreaseLiquidity()}/>
                                                </ToolTipHelper>                                                               
                                            </div>
                                            <div>
                                                <ToolTipHelper content="Decrease liquidlity">
                                                    <SVGMinus className="cursor-pointer w-5 h-5 hover:text-pink-600" 
                                                            onClick={() => handleOpenDecreaseLiquidity()}/>
                                                </ToolTipHelper>
                                            </div>
                                            <div>
                                                <ToolTipHelper content="Collect fee">
                                                    <SVGWithdraw className="cursor-pointer w-5 h-5 hover:text-pink-600" 
                                                                onClick={() => handleOpenCollectFee()}/>
                                                </ToolTipHelper>                                            
                                            </div>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            </>
                        ))
                    }
                    </TableBody>
                </Table>
            </TabsContent>
            {
                openIncreaseLiquidity  && global && global.poolInfo && <IncreaseLiquidity
                                            poolInfo={global.poolInfo}
                                            dexPosition={global.position}
                                            token0Balance={tokenBalances.token0} token1Balance={tokenBalances.token1}
                                            closeDexModal={closeIncreaseLiquidityModal}/>
            }
            {
                openDecreaseLiquidity && global &&<DecreaseLiquidity 
                                                    dexPosition={global.position}
                                                    closeDexModal={closeDecreaseLiquidity}/>
            }
            {
                openCollectFee && global && <CollectFee 
                                    dexPosition={global.position}
                                    closeDexModal={closeCollectFee}/>
            }
        </div>
    )
}

export default PositionsHome