import {useNavigate} from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Logo from '/logo.svg';
import { ConnectButton } from '@rainbow-me/rainbowkit';


const pages = ['MarketPlace', 'Factory'];

function MainBar() {
  const navigate = useNavigate();

  const handleCloseNavMenu = (key: string) => {
    // if(key == "MarketPlace"){
    //   navigate("/sub-wallet/SendTransaction");
    // }
    // else if(key == "Transactions"){
    //   navigate("/sub-wallet/Transactions");
    // }
    // else if(key == "Sessions"){
    //   navigate("/sub-wallet/Sessions");
    // }
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
          <Box sx={{ flexGrow: 0 }}>
            <ConnectButton />
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default MainBar;