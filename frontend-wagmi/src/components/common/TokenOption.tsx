"use client"

import * as React from "react"
import { Check} from "lucide-react"
import { cn } from "@/lib/utils"

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import Image from "next/image"
import SVGArrowDown from "@/lib/svgs/svg_arrow_down"
import type { TokenType } from "@/lib/types"
import Token from "./Token"
import { tokenList } from "@/lib/Data"

type TokenOptionProps = {
  tokenOpen: boolean;
  chainId: number;
  curToken: TokenType | undefined;
  showFull?: boolean;
  onOpenChange: (open: boolean) => void;
  closeTokenOption: () => void;
  updateToken: (from: TokenType | undefined) => void;
}
const TokenOption:React.FC<TokenOptionProps> = ({tokenOpen, chainId, curToken, showFull = true, onOpenChange, closeTokenOption, updateToken}) => {
    const tokens = tokenList.filter((l) => l.chainId === chainId)[0].tokens
   
    return (
        <Popover open={tokenOpen} onOpenChange={onOpenChange}>
          <PopoverTrigger asChild>
                    <div className={`border-y-[1px] border-l-[1px] border-zinc-700 rounded-l-md hover:bg-zinc-600/10 
                    cursor-pointer box-border px-5 flex justify-between items-center ${showFull || tokenOpen ? 'w-full border-r-[1px] rounded-r-md' : 'w-2/5'}`}>
                        <Token token={curToken} imageSize={30} className="flex items-center text-nowrap overflow-hidden" defaultLabel="Choose a token"/>
                        <SVGArrowDown className='w-5 h-5 text-white'/>
                    </div>
          </PopoverTrigger>
          <PopoverContent className="PopoverContent p-0 border-zinc-600 border-[1px]">
            <Command className="bg-zinc-900" filter={(value, search, keywords) => {
                // define your custom filter
                if (value.toLocaleLowerCase().includes(search.toLocaleLowerCase())) return 1
                return 0
            }}>
              <CommandInput placeholder="Search name or paste address" className="h-12 text-white" />
              <CommandList>
                <CommandEmpty>No token found.</CommandEmpty>
                <CommandGroup>
                  {tokens.map((token, _) => (
                    <CommandItem
                    key={`${chainId}-${token.address}`}
                    value={`${token.name};${token.address}`}
                    onSelect={(curName) => {
                      closeTokenOption()
                      updateToken(token)
                    }}
                  >
                    <div className="flex items-center">
                      <Image src={`/imgs/tokens/${token.name}.png`} alt={token.name} width={30} height={30}/>
                      <span className="px-2">{token.label}</span>
                    </div>
                    
                    <Check
                      className={cn(
                        "ml-auto",
                        curToken?.name === token.name ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                    
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
    )
}
export default TokenOption