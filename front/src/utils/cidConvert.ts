import bs58 from "bs58";
export function cidToUint256Str(cid:string){
    const bytes = bs58.decode(cid).slice(2);
    const byteArray = Array.from(bytes);
    const hexString = byteArray.map((byte) => byte.toString(16).padStart(2, '0')).join('');
    return "0x" +hexString;
}
export function uint256toCid(tokenId:bigint){
    const hexString = tokenId.toString(16);
    const cidhex = "1220" +hexString;
    const cidbytes = hexToBytes(cidhex);
    const cid = bs58.encode(cidbytes) 
    return cid
}
function hexToBytes(hex:string) {
    let bytes = [];
    for (let c = 0; c < hex.length; c += 2)
        bytes.push(parseInt(hex.substr(c, 2), 16));
    return bytes;
}
