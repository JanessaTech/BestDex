export type TokenType = {
    name: string;
    label: string;
    address: string
}
export type TokenListType = {chainId: number, tokens: TokenType[]}[]