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
import { useEffect, useState } from "react"
import IncreaseLiquidity from "@/components/pool/IncreaseLiquidity"
import DecreaseLiquidity from "@/components/pool/DecreaseLiquidity"
import CollectFee from "@/components/pool/CollectFee"
import { IContextUtil, useContextUtil } from "@/components/providers/ContextUtilProvider"
import { toast } from 'sonner'
import { useChainId, useAccount} from 'wagmi'
import { PositionProps } from "@/common/types"
import logger from "@/common/Logger"
import { fetchLatestPoolInfo } from "@/lib/client/Pool"
import { getPositionsByPage } from "@/lib/client/Position"
import { Skeleton } from "@/components/ui/skeleton"
import DexPagination from "@/components/common/DexPagination"
import { PoolInfo } from "@/lib/client/types"

type GlobalVariableType = {
    poolInfo?: PoolInfo;
    position: PositionProps
}
type ShowPositionsProps = {
    positions: PositionProps[];
    handleOpenIncreaseLiquidity: (position: PositionProps) => Promise<void>;
    handleOpenDecreaseLiquidity: (position: PositionProps) => Promise<void>;
    handleOpenCollectFee: (position: PositionProps) => Promise<void>
}

const ShowPositions: React.FC<ShowPositionsProps> = ({positions, 
                                                    handleOpenIncreaseLiquidity, 
                                                    handleOpenDecreaseLiquidity, 
                                                    handleOpenCollectFee}) => {
    const {isWSConnected} = useContextUtil() as IContextUtil

    return (
        <>
        {
            positions.map((position, index) => (
                <>
                    <TableRow key={index} className="border-zinc-400/40 hover:bg-muted/20">
                        <TableCell className="font-medium ">{position.tokenId}</TableCell>
                        <TableCell>
                            <div className="flex flex-col space-y-1">
                                <Token token={position.token0} imageSize={20}/>
                                <Token token={position.token1} imageSize={20}/>
                            </div>
                        </TableCell>
                        <TableCell className="max-md:hidden">
                            <div>
                                <div><span className="font-bold">Low:</span>{position.tickLower}</div>
                                <div><span className="font-bold">High:</span>{position.tickUpper}</div>
                            </div>
                        </TableCell>
                        <TableCell>{position.fee/10000}%</TableCell>
                        <TableCell className="max-md:hidden"><span>{position.liquidity.toString()}</span></TableCell>
                        <TableCell className="max-md:hidden">
                            <ToolTipHelper content={<p><strong>Address : </strong>{position.owner}</p>}>
                                <div className="w-[78px] truncate">{position.owner}</div>
                            </ToolTipHelper>
                        </TableCell>
                        <TableCell className="text-center">
                            <div>
                                <div>
                                    <ToolTipHelper content="Increase liquidlity">
                                        <SVGPlus className="cursor-pointer w-5 h-5 hover:text-pink-600" 
                                                onClick={isWSConnected ? () => handleOpenIncreaseLiquidity(position): () => {}}/>
                                    </ToolTipHelper>                                                               
                                </div>
                                <div>
                                    <ToolTipHelper content="Decrease liquidlity">
                                        <SVGMinus className="cursor-pointer w-5 h-5 hover:text-pink-600" 
                                                onClick={isWSConnected ? () => handleOpenDecreaseLiquidity(position): () => {}}/>
                                    </ToolTipHelper>
                                </div>
                                <div>
                                    <ToolTipHelper content="Collect fee">
                                        <SVGWithdraw className="cursor-pointer w-5 h-5 hover:text-pink-600" 
                                                    onClick={() => handleOpenCollectFee(position)}/>
                                    </ToolTipHelper>                                            
                                </div>
                            </div>
                        </TableCell>
                    </TableRow>
                </>
            ))
        }
        </>
    )
}

const ShowPositionSkeleton:React.FC<{}> = () => {
    return (
        <>
        {
            Array(10).fill(undefined).map((_, index) => (
                <>
                 <TableRow key={index} className="border-zinc-400/40 hover:bg-muted/20">
                    <TableCell className="font-medium "><Skeleton className="h-4 w-[70px]" /></TableCell>
                    <TableCell>
                            <div className="flex flex-col space-y-1">
                                <Skeleton className="h-4 w-[60px]" />
                                <Skeleton className="h-4 w-[60px]" />
                            </div>
                    </TableCell>
                    <TableCell className="max-md:hidden">
                            <div className="flex flex-col space-y-1">
                                <Skeleton className="h-4 w-[50px]" />
                                <Skeleton className="h-4 w-[50px]" />
                            </div>
                    </TableCell>
                    <TableCell><Skeleton className="h-4 w-[40px]" /></TableCell>
                    <TableCell className="max-md:hidden"><Skeleton className="h-4 w-[100px]"/></TableCell>
                    <TableCell className="max-md:hidden">
                            <Skeleton className="h-4 w-[80px]" />
                    </TableCell>
                    <TableCell className="text-center">
                        <div className="flex flex-col space-y-1">
                            <div><Skeleton className="h-4 w-[80px]" /></div>
                            <div><Skeleton className="h-4 w-[80px]" /></div>
                            <div><Skeleton className="h-4 w-[80px]" /></div>
                        </div>
                    </TableCell>
                 </TableRow>
                </>
            ))
        }
        </>
    )
}

