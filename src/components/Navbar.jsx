import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ currentAdmin, onAdminLogout }) => {
  const [showAdminMenu, setShowAdminMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  return (
    <nav className="navbar">
      <div className="container navbar-content" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0',
        width: '98vw',
        maxWidth: 'none',
        minWidth: '320px',
        margin: '0 auto'
      }}>
        {/* Gündem Butonu - Sadece bilgisayar versiyonunda görünür */}
        <Link to="/trending" className="gundem-button" style={{ display: 'none' }}>
          <span className="material-icons">trending_up</span>
          Gündem
        </Link>
        
        {/* Logo */}
        <Link to="/" className="logo" style={{ marginLeft: '0px' }}>
          <h1>Bilgi Okyanusu</h1>
        </Link>
        
        <div className="nav-links" style={{ marginRight: '0px', display: 'flex', alignItems: 'center', gap: '24px' }}>
          {currentAdmin && (
            <>
              <Link to="/admin" className="nav-link" style={{
                textDecoration: 'none',
                color: 'var(--gray-color)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span className="material-icons" style={{ fontSize: '20px' }}>admin_panel_settings</span>
                Yönetim Paneli
              </Link>
              
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setShowAdminMenu(!showAdminMenu)}
                  style={{
                    background: 'var(--white)',
                    border: '2px solid var(--primary-color)',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: 'var(--primary-color)',
                    fontWeight: '600',
                    fontSize: '1rem',
                    padding: '8px 16px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                  }}
                >
                  <span>{currentAdmin.name}</span>
                  <span className="material-icons" style={{ fontSize: '20px' }}>
                    {showAdminMenu ? 'expand_less' : 'expand_more'}
                  </span>
                </button>

                {showAdminMenu && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    marginTop: '8px',
                    backgroundColor: 'var(--white)',
                    borderRadius: '8px',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                    width: '200px',
                    zIndex: 1000,
                    border: '1px solid var(--border-color)'
                  }}>
                    <div style={{
                      padding: '12px 16px',
                      borderBottom: '1px solid var(--border-color)',
                      fontSize: '0.9rem',
                      color: 'var(--gray-color)'
                    }}>
                      Admin: {currentAdmin.name}
                    </div>
                    <button
                      onClick={onAdminLogout}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        color: '#dc3545',
                        fontSize: '0.9rem'
                      }}
                    >
                      <span className="material-icons" style={{ fontSize: '18px' }}>logout</span>
                      Çıkış Yap
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
        
        {/* Mobil Menü */}
        {showMobileMenu && (
          <div className="mobile-menu" style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            backgroundColor: 'var(--white)',
            borderTop: '1px solid var(--border-color)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            zIndex: 999,
            padding: '16px'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Link to="/" style={{
                textDecoration: 'none',
                color: 'var(--text-color)',
                padding: '12px 16px',
                borderRadius: '8px',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <span className="material-icons" style={{ fontSize: '20px' }}>home</span>
                Ana Sayfa
              </Link>
              
              <Link to="/trending" style={{
                textDecoration: 'none',
                color: 'var(--text-color)',
                padding: '12px 16px',
                borderRadius: '8px',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <span className="material-icons" style={{ fontSize: '20px' }}>trending_up</span>
                Trendler
              </Link>
              
              <Link to="/categories" style={{
                textDecoration: 'none',
                color: 'var(--text-color)',
                padding: '12px 16px',
                borderRadius: '8px',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <span className="material-icons" style={{ fontSize: '20px' }}>category</span>
                Kategoriler
              </Link>
              
              <Link to="/about" style={{
                textDecoration: 'none',
                color: 'var(--text-color)',
                padding: '12px 16px',
                borderRadius: '8px',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <span className="material-icons" style={{ fontSize: '20px' }}>info</span>
                Hakkımızda
              </Link>
              
              <Link to="/contact" style={{
                textDecoration: 'none',
                color: 'var(--text-color)',
                padding: '12px 16px',
                borderRadius: '8px',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <span className="material-icons" style={{ fontSize: '20px' }}>contact_support</span>
                İletişim
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar; 