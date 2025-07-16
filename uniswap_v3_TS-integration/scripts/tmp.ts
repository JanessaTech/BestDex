import { ethers, providers, BigNumber} from 'ethers'
import { Decimal } from 'decimal.js';

function test() {
    const result = new Decimal(97000).times(new Decimal(5136211410)).div('1000000000000000000').toDecimalPlaces(18, Decimal.ROUND_HALF_UP).toString()
    console.log(result)
}
test()

// npx ts-node .\scripts\tmp.ts 