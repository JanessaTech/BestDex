import { ZERO_ADDRESS } from "@/config/constants";

export function isZeroAddress(address: `0x${string}`) {
    if (!address) return false;
    return address.toLowerCase() === ZERO_ADDRESS.toLowerCase();
  }