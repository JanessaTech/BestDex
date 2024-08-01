
import SwapHome from "@/components/swap/SwapHome"
import TokenList from "@/components/token/TokenList"
import TokenLoading from "@/components/token/TokenLoading";
import { useTheme } from "next-themes";
import { Suspense } from "react";

export default function SwapPage() {
  // const { setTheme } = useTheme()
  // setTheme("light")
  return (
      <SwapHome/>  
  );
}
