'use client'

import {
    RecoilRoot,
    atom,
    selector,
    useRecoilState,
    useRecoilValue,
  } from 'recoil';

type RecoilProviderProps = {
    children: React.ReactNode
}


const RecoilProvider: React.FC<RecoilProviderProps> = ({children}) => {
    return (
        <>
        <RecoilRoot>
          {children}
        </RecoilRoot>
        </>
    )
}

export default RecoilProvider