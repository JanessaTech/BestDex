import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import JSBI from 'jsbi'
import { ZERO_ADDRESS } from "@/config/constants"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

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

export function isZeroAddress(address: `0x${string}`) {
  if (!address) return false;
  return address.toLowerCase() === ZERO_ADDRESS.toLowerCase();
}
