import { defaultNetwork, networks } from "@/lib/constants"
import { NetworkType } from "@/lib/types"

type NetworkConnectProps = {
    network: NetworkType,
    handleNetworkChange: (network:NetworkType) => void
}

const NetworkConnect : React.FC<NetworkConnectProps> = ({network, handleNetworkChange}) => {

    const networkChange = (chainId: number) => {
        let network = networks.find((network) => network.chainId === chainId)
        network = network || defaultNetwork
        handleNetworkChange(network)
    }

    return (
        <div className="max-md:m-4 text-zinc-600">
            <ul className="cursor-pointer font-medium">
                {
                    networks.map((net) => (
                        <li key={net.chainId} className="h-[50px] hover:bg-zinc-200 rounded-lg 
                        flex items-center justify-between px-2"
                        onClick={(e) => networkChange(net.chainId)}>
                            <div className="flex items-center">
                                <img src={`/imgs/networks/${net.name}.png`} alt={net.name} />
                                <span className="ml-2">{net.label}</span>
                            </div>
                            <img src="/imgs/check.svg" alt="check" className={network.chainId === net.chainId ? "" : 'hidden'}/>
                        </li>
                    ))
                }
            </ul>
        </div>
    )
}

export default NetworkConnect