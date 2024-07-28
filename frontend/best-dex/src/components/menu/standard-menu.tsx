import React from 'react'

type StandardMenuProps = {
    hidden: boolean
}

const StandardMenu: React.FC<StandardMenuProps>  = ({hidden}) => {
  return (
    <div className={`w-[200px] ${hidden ? 'hidden' : ''} text-red-500`}>
            StandardMenu
    </div>
  )
}

export default StandardMenu