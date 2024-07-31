export type NetworkType = {
    chainId: number
    name: string
    label: string
}
export type TokenType = {
    chainId: number,
    name: string,
    label: string,
    address: string
}

export type SvgProps = {
    className?: string,
    onClick?: () => void
}

export enum MenuType {
    MinMenu,
    StandarMenu,
    MobileMenu
}