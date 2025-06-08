'use client'
import { useState } from "react"

type MenuProps = {}
const Menu: React.FC<MenuProps> = () => {
    const [width, setWidth] = useState<Number>(200)
    console.log('width:', width)
    return (
        <div className={`bg-blue-200 h-screen w-[200px] sticky top-0 max-md:hidden`}>
            <div className="flex flex-col h-full">
                <div className="h-[120px] bg-yellow-200">
                    <button className="bg-zinc-500 rounded-full" onClick={() => setWidth(100)}>show</button>
                </div>
                <div className="grow bg-red-200 w-full">

                </div>
                <div className="h-[80px] bg-lime-500">

                </div>
            </div>
        </div>
    )
}

export default Menu