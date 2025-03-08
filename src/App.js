import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Feed from './pages/Feed';
import Login from './pages/Login';
import Register from './pages/Register';
import Trends from './pages/Trends';
import Profile from './pages/Profile';
import CreatePost from './components/CreatePost';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showCreatePost, setShowCreatePost] = useState(false);

  const handleLogin = (user) => {
    setIsLoggedIn(true);
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
  };

  return (
    <Router>
      <div>
        <Navbar 
          isLoggedIn={isLoggedIn} 
          currentUser={currentUser} 
          onLogout={handleLogout}
        />

        <Routes>
          <Route 
            path="/" 
            element={isLoggedIn ? <Navigate to="/feed" /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/feed" 
            element={isLoggedIn ? <Feed currentUser={currentUser} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/trends" 
            element={isLoggedIn ? <Trends currentUser={currentUser} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/profile" 
            element={isLoggedIn ? <Profile currentUser={currentUser} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/login" 
            element={!isLoggedIn ? <Login onLogin={handleLogin} /> : <Navigate to="/feed" />} 
          />
          <Route 
            path="/register" 
            element={!isLoggedIn ? <Register onLogin={handleLogin} /> : <Navigate to="/feed" />} 
          />
        </Routes>

        {isLoggedIn && (
          <>
            <button
              className="floating-action-button"
              onClick={() => setShowCreatePost(true)}
            >
              <span className="material-icons">add</span>
            </button>

            {showCreatePost && (
              <div className="modal-overlay">
                <div className="modal-content">
                  <button
                    className="modal-close"
                    onClick={() => setShowCreatePost(false)}
                  >
                    <span className="material-icons">close</span>
                  </button>
                  <CreatePost 
                    currentUser={currentUser}
                    onClose={() => setShowCreatePost(false)}
                  />
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </Router>
  );
}

export default App; 