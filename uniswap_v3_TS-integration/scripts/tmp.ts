import { ethers, providers, BigNumber} from 'ethers'
import { Decimal } from 'decimal.js';
import JSBI from 'jsbi'

function fromReadableAmount(amount: number, decimals: number): JSBI {
    const extraDigits = Math.pow(10, countDecimals(amount))
    const adjustedAmount = amount * extraDigits
    return JSBI.divide(
      JSBI.multiply(
        JSBI.BigInt(adjustedAmount),
        JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(decimals))
      ),
      JSBI.BigInt(extraDigits)
    )
  }

function countDecimals(x: number) {
    if (Math.floor(x) === x) {
        return 0
    }
    return x.toString().split('.')[1].length || 0
}

function test() {
    const amount = '1', decimal = 5
    const res = fromReadableAmount(Number(amount), decimal).toString()
    console.log(res)
}

test()

// npx ts-node .\scripts\tmp.ts 