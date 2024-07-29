import React from 'react'
import Menu from './menu'

type StandardMenuProps = {
    hidden: boolean
}

const StandardMenu: React.FC<StandardMenuProps>  = ({hidden}) => {
  return (
    <div className={`w-[200px] ${hidden ? 'hidden' : ''} flex min-h-screen`}>
      <Menu isMin={false} />
    </div>
  )
}

export default StandardMenu