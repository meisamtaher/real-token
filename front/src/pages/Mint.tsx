import { useEffect } from 'react';
import Button from '@mui/material/Button';
import { Grid } from '@mui/material';
import ImageUploadToIPFS from '../components/FileUpload';
import { useAccount,usePrepareContractWrite } from 'wagmi';
import { FReserverContractAddress, FractionalizeNFTContractAddress } from '../constants/constants';
import FReserver from "../constants/Reserver.json";
import FNFT from "../constants/Reserver.json";


function Mint() {
  const account = useAccount();
  const { configReserver } = usePrepareContractWrite({
    address: FReserverContractAddress,
    abi: FReserver.abi,
    functionName: 'mint',
  })
  return (
  <Grid container justifyContent={'center'} spacing={3} padding={7} direction="column" alignItems={'center'}>
    <Button>
       Mint
    </Button>
    <ImageUploadToIPFS />
  </Grid>

  );
}
  
export default Mint;