type PositionsHomeProps = {
    value: string
}
const PositionsHome: React.FC<PositionsHomeProps> = ({value}) => {
    const chainId = useChainId()
    const { address} = useAccount()

    const [openIncreaseLiquidity, setOpenIncreaseLiquidity] = useState(false)
    const [openDecreaseLiquidity, setOpenDecreaseLiquidity] = useState(false)
    const [openCollectFee, setOpenCollectFee] = useState(false)

    const [global, setGlobal] = useState<GlobalVariableType>()
    
    const {getPoolAddress, getLatestPoolInfoByRPC, getLatestPoolInfoByWS, getTokenBalance} = useContextUtil() as IContextUtil
    const [page, setPage] = useState(1)
    const [positions, setPositions] = useState<PositionProps[]>([])
    const [isLoading, setIsLoading] = useState(false)
    
    useEffect(() => {
        if (value === 'positions' && address) {
            loadPositionList()
        }   
    }, [value, address, page])

    const loadPositionList = async () => {
        logger.debug('[PositionsHome] loadPositionList. page=', page)
        const start = performance.now()
        //setIsLoading(true)
        const positions = await getPositionsByPage(chainId, address!, page)
        if (positions) {
            setPositions(positions) 
        }
        // const end = performance.now()
        // const elapse = end - start
        // if (elapse < PAGE_LOAD_SKETETON_SPAN) {
        //     setTimeout(() => {
        //         setIsLoading(false) 
        //     }, PAGE_LOAD_SKETETON_SPAN); 
        // } else {
        //     setIsLoading(false) 
        // }
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

    const handleOpenIncreaseLiquidity = async (position: PositionProps) => {
        try {
            const poolAddress = await getPoolAddress(position.token0.address, position.token1.address, position.fee)
            const poolInfo = await getLatestPoolInfoByWSHttpRPC(chainId, poolAddress)
            setOpenIncreaseLiquidity(true)
            setGlobal({poolInfo: poolInfo, position: position})
        } catch (error) {
            logger.error(error)
            toast.error('Failed to increase liquidity. Please try again')
        }
    }

    const getLatestPoolInfoByWSHttpRPC = async (chainId: number, poolAddress: `0x${string}`) => { 
        try {
            let poolInfo  = getLatestPoolInfoByWS(chainId, poolAddress.toLowerCase()) // get the poolInfo by websocket
            if (poolInfo) {
                logger.debug('Get poolInfo by ws')
                return poolInfo
            } 
            poolInfo = await fetchLatestPoolInfo(poolAddress, chainId) // get the poolInfo by restful
            if (poolInfo) {
                logger.debug('Get poolInfo by restful')
                return poolInfo
            }
        } catch (error) {
            logger.error(error)
        }

        try {
            let poolInfo = await getLatestPoolInfoByRPC(poolAddress)  // get the poolInfo by rpc
            if (poolInfo) {
                logger.debug('Get poolInfo by rpc')
                return poolInfo
            }
        } catch (error) {
            logger.error('Failed to get the poolInfo by RPC due to:', error)
        }
        // throw error if we cannot get the latest pool info by all ways: ws, rest and rpc
        throw new Error('Failed to get the latest poolInfo by trying 3 ways:websocket, restful and rpc')
    }

    const handleOpenDecreaseLiquidity = async (position: PositionProps) => {
        try {
            setOpenDecreaseLiquidity(true)
            setGlobal({position: position})
        } catch (error) {
            logger.error(error)
            toast.error('Failed to decrease liquidity. Please try again')
        }
    }

    const handleOpenCollectFee = async (position: PositionProps) => {
        try {
            setOpenCollectFee(true)
            setGlobal({position: position})
        } catch(error) {
            logger.error(error)
            toast.error('Failed to collect fee. Please try again')
        }
    }

    return (
        <div>
            <TabsContent value="positions">
                <Table>
                    <TableHeader className="bg-zinc-700 sticky top-20">
                        <TableRow>
                            <TableHead className="text-white font-bold">Position ID</TableHead>
                            <TableHead className="text-white font-bold">Token0<br/>Token1</TableHead>
                            <TableHead className={`text-white font-bold max-md:hidden`}>Ticks</TableHead>
                            <TableHead className="text-white font-bold">Fee</TableHead>
                            <TableHead className="text-white font-bold max-md:hidden">Liquidity</TableHead>
                            <TableHead className={`text-white font-bold max-md:hidden`}>Owner</TableHead>
                            <TableHead className="text-center text-white">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                    {
                        isLoading  
                        ? <ShowPositionSkeleton/>
                        : <ShowPositions 
                                positions={positions} 
                                handleOpenIncreaseLiquidity={handleOpenIncreaseLiquidity}
                                handleOpenDecreaseLiquidity={handleOpenDecreaseLiquidity}
                                handleOpenCollectFee={handleOpenCollectFee}/>
                    }
                    
                    </TableBody>
                </Table>
                <div className="py-10">
                <DexPagination page={page} totalPages={1000} setPage={setPage}/> 
            </div>
            </TabsContent>
            {
                openIncreaseLiquidity  && global && global.poolInfo && <IncreaseLiquidity
                                            poolInfo={global.poolInfo}
                                            dexPosition={global.position}
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