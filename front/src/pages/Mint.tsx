import { useEffect } from 'react';
import Button from '@mui/material/Button';
import { Grid } from '@mui/material';
import ImageUploadToIPFS from '../components/FileUpload';
import { useAccount,usePrepareContractWrite } from 'wagmi';
import { FReserverContractAddress } from '../constants/constants';



function Mint() {
  const account = useAccount();
  const { configReserver } = usePrepareContractWrite({
    address: FReserverContractAddress,
    abi: [
      {
        name: 'mint',
        type: 'function',
        stateMutability: 'nonpayable',
        inputs: [],
        outputs: [],
      },
    ],
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