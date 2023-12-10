export interface ListedNFTProp{
    NFT:ListedNFT
    onClick: React.MouseEventHandler<HTMLElement>
}
export interface OwnedNFTProp{
    NFT:OwnedNFT
    onClick: React.MouseEventHandler<HTMLElement>
}
export interface ListedNFT{
    name: string,
    img: string,
    tokenId: string
    price: number,
    price_token: string,
}
export interface OwnedNFT{
    name: string,
    image: string,
    tokenId: string
}