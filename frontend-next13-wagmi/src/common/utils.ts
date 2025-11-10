import JSBI from 'jsbi'
import { Decimal } from 'decimal.js';
import { parseUnits} from 'viem'

Decimal.set({
    toExpNeg: -1e15, 
    toExpPos: 1e15 
  });

// bugs
export function fromReadableAmount(amount: number, decimals: number): JSBI {
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


export function fromReadableAmount2(amount: string, decimals: number) : string {
    const res = new Decimal(amount ? amount : 0).mul(new Decimal(10).pow(decimals)).toDecimalPlaces(decimals, Decimal.ROUND_HALF_UP).toString()
    return res
  }

// bug：fix when amount is empty or undefined
export function fromReadableAmount3(amount: string, decimals: number) : JSBI {
    return JSBI.BigInt(parseUnits(amount, decimals).toString())
  }
  