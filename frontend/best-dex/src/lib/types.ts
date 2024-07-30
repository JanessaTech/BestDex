export type NetworkType = {
    chainId: number
    name: string
    label: string
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