import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { users } from '../data/dummyData';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Kullanıcıyı bul
    const user = users.find(u => u.username === username);

    if (user && user.password === password) {
      onLogin(user);
      navigate('/feed');
    } else {
      setError('Geçersiz kullanıcı adı veya şifre');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card" style={{ 
        width: '420px',
        padding: '32px',
        backgroundColor: 'var(--white)'
      }}>
        <h2 style={{ 
          textAlign: 'center',
          marginBottom: '24px',
          fontSize: '1.75rem'
        }}>Giriş Yap</h2>
        
        {error && (
          <div style={{ 
            backgroundColor: '#ffebee', 
            color: '#c62828', 
            padding: '12px', 
            borderRadius: '4px',
            marginBottom: '16px'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Kullanıcı Adı</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input-field"
              style={{ color: '#000000' }}
              required
            />
          </div>

          <div className="form-group">
            <label>Şifre</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              style={{ color: '#000000' }}
              required
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', marginTop: '16px' }}
          >
            Giriş Yap
          </button>
        </form>

        <p style={{ 
          textAlign: 'center',
          marginTop: '16px',
          color: 'var(--gray-color)'
        }}>
          Hesabınız yok mu? <Link to="/register" style={{ color: 'var(--primary-color)' }}>Kayıt Ol</Link>
        </p>
      </div>
    </div>
  );
};

export default Login; 