import ToolTipHelper from "../common/ToolTipHelper"
import SVGXCircle from "@/lib/svgs/svg_x_circle"
import { useEffect, useState } from "react"
import SVGCheck from "@/lib/svgs/svg_check"
import SVGPlusCircle from "@/lib/svgs/svg_plus_circle"
import { useWriteContract,
        useWaitForTransactionReceipt
       } from 'wagmi'
import { NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS, UNISWAP_V3_POSITION_MANAGER_ABI } from "@/config/constants"
import { MintPositionParamsType } from "@/lib/types"

type AddPositionStepProps = {
    started: boolean;
    parsedCalldata: MintPositionParamsType,
    handleAddSuccess: () => void;
}
type StateType = {
    reason: string;
    isSuccess: boolean;
    isPending: boolean;
}
const defaultState: StateType = {
    reason: '',
    isSuccess: false,
    isPending: true,
}

const AddPositionStep:React.FC<AddPositionStepProps> = ({started, parsedCalldata, 
                                                            handleAddSuccess}) => {
    const [state, setState] = useState<StateType>(defaultState)
    const {data: hash, writeContract, isSuccess:isWriteSuccess, isPending:isWritePending, error:writeError } = useWriteContract()
    const {data: receipt, isError, error: receiptError, status: receiptStatus, refetch: refetchReceipt} = useWaitForTransactionReceipt({
        hash: hash,
        confirmations: 1,
        query: {
            enabled: false,
            gcTime: 0,  // disable cache
            staleTime: 0  // disable cache
        }
    })

    const handleAddPosition = () => {
        writeContract({
            address: NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS,
            abi: UNISWAP_V3_POSITION_MANAGER_ABI,
            functionName: 'mint',
            args: [parsedCalldata],
        })
    }

    useEffect(() => {
        let timer = undefined
        if (started) {
            timer = setTimeout(() => {
                console.log('[AddPositionStep] it will run handleAddPosition')
                setState({...state, isPending: true})
                handleAddPosition()
            }, 1000)
        }
        return () => {
            if (timer) clearTimeout(timer)
        }
    }, [started])

    useEffect(() => {
        if (hash) {
            console.log('[AddPositionStep] it will fetch the receipt')
            refetchReceipt()
        }
    }, [hash])

    useEffect(() => {
        (async () => {
            if (!hash || !receipt) return
            if (receipt.status === 'success') {
                console.log('[AddPositionStep] A new position is added')
                setState({...state, isPending: false, isSuccess: true})
            }
        })() 
    }, [receipt, hash])

    useEffect(() => {
        let timer = undefined
        if (state.isSuccess) {
            console.log('it will handleAddSuccess in 1000 milliseconds')
            timer = setTimeout(() => {
                //handleAddSuccess()
            }, 1000)
        }
        return () => {
            if (timer) clearTimeout(timer)
        }
    }, [state.isSuccess])

    useEffect(() => {
        if(receiptError) {
            //const failedReason = getFailedReason(receiptError)
            const failedReason = 'xxx'
            setState({...state, isPending: false, isSuccess: false, reason: failedReason})
        }
    }, [receiptError])
    
    console.log('[AddPositionStep] ====== Latest state ========')
    console.log('[AddPositionStep] isSuccess=', state.isSuccess, ' isPending=', state.isPending)
    console.log('[AddPositionStep]', ' hash=', hash)
    console.log('[AddPositionStep] writeError=', writeError)
    console.log('[AddPositionStep] isWriteSuccess=', isWriteSuccess, ' isWritePending=', isWritePending)
    console.log('[AddPositionStep] receipt=', receipt)
    console.log('[AddPositionStep] receiptStatus=', receiptStatus)
    console.log('[AddPositionStep] receiptError=', receiptError)
    
    return (
        <div className="flex justify-between items-center">
            <div className="flex items-center relative">
                <div className={`size-6 border-[1px] rounded-full border-pink-600 border-t-transparent animate-spin absolute ${state.isPending && started? '' : 'hidden'}`}/>
                <SVGPlusCircle className="text-white size-4 ml-[4px]"/>
                <div className={`text-xs pl-4 ${state.isSuccess
                                                ? 'text-zinc-400'  
                                                : receiptError
                                                    ? 'text-red-600'
                                                    : 'text-pink-600'}`}>{state.isSuccess
                                                                                ? `A new position is added` 
                                                                                :   receiptError
                                                                                    ? `Failed to add a new postion`
                                                                                    : `Add a new postion`                                                   
                                                                                    }</div>
            </div>
            {
                state.isPending
                ? <></>
                : state.isSuccess
                    ? <SVGCheck className="size-4 text-green-600 mx-3"/>
                    : <ToolTipHelper content={<div className="w-80">{state.reason}</div>}>
                        <SVGXCircle className="size-5 text-red-600 bg-inherit rounded-full cursor-pointer mx-3"/>
                      </ToolTipHelper>
            }  
        </div>
    )
}

export default AddPositionStep