import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import Categories from './pages/Categories';
import Subcategories from './pages/Subcategories';
import Services from './pages/Services';
import ServiceDetails from './pages/ServiceDetails';
import Providers from './pages/Providers';

import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route
        path="/categories"
        element={<Categories />}
      />

      <Route
        path="/subcategories/:categoryId"
        element={<Subcategories />}
      />

      <Route
        path="/services/:subcategoryId"
        element={<Services />}
      />

      <Route
        path="/service/:serviceId"
        element={<ServiceDetails />}
      />
      <Route
  path="/dashboard"
  element={<Dashboard />}
/>

      <Route
        path="/providers/:serviceId"
        element={<Providers />}
      />
    </Routes>
    
  );
}

export default App;