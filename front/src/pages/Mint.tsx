import { useState,useEffect } from 'react';
import Button from '@mui/material/Button';
import { Grid, Typography } from '@mui/material';
import ImageUploadToIPFS from '../components/FileUpload';
import { useAccount, useContractWrite,usePrepareContractWrite, useWaitForTransaction } from 'wagmi';
import {  FractionalizeNFTContractAddress } from '../constants/constants';
import FNFT from "../constants/FractionalizedNFT.json";
import { cidToUint256Str } from '../utils/cidConvert';
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
      const temp = cidToUint256Str(cid);
      setTokenId(temp);
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