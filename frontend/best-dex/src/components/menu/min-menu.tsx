import React from 'react'

type MinMenuProps = {
    hidden: boolean
}

const MinMenu: React.FC<MinMenuProps> = ({hidden}) => {
  return (
    <div className={`w-[80px] ${hidden ? 'hidden' : ''} text-red-500`}>
        MinMenu
    </div>
  )
}

export default MinMenu