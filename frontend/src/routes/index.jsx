import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Features from '../Features';
import StagedPhoto from '../StagedPhoto';

const AppRoutes = () => {
  return (
    <Routes>
        <Route path="/" element={<Features />} />
        <Route path="/product" element={<StagedPhoto />} />
    </Routes>
  );
};

export default AppRoutes;
