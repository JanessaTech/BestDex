export type TokenType = {
    chainId: number;
    name: string;
    label: string;
    address: string;
    company?: string
}
export type TokenListType = {chainId: number, tokens: TokenType[]}[]