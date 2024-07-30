import React from 'react'
import Menu from './Menu'
import { MenuType } from '@/lib/types'

type MobileMenuProps = {
    show: boolean,
    setShow: React.Dispatch<React.SetStateAction<boolean>>
}

const MobileMenu: React.FC<MobileMenuProps> = ({show, setShow}) => {

    return (
        <div className={`fixed top-0 left-0 w-full h-screen bg-black ${show ? '': 'hidden'}`}>
            <div className='m-8 flex flex-col'>
                <div className='flex justify-end'>
                    <div className='w-[32px] h-[32px] rounded-full
                    hover:bg-zinc-500 active:bg-zinc-400
                    flex justify-center items-center cursor-pointer' onClick={() => setShow(false)}>
                        <img src="/imgs/close.svg" alt="close" />
                    </div>
                </div>
                <Menu menuType={MenuType.MobileMenu} setShow={setShow}/>             
            </div>
        </div>
    )
}

export default MobileMenu


