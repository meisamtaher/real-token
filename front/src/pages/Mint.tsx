import { useState,useEffect } from 'react';
import Button from '@mui/material/Button';
import { Grid, Typography } from '@mui/material';
import ImageUploadToIPFS from '../components/FileUpload';
import { useAccount, useContractWrite,usePrepareContractWrite, useWaitForTransaction } from 'wagmi';
import {  FractionalizeNFTContractAddress } from '../constants/constants';
import FNFT from "../constants/FractionalizedNFT.json";
import bs58 from 'bs58';
function Mint() {
  const account = useAccount();
  const [cid,setCid] = useState<string|undefined>(undefined);
  const [tokenId,setTokenId] = useState<string|undefined>(undefined);
  const reservable = false;
  const { config } = usePrepareContractWrite({
    address: FractionalizeNFTContractAddress,
    abi: FNFT.abi,
    functionName: 'mint',
    args: [account.address, tokenId,cid, reservable, account.address],
    enabled: Boolean(account.address && cid && tokenId && reservable!=null && account.address),
  })
  const { data ,write } = useContractWrite(config);
  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  })
  useEffect(()=>{
    if(cid){
      const bytes = bs58.decode(cid).slice(2);
      console.log("bytes: ",bytes);
      const byteArray = Array.from(bytes);
      const hexString = byteArray.map((byte) => byte.toString(16).padStart(2, '0')).join('');
      setTokenId("0x" + hexString);
    }
  },[cid]);
  return (
  <Grid container justifyContent={'center'} spacing={3} padding={7} direction="column" alignItems={'center'}>
    <ImageUploadToIPFS cid = {cid} setCid = {setCid}/>
    {isLoading && <Typography>Loading....</Typography>}
    {isSuccess && (
        <div>
          Successfully minted your NFT!
          <div>
            <a href={`https://mumbai.polygonscan.com/tx/${data?.hash}`}>Polygon Scan</a>
          </div>
        </div>
      )}
    {cid && <Typography>{cid}</Typography>}
    <Button disabled={cid == undefined} onClick={()=>{ console.log("Trying to mint..."); write?.(); }}>
       Mint
    </Button>
  </Grid>

  );
}
  
export default Mint;