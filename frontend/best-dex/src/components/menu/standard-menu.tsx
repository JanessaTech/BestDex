import React from 'react'
import Menu from './menu'
import { MenuType } from '@/lib/types'

type StandardMenuProps = {
    hidden: boolean
}

const StandardMenu: React.FC<StandardMenuProps>  = ({hidden}) => {
  return (
    <div className={`w-[200px] ${hidden ? 'hidden' : ''} flex min-h-screen`}>
      <Menu menuType={MenuType.StandarMenu} />
    </div>
  )
}

export default StandardMenu