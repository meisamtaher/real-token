import { useEffect } from 'react';
import Button from '@mui/material/Button';
import { Grid } from '@mui/material';


function Mint() {
  return (
  <Grid container justifyContent={'center'} spacing={3} padding={7} direction="column" alignItems={'center'}>
    <Button>
       This is Mint Page
    </Button>
  </Grid>

  );
}
  
export default Mint;