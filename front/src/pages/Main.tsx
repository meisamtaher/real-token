
// import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainBar from '../components/MainBar';
import Explore from './Explore';
import NFTDetials from './NFTDetails';
import Profile from './Profile';

function Main() {
  return (
    <BrowserRouter>
      <MainBar />
        <Routes>
            <Route path = "/real-token/Explore" element={<Explore/>}  />
            <Route path = "/real-token/Explore/:NFTId" element={<NFTDetials/>}  />
            <Route path = "/real-token/Profile/:ProfileId" element={<Profile/>}  />
        </Routes>
    </BrowserRouter>

  );
}

export default Main;