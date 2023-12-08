import { useEffect } from 'react';
import Button from '@mui/material/Button';
import {  useParams } from 'react-router-dom';
// import {useNavigate} from 'react-router-dom';
import { Grid } from '@mui/material';


function NFTDetials() {
  let { NFTId } = useParams();
//   const navigate = useNavigate();
//   const[NFT, setNFT] = useState();
  const getNFTDetails = async()=>{
    console.log("get NFT Details...")
    
  }
  useEffect(()=>{
    getNFTDetails();
  },[NFTId]);
  return (
  <Grid container justifyContent={'center'} spacing={3} padding={7} direction="column" alignItems={'center'}>
    <Button>
       Click Mes
    </Button>
  </Grid>

  );
}
  
export default NFTDetials;