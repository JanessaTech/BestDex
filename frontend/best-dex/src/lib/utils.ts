import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import type { TokenType } from "./types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isTokenSame(token1: TokenType | undefined, token2: TokenType | undefined) {
  if (token1 && token2 
    && token1.chainId === token2.chainId 
    && token1.address === token2.address) return true
  return false;
}
