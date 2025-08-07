import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { admins } from '../data/dummyData';

const AdminLogin = ({ onAdminLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Admin kontrolü
    const admin = admins.find(a => a.username === username && a.password === password);

    if (admin) {
      // Admin girişi başarılı
      onAdminLogin(admin);
      navigate('/feed');
    } else {
      setError('Kullanıcı adı veya şifre hatalı!');
    }

    setIsLoading(false);
  };

  return (
    <div className="container" style={{ 
      marginTop: '72px',
      padding: '48px 20px',
      maxWidth: '600px',
      margin: '72px auto 0',
      minHeight: 'calc(100vh - 72px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div className="card" style={{ 
        padding: '48px',
        width: '100%',
        maxWidth: '500px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        borderRadius: '16px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            boxShadow: '0 4px 16px rgba(10, 102, 194, 0.3)'
          }}>
            <span className="material-icons" style={{ 
              fontSize: '40px',
              color: 'white'
            }}>admin_panel_settings</span>
          </div>
          <h1 style={{ 
            fontSize: '2.25rem',
            fontWeight: '700',
            margin: '0 0 12px 0',
            color: 'var(--text-color)'
          }}>Admin Girişi</h1>
          <p style={{ 
            color: 'var(--gray-color)',
            margin: 0,
            fontSize: '1.1rem',
            lineHeight: '1.6'
          }}>
            Yönetici hesabınızla giriş yaparak site yönetimini gerçekleştirin
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              marginBottom: '10px',
              color: 'var(--text-color)',
              fontSize: '1rem',
              fontWeight: '500'
            }}>
              Kullanıcı Adı
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Kullanıcı adınızı girin"
              required
              style={{
                width: '100%',
                padding: '16px',
                borderRadius: '12px',
                border: '2px solid var(--border-color)',
                fontSize: '1.1rem',
                boxSizing: 'border-box',
                transition: 'border-color 0.2s ease',
                color: 'black'
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--primary-color)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
            />
          </div>

          <div style={{ marginBottom: '32px' }}>
            <label style={{
              display: 'block',
              marginBottom: '10px',
              color: 'var(--text-color)',
              fontSize: '1rem',
              fontWeight: '500'
            }}>
              Şifre
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Şifrenizi girin"
              required
              style={{
                width: '100%',
                padding: '16px',
                borderRadius: '12px',
                border: '2px solid var(--border-color)',
                fontSize: '1.1rem',
                boxSizing: 'border-box',
                transition: 'border-color 0.2s ease',
                color: 'black'
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--primary-color)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
            />
          </div>

          {error && (
            <div style={{
              background: '#fef2f2',
              color: '#dc2626',
              padding: '16px',
              borderRadius: '12px',
              marginBottom: '24px',
              fontSize: '1rem',
              border: '1px solid #fecaca',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span className="material-icons" style={{ fontSize: '20px' }}>error</span>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '16px',
              background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '1.1rem',
              fontWeight: '600',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.7 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              boxShadow: '0 4px 16px rgba(10, 102, 194, 0.3)',
              marginBottom: '32px'
            }}
          >
            {isLoading ? (
              <>
                <span className="material-icons" style={{ fontSize: '24px' }}>
                  refresh
                </span>
                Giriş Yapılıyor...
              </>
            ) : (
              <>
                <span className="material-icons" style={{ fontSize: '24px' }}>login</span>
                Giriş Yap
              </>
            )}
          </button>
        </form>

        {/* Bilgi Kartı */}
        <div style={{
          marginTop: '32px',
          padding: '20px',
          background: 'linear-gradient(135deg, #f8fafc, #e2e8f0)',
          borderRadius: '12px',
          border: '1px solid var(--border-color)',
          marginBottom: '32px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '12px'
          }}>
            <span className="material-icons" style={{ 
              fontSize: '24px',
              color: 'var(--primary-color)'
            }}>info</span>
            <h3 style={{
              fontSize: '1.1rem',
              fontWeight: '600',
              margin: 0,
              color: 'var(--text-color)'
            }}>
              Admin Bilgileri
            </h3>
          </div>
          <p style={{
            margin: 0,
            fontSize: '0.95rem',
            color: 'var(--gray-color)',
            lineHeight: '1.5'
          }}>
            Admin hesabı ile giriş yaparak yeni yazılar oluşturabilir, mevcut yazıları düzenleyebilir ve site yönetimini gerçekleştirebilirsiniz.
          </p>
        </div>

        <div style={{
          paddingTop: '32px',
          borderTop: '2px solid var(--border-color)',
          textAlign: 'center'
        }}>
          <p style={{ 
            color: 'var(--gray-color)',
            fontSize: '1rem',
            margin: '0 0 20px 0'
          }}>
            Admin hesabınız yok mu?
          </p>
          <button
            onClick={() => navigate('/feed')}
            style={{
              background: 'transparent',
              border: '2px solid var(--border-color)',
              color: 'var(--gray-color)',
              padding: '12px 24px',
              borderRadius: '12px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              margin: '0 auto'
            }}
          >
            <span className="material-icons" style={{ fontSize: '20px' }}>home</span>
            Ana Sayfaya Dön
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin; 