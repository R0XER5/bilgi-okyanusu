import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ isLoggedIn, currentUser, onLogout }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
    setShowDropdown(false);
  };

  const handleProfileClick = () => {
    navigate('/profile');
    setShowDropdown(false);
  };

  return (
    <nav className="navbar">
      <div className="container navbar-content" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 32px'
      }}>
        <Link to="/" className="logo" style={{ marginLeft: '16px' }}>
          <h1>Bilgi Okyanusu</h1>
        </Link>
        
        <div className="nav-links" style={{ marginRight: '16px' }}>
          {isLoggedIn ? (
            <>
              <Link to="/feed" className="nav-link">Ana Sayfa</Link>
              <Link to="/trends" className="nav-link">
                <span className="material-icons" style={{ fontSize: '20px', marginRight: '4px' }}>
                  trending_up
                </span>
                Gündem
              </Link>
              <div className="user-menu" style={{ position: 'relative' }}>
                <div
                  onClick={() => setShowDropdown(!showDropdown)}
                  style={{ 
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    color: 'var(--primary-color)',
                    fontWeight: '600',
                    fontSize: '17px'
                  }}
                >
                  <span>{currentUser?.name}</span>
                </div>

                {showDropdown && (
                  <div 
                    style={{
                      position: 'absolute',
                      top: '100%',
                      right: 0,
                      marginTop: '8px',
                      backgroundColor: 'var(--white)',
                      borderRadius: '8px',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                      width: '160px',
                      zIndex: 1000
                    }}
                  >
                    <div
                      onClick={handleProfileClick}
                      className="user-menu-item"
                      style={{
                        borderBottom: '1px solid var(--border-color)'
                      }}
                    >
                      <span className="material-icons">person</span>
                      <span>Profil</span>
                    </div>
                    <div
                      onClick={handleLogout}
                      className="user-menu-item"
                      style={{
                        color: '#dc3545'
                      }}
                    >
                      <span className="material-icons">logout</span>
                      <span>Çıkış Yap</span>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline">Giriş Yap</Link>
              <Link to="/register" className="btn btn-primary">Kayıt Ol</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 