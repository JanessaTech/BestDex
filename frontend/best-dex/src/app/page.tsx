"use client"

import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { useState } from "react";

export default function Home() {
  // const { setTheme } = useTheme()
  // setTheme("light")
  const [width, setWidth] = useState(10)
  const handleWidth = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('handleWidth')
    const size = e.target.value
    setWidth(Number(size))
  }

  console.log('new width:', width)
  return (
    <div>
      <input name='setwidth' placeholder="setwidth" type="text" onChange={handleWidth}/>
      <Button onClick={() => {}}>hello Janessa</Button>
      <div className={`w-${width} h-[200px] bg-yellow-400`}></div>
      <div className="w-[500px] h-[200px] bg-emerald-600 flex">
        <div className="h-[200px] w-[20px]"></div>
        <div className="h-[200px] grow bg-red-700"></div>

      </div>
    </div>
  );
}
