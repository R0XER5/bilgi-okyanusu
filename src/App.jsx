import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Feed from './pages/Feed';
import Login from './pages/Login';
import Register from './pages/Register';
import Trends from './pages/Trends';
import PostDetail from './pages/PostDetail';
import Profile from './pages/Profile';
import AdminPanel from './pages/AdminPanel';
import { users } from './data/dummyData';
import './styles/main.css';

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);

  const handleLogin = (user) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  return (
    <Router>
      <div>
        <Navbar isLoggedIn={!!currentUser} currentUser={currentUser} onLogout={handleLogout} />
        
        <Routes>
          <Route 
            path="/" 
            element={currentUser ? <Navigate to="/feed" /> : <Navigate to="/login" />} 
          />
          
          <Route 
            path="/login" 
            element={
              currentUser ? (
                <Navigate to="/feed" />
              ) : (
                <Login onLogin={handleLogin} />
              )
            } 
          />

          <Route 
            path="/register" 
            element={
              currentUser ? (
                <Navigate to="/feed" />
              ) : (
                <Register onLogin={handleLogin} />
              )
            } 
          />
          
          <Route 
            path="/feed" 
            element={
              currentUser ? (
                <Feed currentUser={currentUser} />
              ) : (
                <Navigate to="/login" />
              )
            } 
          />

          <Route 
            path="/trends" 
            element={
              currentUser ? (
                <Trends />
              ) : (
                <Navigate to="/login" />
              )
            } 
          />

          <Route 
            path="/post/:postId" 
            element={
              currentUser ? (
                <PostDetail currentUser={currentUser} />
              ) : (
                <Navigate to="/login" />
              )
            } 
          />

          <Route 
            path="/profile" 
            element={
              currentUser ? (
                <Profile currentUser={currentUser} />
              ) : (
                <Navigate to="/login" />
              )
            } 
          />

          <Route 
            path="/profile/:userId" 
            element={
              currentUser ? (
                <Profile currentUser={currentUser} />
              ) : (
                <Navigate to="/login" />
              )
            } 
          />

          <Route 
            path="/admin" 
            element={
              currentUser && currentUser.username === "Admin" ? (
                <AdminPanel />
              ) : currentUser ? (
                <Navigate to="/" replace />
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
