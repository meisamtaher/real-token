import { useEffect } from 'react';
import Button from '@mui/material/Button';
import {  useParams } from 'react-router-dom';
// import {useNavigate} from 'react-router-dom';
import { Grid } from '@mui/material';


function Profile() {
  let { ProfileId } = useParams();

  const getPrfileDetails = async()=>{
    console.log("get Profile Details...")
  }
  useEffect(()=>{
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