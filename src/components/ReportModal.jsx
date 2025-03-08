import React, { useState } from 'react';

const ReportModal = ({ onClose, onSubmit, type }) => {
  const [reason, setReason] = useState('');
  const [details, setDetails] = useState('');

  const reportReasons = {
    post: [
      'Spam içerik',
      'Nefret söylemi',
      'Yanlış bilgi',
      'Taciz',
      'Şiddet',
      'Telif hakkı ihlali',
      'Diğer'
    ],
    user: [
      'Sahte hesap',
      'Spam yapıyor',
      'Taciz edici davranış',
      'Nefret söylemi',
      'Uygunsuz içerik paylaşımı',
      'Diğer'
    ]
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      reason,
      details,
      timestamp: new Date().toISOString()
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{
        maxWidth: '500px',
        width: '100%'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px'
        }}>
          <h2 style={{ margin: 0 }}>
            {type === 'post' ? 'Gönderiyi Raporla' : 'Kullanıcıyı Raporla'}
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '8px'
            }}
          >
            <span className="material-icons">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: 'var(--gray-color)',
              fontSize: '0.9rem'
            }}>
              Raporlama Nedeni
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid var(--border-color)',
                fontSize: '1rem'
              }}
            >
              <option value="">Bir neden seçin</option>
              {reportReasons[type].map((reason, index) => (
                <option key={index} value={reason}>{reason}</option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: 'var(--gray-color)',
              fontSize: '0.9rem'
            }}>
              Detaylar (İsteğe bağlı)
            </label>
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Lütfen daha fazla detay ekleyin..."
              style={{
                width: '100%',
                minHeight: '120px',
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid var(--border-color)',
                fontSize: '1rem',
                resize: 'vertical'
              }}
            />
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '12px'
          }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '8px 16px',
                borderRadius: '4px',
                border: '1px solid var(--border-color)',
                background: 'white',
                cursor: 'pointer'
              }}
            >
              İptal
            </button>
            <button
              type="submit"
              style={{
                padding: '8px 16px',
                borderRadius: '4px',
                border: 'none',
                background: 'var(--primary-color)',
                color: 'white',
                cursor: 'pointer'
              }}
            >
              Raporla
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportModal; 