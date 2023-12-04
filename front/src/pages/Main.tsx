
// import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainBar from '../components/MainBar';
import Explore from './Explore';

function Main() {
  return (
    <BrowserRouter>
      <MainBar />
        <Routes>
            <Route path = "/real-token/Explore" element={<Explore/>}  />
        </Routes>
    </BrowserRouter>

  );
}

export default Main;