import React, { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Categories from './pages/Categories';
import Sales from './pages/Sales';
import Reports from './pages/Reports';
import CreateStore from './pages/CreateStore';
import Stores from './pages/Stores';
import { RootState } from './store';

function App() {
  const { token } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to login if no token is found
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<Stores />} />
        <Route path="stores" element={<Stores />} />
        <Route path="stores/create" element={<CreateStore />} />
        <Route path="stores/:storeId">
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="categories" element={<Categories />} />
          <Route path="products" element={<Products />} />
          <Route path="sales" element={<Sales />} />
          <Route path="reports" element={<Reports />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;