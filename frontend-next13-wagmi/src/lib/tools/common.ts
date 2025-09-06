import { ZERO_ADDRESS } from "@/config/constants";

export function isZeroAddress(address: `0x${string}`) {
    return address.toLowerCase() === ZERO_ADDRESS.toLowerCase();
  }