import React from 'react'
import Menu from './menu'

type MinMenuProps = {
    hidden: boolean
}

const MinMenu: React.FC<MinMenuProps> = ({hidden}) => {
  return (
    <div className={`w-[80px] ${hidden ? 'hidden' : ''} flex min-h-screen`}>
       <Menu isMin={true} />
    </div>
  )
}

export default MinMenu