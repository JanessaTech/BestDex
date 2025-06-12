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
import type { TokenListType, TokenType } from "@/lib/types"

const tokenList: TokenListType = [
  {
    chainId: 1,  
    tokens: [
      {name: 'usdt', label: 'USDT', address: '1111'}, 
      {name: 'weth', label: 'WETH', address: '2222'}
    ]
  },
  {
    chainId: 137,  
    tokens: [
      {name: 'pol', label: 'POL', address: '3333'}, 
      {name: 'weth', label: 'WETH', address: '4444'},
      {name: 'usdt', label: 'USDT', address: '5555'}
    ]
  },
  {
    chainId: 42161,  
    tokens: [
      {name: 'dai', label: 'DAI', address: '666'}, 
      {name: 'wbtc', label: 'WBTC', address: '777'},
      {name: '1inch', label: '1INCH', address: '888'}
    ]
  },
  {
    chainId: 11155111,  
    tokens: []
  },
  {
    chainId: 31337,  
    tokens: []
  }
]

type TokenOptionProps = {
  tokenOpen: boolean;
  chainId: number;
  curToken: TokenType | undefined;
  onOpenChange: (open: boolean) => void;
  handleSwitchToken: (chainId: number, address: string) => void;
  updateToken: React.Dispatch<React.SetStateAction<TokenType | undefined>>
}
const TokenOption:React.FC<TokenOptionProps> = ({tokenOpen, chainId, curToken, onOpenChange, handleSwitchToken, updateToken}) => {

    const [value, setValue] = React.useState("")
    const tokens = tokenList.filter((l) => l.chainId === chainId)[0].tokens
    console.log(tokens)

    return (
        <Popover open={tokenOpen} onOpenChange={onOpenChange}>
          <PopoverTrigger asChild>
                    <div className={`border-y-[1px] border-l-[1px] border-zinc-700 rounded-l-md hover:bg-zinc-600/10 
                    cursor-pointer box-border px-5 flex justify-between items-center ${tokenOpen ? 'w-full border-r-[1px] rounded-r-md' : 'w-2/5'}`}>
                        <div className='flex items-center text-nowrap overflow-hidden'>
                          {
                            curToken ?<><Image src={`/imgs/tokens/${curToken?.name}.png`} alt='eth'width={30} height={30} className="min-w-[30px] rounded-full"/><span className='mx-2 truncate min-w-1'>{curToken.label}</span></> 
                            : <><div className="w-[30px] h-[30px] rounded-full bg-zinc-500 min-w-[30px]"></div><span className='mx-2 truncate min-w-1'>Choose a token</span></>
                          }
                            
                            
                        </div>
                        <SVGArrowDown className='w-5 h-5 text-white'/>
                    </div>
          </PopoverTrigger>
          <PopoverContent className="PopoverContent p-0 border-zinc-600 border-[1px]">
            <Command className="bg-zinc-900" filter={(value, search, keywords) => {
                const extendValue = value + ' ' + keywords?.join(' ')
                console.log('value: ', value + '  search:', search, + ' keywords:', keywords)
                if (extendValue.includes(search)) return 1
                return 0
            }}>
              <CommandInput placeholder="Search token..." className="h-12 text-white" />
              <CommandList>
                <CommandEmpty>No token found.</CommandEmpty>
                <CommandGroup>
                  {tokens.map((token, _) => (
                    <CommandItem
                    key={`${chainId}-${token.address}`}
                    value={token.name}
                    onSelect={(currentValue) => {
                      setValue(currentValue === value ? "" : currentValue)
                      handleSwitchToken(chainId, token.address)
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
                        value === token.name ? "opacity-100" : "opacity-0"
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