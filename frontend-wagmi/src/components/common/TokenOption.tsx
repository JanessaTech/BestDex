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

const frameworks = [
    {
      value: "next.js",
      label: "Next.js",
    },
    {
      value: "sveltekit",
      label: "SvelteKit",
    },
    {
      value: "nuxt.js",
      label: "Nuxt.js",
    },
    {
      value: "remix",
      label: "Remix",
    },
    {
      value: "astro",
      label: "Astro",
    },
  ]

const tokenList = [
  {
    chainId: 1,  
    tokens: [
      {name: 'USDT', label: 'usdt', address: '1111'}, 
      {name: 'WETH', label: 'weth', address: '2222'}
    ]
  },
  {
    chainId: 137,  
    tokens: [
      {name: 'POL', label: 'pol', address: '3333'}, 
      {name: 'WETH', label: 'weth', address: '4444'},
      {name: 'USDT', label: 'usdt', address: '5555'}
    ]
  },
  {
    chainId: 42161,  
    tokens: [
      {name: 'DAI', label: 'dai', address: '666'}, 
      {name: 'WBTC', label: 'wbtc', address: '777'},
      {name: '1INCH', label: '1inch', address: '888'}
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
  chainId: number,
  onOpenChange: (open: boolean) => void;
  handleSwitchToken: (chainId: number, address: string) => void
}
const TokenOption:React.FC<TokenOptionProps> = ({tokenOpen, chainId, onOpenChange, handleSwitchToken}) => {

    const [value, setValue] = React.useState("")
    const tokens = tokenList.filter((l) => l.chainId === chainId)[0].tokens
    console.log(tokens)

    return (
        <Popover open={tokenOpen} onOpenChange={onOpenChange}>
          <PopoverTrigger asChild>
                    <div className={`border-y-[1px] border-l-[1px] border-zinc-700 rounded-l-md hover:bg-zinc-600/10 
                    cursor-pointer box-border px-5 flex justify-between items-center ${tokenOpen ? 'w-full border-r-[1px] rounded-r-md' : 'w-2/5'}`}>
                        <div className='flex items-center'>
                            <Image src="/imgs/tokens/eth.png" alt='eth'width={30} height={30}/>
                            <span className='ml-2'>ETH</span>
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
                <CommandGroup className="">
                  {frameworks.map((framework, _) => (
                    <CommandItem
                    key={framework.value}
                    value={framework.value}
                    onSelect={(currentValue) => {
                      setValue(currentValue === value ? "" : currentValue)
                      handleSwitchToken(1, 'aaa')
                    }}
                  >
                    {framework.label}
                    <Check
                      className={cn(
                        "ml-auto",
                        value === framework.value ? "opacity-100" : "opacity-0"
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