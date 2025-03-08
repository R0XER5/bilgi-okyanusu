import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { users } from '../data/dummyData';

const Register = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Şifreler eşleşmiyor');
      return;
    }

    // Kullanıcı adının benzersiz olduğunu kontrol et
    if (users.some(user => user.username === formData.username)) {
      setError('Bu kullanıcı adı zaten kullanılıyor');
      return;
    }

    // Yeni kullanıcı oluştur
    const newUser = {
      id: users.length + 1,
      username: formData.username,
      name: formData.username,
      password: formData.password,
      connections: 0,
      joinDate: new Date().toISOString()
    };

    users.push(newUser);
    onLogin(newUser);
    navigate('/feed');
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
        }}>Kayıt Ol</h2>
        
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
              value={formData.username}
              onChange={handleChange}
              name="username"
              className="input-field"
              style={{ color: '#000000' }}
              required
            />
          </div>

          <div className="form-group">
            <label>Şifre</label>
            <input
              type="password"
              value={formData.password}
              onChange={handleChange}
              name="password"
              className="input-field"
              style={{ color: '#000000' }}
              required
            />
          </div>

          <div className="form-group">
            <label>Şifre Tekrar</label>
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              name="confirmPassword"
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
            Kayıt Ol
          </button>
        </form>

        <p style={{ 
          textAlign: 'center',
          marginTop: '16px',
          color: 'var(--gray-color)'
        }}>
          Zaten hesabınız var mı? <Link to="/login" style={{ color: 'var(--primary-color)' }}>Giriş Yap</Link>
        </p>
      </div>
    </div>
  );
};

export default Register; 