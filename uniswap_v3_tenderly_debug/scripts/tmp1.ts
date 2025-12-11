import { ethers} from 'ethers'

async function test1() {
    const provider = new ethers.providers.JsonRpcProvider('https://eth.llamarpc.com')
    const tx = await provider.getTransaction('0xbacbe1ca67147f6b718d4f7464e11fea502f202033bce6281796dc6cb5544318')
    console.log(tx)
}

async function main() {
    await test1()
}

main().catch((e) => console.log(e))

//npx hardhat run scripts\tmp1.ts