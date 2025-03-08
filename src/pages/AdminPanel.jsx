import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const AdminPanel = () => {
  // Manuel inceleme bekleyen raporlar için state
  const [pendingReports, setPendingReports] = useState([
    // Örnek veri
    {
      id: 1,
      reportedContent: {
        type: 'post',
        id: 123,
        content: 'Örnek içerik...',
        userId: 456
      },
      reason: 'Telif hakkı ihlali',
      details: 'Bu içerik başka bir siteden kopyalanmış.',
      timestamp: new Date().toISOString(),
      reporter: {
        id: 789,
        name: 'Rapor Eden Kullanıcı'
      },
      status: 'pending',
      riskScore: 65
    }
  ]);

  // Raporu onayla
  const handleApproveReport = (reportId) => {
    if (window.confirm('Bu raporu onaylamak istediğinize emin misiniz? İçerik kaldırılacak.')) {
      setPendingReports(prev => 
        prev.map(report => 
          report.id === reportId 
            ? { ...report, status: 'approved' }
            : report
        )
      );
      // Burada API çağrısı yapılacak
      // İçerik kaldırılacak
      alert('Rapor onaylandı ve içerik kaldırıldı.');
    }
  };

  // Raporu reddet
  const handleRejectReport = (reportId) => {
    if (window.confirm('Bu raporu reddetmek istediğinize emin misiniz?')) {
      setPendingReports(prev => 
        prev.map(report => 
          report.id === reportId 
            ? { ...report, status: 'rejected' }
            : report
        )
      );
      // Burada API çağrısı yapılacak
      alert('Rapor reddedildi.');
    }
  };

  return (
    <div className="container" style={{ 
      marginTop: '72px',
      padding: '24px',
      maxWidth: '1200px'
    }}>
      <div className="card">
        <div style={{ padding: '24px' }}>
          <h1 style={{ 
            fontSize: '2rem',
            fontWeight: '700',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <span className="material-icons" style={{ fontSize: '32px' }}>admin_panel_settings</span>
            Yönetici Paneli
          </h1>

          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ 
              fontSize: '1.5rem',
              fontWeight: '600',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span className="material-icons">pending_actions</span>
              Manuel İnceleme Bekleyen Raporlar
            </h2>

            {pendingReports.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {pendingReports.map(report => (
                  <div 
                    key={report.id}
                    className="card"
                    style={{
                      padding: '20px',
                      background: 'var(--background-color)',
                      border: '1px solid var(--border-color)'
                    }}
                  >
                    <div style={{ 
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '16px'
                    }}>
                      <div>
                        <h3 style={{ 
                          fontSize: '1.2rem',
                          fontWeight: '600',
                          marginBottom: '8px'
                        }}>
                          Rapor #{report.id}
                        </h3>
                        <p style={{ 
                          color: 'var(--gray-color)',
                          fontSize: '0.9rem',
                          marginBottom: '4px'
                        }}>
                          Rapor Tarihi: {new Date(report.timestamp).toLocaleDateString('tr-TR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                        <p style={{ 
                          color: 'var(--gray-color)',
                          fontSize: '0.9rem'
                        }}>
                          Risk Skoru: {report.riskScore}/100
                        </p>
                      </div>
                      <div style={{
                        display: 'flex',
                        gap: '8px'
                      }}>
                        <button
                          onClick={() => handleApproveReport(report.id)}
                          style={{
                            padding: '8px 16px',
                            borderRadius: '4px',
                            border: 'none',
                            background: 'var(--success-color)',
                            color: 'white',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <span className="material-icons" style={{ fontSize: '20px' }}>check</span>
                          Onayla
                        </button>
                        <button
                          onClick={() => handleRejectReport(report.id)}
                          style={{
                            padding: '8px 16px',
                            borderRadius: '4px',
                            border: 'none',
                            background: 'var(--danger-color)',
                            color: 'white',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <span className="material-icons" style={{ fontSize: '20px' }}>close</span>
                          Reddet
                        </button>
                      </div>
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                      <h4 style={{ 
                        fontSize: '1rem',
                        fontWeight: '600',
                        marginBottom: '8px'
                      }}>Rapor Detayları</h4>
                      <div style={{
                        background: 'white',
                        padding: '16px',
                        borderRadius: '4px',
                        border: '1px solid var(--border-color)'
                      }}>
                        <p style={{ marginBottom: '8px' }}>
                          <strong>Neden:</strong> {report.reason}
                        </p>
                        <p>
                          <strong>Açıklama:</strong> {report.details}
                        </p>
                      </div>
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                      <h4 style={{ 
                        fontSize: '1rem',
                        fontWeight: '600',
                        marginBottom: '8px'
                      }}>Raporlanan İçerik</h4>
                      <div style={{
                        background: 'white',
                        padding: '16px',
                        borderRadius: '4px',
                        border: '1px solid var(--border-color)'
                      }}>
                        <p style={{ marginBottom: '8px' }}>
                          <strong>Tür:</strong> {report.reportedContent.type === 'post' ? 'Gönderi' : 'Kullanıcı'}
                        </p>
                        <p style={{ marginBottom: '8px' }}>
                          <strong>İçerik:</strong> {report.reportedContent.content}
                        </p>
                        <Link 
                          to={`/${report.reportedContent.type}/${report.reportedContent.id}`}
                          style={{
                            color: 'var(--primary-color)',
                            textDecoration: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '0.9rem'
                          }}
                        >
                          <span className="material-icons" style={{ fontSize: '16px' }}>visibility</span>
                          İçeriği Görüntüle
                        </Link>
                      </div>
                    </div>

                    <div>
                      <h4 style={{ 
                        fontSize: '1rem',
                        fontWeight: '600',
                        marginBottom: '8px'
                      }}>Rapor Eden</h4>
                      <div style={{
                        background: 'white',
                        padding: '16px',
                        borderRadius: '4px',
                        border: '1px solid var(--border-color)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px'
                      }}>
                        <div style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          background: 'var(--primary-color)',
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <span className="material-icons">person</span>
                        </div>
                        <div>
                          <p style={{ fontWeight: '500' }}>{report.reporter.name}</p>
                          <Link 
                            to={`/profile/${report.reporter.id}`}
                            style={{
                              color: 'var(--primary-color)',
                              textDecoration: 'none',
                              fontSize: '0.9rem',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            <span className="material-icons" style={{ fontSize: '16px' }}>account_circle</span>
                            Profili Görüntüle
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{
                padding: '48px',
                textAlign: 'center',
                background: 'var(--background-color)',
                borderRadius: '8px'
              }}>
                <span className="material-icons" style={{
                  fontSize: '48px',
                  color: 'var(--gray-color)',
                  marginBottom: '16px'
                }}>task_alt</span>
                <h3 style={{
                  fontSize: '1.25rem',
                  color: 'var(--text-color)',
                  marginBottom: '8px'
                }}>İnceleme Bekleyen Rapor Yok</h3>
                <p style={{ color: 'var(--gray-color)' }}>
                  Tüm raporlar değerlendirildi
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel; 