import { useAccount} from 'wagmi'

const useTokenBalanceHook = () => {
    const { address} = useAccount()
    const fetchBalance  = async () => {

    }
}

export default useTokenBalanceHook