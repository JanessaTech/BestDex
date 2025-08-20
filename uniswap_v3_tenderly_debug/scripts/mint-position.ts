import { ethers} from 'ethers'

enum TransactionState {
    Failed = 'Failed',
    New = 'New',
    Rejected = 'Rejected',
    Sending = 'Sending',
    Sent = 'Sent',
}
const mainnetProvider = new ethers.providers.JsonRpcProvider("https://eth-mainnet.g.alchemy.com/v2/QLyqy7ll-NxAiFILvr2Am")
const localProvider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:8545/')
//const localProvider = new ethers.providers.JsonRpcProvider('https://virtual.mainnet.eu.rpc.tenderly.co/788e8993-30e7-40ea-8442-f5b91c13efd0')
const walletInfo =  {
    address: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
    privateKey:
      'ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
}

function createWallet(): ethers.Wallet {
    let provider = mainnetProvider
    provider = localProvider
    return new ethers.Wallet(walletInfo.privateKey, provider)
}

const wallet = createWallet()



async function mintPosition(): Promise<TransactionState> {


    return TransactionState.Sent
}