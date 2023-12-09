import { useEffect } from 'react';
import Button from '@mui/material/Button';
import { Grid, Typography } from '@mui/material';
import ImageUploadToIPFS from '../components/FileUpload';
import { useAccount,useContractWrite,usePrepareContractWrite, useWaitForTransaction } from 'wagmi';
import { FReserverContractAddress, FractionalizeNFTContractAddress } from '../constants/constants';
import FReserver from "../constants/Reserver.json";
import FNFT from "../constants/FractionalizedNFT.json";


function Mint() {
  const account = useAccount();
  const accountAddress = "0x4342577729e8D30325260f32719a1A10242Ba23a";
  const tokenId = 24;
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
    <Button onClick={()=>{ console.log("Trying to mint..."); write?.()}}>
       Mint
    </Button>
    {isLoading && <Typography>Loading....</Typography>}
    {isSuccess && <Typography>Successful Transaction.</Typography>}
    <ImageUploadToIPFS />
  </Grid>

  );
}
  
export default Mint;