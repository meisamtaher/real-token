import { useState,useEffect } from 'react';
import Button from '@mui/material/Button';
import { Grid, Typography } from '@mui/material';
import ImageUploadToIPFS from '../components/FileUpload';
import { useAccount, useContractWrite,usePrepareContractWrite, useWaitForTransaction } from 'wagmi';
import {  FractionalizeNFTContractAddress,FReserverContractAddress } from '../constants/constants';
import FNFT from "../constants/FractionalizedNFT.json";
import FReserve from "../constants/Reserver.json";
import { cidToUint256Str } from '../utils/cidConvert';
function Mint() {
  const account = useAccount();
  const [cid,setCid] = useState<string|undefined>(undefined);
  const [tokenId,setTokenId] = useState<string|undefined>(undefined);
  const [reservable,setReservable] = useState<boolean>(false);
  const { config:FNFTConfig } = usePrepareContractWrite({
    address: FractionalizeNFTContractAddress,
    abi: FNFT.abi,
    functionName: 'mint',
    args: [account.address, tokenId,cid, reservable, account.address],
    enabled: Boolean(account.address && cid && tokenId && reservable!=null && account.address),
  })
  const { data:FNFTData ,write:FNFTWrite } = useContractWrite(FNFTConfig);
  const { config:ReserveConfig } = usePrepareContractWrite({
    address: FReserverContractAddress,
    abi: FReserve.abi,
    functionName: 'reserve',
    args: [tokenId],
    enabled: Boolean(tokenId),
  })
  const { data:ReserveData ,write:ReserveWrite } = useContractWrite(ReserveConfig);
  const { isLoading:isLoadingReserve, isSuccess:isSuccessReserve } = useWaitForTransaction({
    hash: ReserveData?.hash,
  })
  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: FNFTData?.hash,
  })
  useEffect(()=>{
    if(isSuccessReserve){
      setReservable(true);
    }
  },[isSuccessReserve]);
  useEffect(()=>{
    if(cid){
      const temp = cidToUint256Str(cid);
      setTokenId(temp);
    }
  },[cid]);
  return (
  <Grid container justifyContent={'Left'} spacing={3} padding={7} direction="column" alignItems={'Left'}>
    <ImageUploadToIPFS cid = {cid} setCid = {setCid}/>
    {isLoadingReserve && <Typography> Wait for Reserve Transaction to confirm...</Typography>}
    {isLoading && <Typography>Loading....</Typography>}
    {isSuccess && (
        <div>
          Successfully minted your NFT!
          <div>
            <a href={`https://mumbai.polygonscan.com/tx/${FNFTData?.hash}`}>Polygon Scan</a>
          </div>
        </div>
      )}
    <Button disabled={cid == undefined || isLoadingReserve || isSuccessReserve } onClick={()=>{ console.log("Trying to Reserve...", ReserveWrite); ReserveWrite?.(); }}>
       Reserve
    </Button>
    <Button className="nice_but" disabled={cid == undefined || !isSuccessReserve} onClick={()=>{ console.log("Trying to mint...",FNFTWrite); FNFTWrite?.(); }}>
       Mint
    </Button>
  </Grid>

  );
}
  
export default Mint;