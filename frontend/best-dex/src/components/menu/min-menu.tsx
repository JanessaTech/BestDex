import React from 'react'
import Menu from './menu'
import { MenuType } from '@/lib/types'

type MinMenuProps = {
    hidden: boolean
}

const MinMenu: React.FC<MinMenuProps> = ({hidden}) => {
  return (
    <div className={`w-[80px] ${hidden ? 'hidden' : ''} flex min-h-screen`}>
       <Menu menuType={MenuType.MinMenu} />
    </div>
  )
}

export default MinMenu