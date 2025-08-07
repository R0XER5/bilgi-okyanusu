import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Feed from './pages/Feed';
import Gundem from './pages/Gundem';
import PostDetail from './pages/PostDetail';
import AdminPanel from './pages/AdminPanel';
import AdminLogin from './pages/AdminLogin';
import { PostProvider } from './context/PostContext';
import './styles/main.css';

const App = () => {
  const [currentAdmin, setCurrentAdmin] = useState(null);

  const handleAdminLogin = (admin) => {
    setCurrentAdmin(admin);
  };

  const handleAdminLogout = () => {
    setCurrentAdmin(null);
  };

  return (
    <PostProvider>
      <Router>
        <div>
          <Navbar currentAdmin={currentAdmin} onAdminLogout={handleAdminLogout} />
          
          <Routes>
            <Route 
              path="/" 
              element={<Navigate to="/feed" />} 
            />
            
            <Route 
              path="/feed" 
              element={<Feed currentAdmin={currentAdmin} />} 
            />

            <Route 
              path="/trending" 
              element={<Gundem currentAdmin={currentAdmin} />} 
            />

            <Route 
              path="/post/:postId" 
              element={<PostDetail />} 
            />

            <Route 
              path="/admin/login" 
              element={
                currentAdmin ? (
                  <Navigate to="/feed" />
                ) : (
                  <AdminLogin onAdminLogin={handleAdminLogin} />
                )
              } 
            />

            <Route 
              path="/admin" 
              element={
                currentAdmin ? (
                  <AdminPanel currentAdmin={currentAdmin} />
                ) : (
                  <Navigate to="/admin/login" />
                )
              } 
            />
          </Routes>
        </div>
      </Router>
    </PostProvider>
  );
};

export default App;
