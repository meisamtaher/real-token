// import {useNavigate} from 'react-router-dom';
import  { useEffect} from 'react';
import { useNavigate } from 'react-router';
import Button from '@mui/material/Button';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Logo from '/Logo.svg';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Avatar } from '@mui/material';
import { useAccount, useWalletClient } from 'wagmi';
import { Stack } from '@mui/system';
import { sign } from 'crypto';


const pages = ['MarketPlace', 'Factory'];

function MainBar() {
  const navigate = useNavigate();
  const signer = useWalletClient();
  const account = useAccount();
  const goToProfile = ()=>{
    if(account.isConnected)
      navigate("/real-token/Profile/"+account.address);
  }
  const handleCloseNavMenu = (key: string) => {
    console.log("Redirect to page: ",key);
    if(key == "MarketPlace"){
      navigate("/real-token/Explore");
    }
    else if(key == "Factory"){
      navigate("/real-token/Mint");
    }
  };

  useEffect(() => {
  }, []);
  
  return (
    <AppBar position="static" style={{ background: "linear-gradient(269.67deg, #CCE1FA -10.61%, #C6EEEA 113.26%)" }} >
      <Container maxWidth="xl" >
        <Toolbar disableGutters >
          <img src={Logo} width={40}  />
          <Box  sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button
                key={page}
                onClick={()=>handleCloseNavMenu(page)}
                sx={{ my: 2, color: '#352D50', display: 'block' }}
              >
                {page}
              </Button>
            ))}
          </Box>
          <Stack sx={{ flexGrow: 0 }} direction={'row'}>
            <ConnectButton  chainStatus="none" accountStatus={{smallScreen:'avatar',largeScreen: 'address',}}/>
            {account.isConnected &&<div onClick={goToProfile}>
              <Avatar />
            </div>}
          </Stack>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default MainBar;