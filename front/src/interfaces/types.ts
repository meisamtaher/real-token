export interface ListedNFTProp{
    NFT:ListedNFT
    onClick: React.MouseEventHandler<HTMLElement>
}
export interface ListedNFT{
    name: string,
    img: string,
    address: string,
    price: number,
    price_token: string,
}