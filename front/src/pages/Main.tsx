
// import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainBar from '../components/MainBar';

function Main() {
  return (
    <BrowserRouter>
      <MainBar />
      <Routes>
          <Route path = "/real-token"  />
      </Routes>
    </BrowserRouter>

  );
}

export default Main;