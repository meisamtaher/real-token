import { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import { Grid, Typography } from '@mui/material';
import ImageUploadToIPFS from '../components/FileUpload';
import { useAccount,useContractWrite,usePrepareContractWrite, useWaitForTransaction } from 'wagmi';
import { FReserverContractAddress, FractionalizeNFTContractAddress } from '../constants/constants';
import FReserver from "../constants/Reserver.json";
import FNFT from "../constants/FractionalizedNFT.json";


function Mint() {
  const account = useAccount();
  const [cid,setCid] = useState<string|undefined>(undefined);
  const accountAddress = "0x4342577729e8D30325260f32719a1A10242Ba23a";
  const tokenId = "QmNeLLephRJ6zo2AmbcBxQ1iVFv1BDVMscQeZ6FLCvpQuq";
  const reservable = false;
  const { config } = usePrepareContractWrite({
    address: FractionalizeNFTContractAddress,
    abi: FNFT.abi,
    functionName: 'mint',
    args: [accountAddress, tokenId, reservable, accountAddress],
    enabled: Boolean(accountAddress && tokenId && reservable!=null && accountAddress),
  })
  const { data ,write } = useContractWrite(config);
  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  })
  
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
    <Button disabled={cid == undefined} onClick={()=>{ console.log("Trying to mint..."); write?.()}}>
       Mint
    </Button>
  </Grid>

  );
}
  
export default Mint;