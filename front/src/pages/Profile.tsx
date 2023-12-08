import { useEffect } from 'react';
import Button from '@mui/material/Button';
import {  useParams } from 'react-router-dom';
// import {useNavigate} from 'react-router-dom';
import { Grid } from '@mui/material';
import { FractionalizeNFTContractAddress } from '../constants/constants';
import NFTContract from '../constants/FractionalizedNFT.json'
import { useAccount } from 'wagmi';
import {ethers} from 'ethers';


function Profile() {
  let { ProfileId } = useParams();
  const account = useAccount();
  const getOwnedToken = async () => {
    const provider = new ethers.JsonRpcProvider("https://polygon-mumbai.g.alchemy.com/v2/BmepUpwxd86PJSuisn7P4f3lZJSqcAUt")
    const contractABI = NFTContract.abi;
    const myContract =  new ethers.Contract(FractionalizeNFTContractAddress, contractABI, provider);
    try {
    const tokens = await myContract.getOwnedTokens(account.address);
    console.log("List of all tokens:",tokens)
    } catch (error) {
      console.error("Error fetching tokens: ", error);
    }
  };
  const getPrfileDetails = async()=>{
    console.log("get Profile Details...")
  }
  useEffect(()=>{
    getOwnedToken();
    getPrfileDetails();
  },[ProfileId]);
  return (
  <Grid container justifyContent={'center'} spacing={3} padding={7} direction="column" alignItems={'center'}>
    <Button >
       Click Me
    </Button>
  </Grid>

  );
}
  
export default Profile;