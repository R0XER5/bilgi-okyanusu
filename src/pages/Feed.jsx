import React, { useState } from 'react';
import Post from '../components/Post';
import TrendingPosts from '../components/TrendingPosts';
import RecommendedPosts from '../components/RecommendedPosts';
import AdminCreatePost from '../components/AdminCreatePost';
import { posts, users } from '../data/dummyData';
import '../styles/Feed.css';

const Feed = ({ currentAdmin }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [feedPosts, setFeedPosts] = useState([...posts]);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  const handlePostCreated = (newPost) => {
    setFeedPosts([newPost, ...feedPosts]);
    setCurrentPage(1); // Yeni yazı eklendiğinde ilk sayfaya dön
  };

  const filteredPosts = feedPosts.filter(post => {
    const author = users.find(user => user.id === post.userId);
    const searchLower = searchQuery.toLowerCase();
    
    return (
      post.content.toLowerCase().includes(searchLower) ||
      author.name.toLowerCase().includes(searchLower) ||
      (post.title && post.title.toLowerCase().includes(searchLower)) ||
      (post.tags && post.tags.some(tag => tag.toLowerCase().includes(searchLower)))
    );
  });

  // Sayfalama hesaplamaları
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const currentPosts = filteredPosts.slice(startIndex, endIndex);

  // Arama yapıldığında ilk sayfaya dön
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  // Sayfa değiştirme fonksiyonu
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Sayfanın üstüne scroll yap
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Hero Bölümü */}
      <div style={{
        background: 'linear-gradient(var(--primary-color), var(--secondary-color))',
        padding: '48px 20px',
        margin: '100px 0 -60px',
        color: 'white',
        borderRadius: 0,
        border: '2px solid var(--border-color)',
        width: '100%',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            <h1 style={{
              fontSize: '2.5rem',
              fontWeight: '700',
              margin: 0,
              color: 'white'
            }}>
              Bilgi Okyanusu'na Hoş Geldiniz!
            </h1>
            <p style={{
              fontSize: '1.2rem',
              fontWeight: '400',
              margin: 0,
              color: 'white'
            }}>
              Bilgiyi Paylaş Dünya'yı Aydınlat
            </p>
          </div>

          <div style={{
            display: 'flex',
            gap: '16px',
            maxWidth: '600px',
            alignItems: 'center'
          }}>
            <div style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              background: 'rgba(255, 255, 255, 0.1)',
              padding: '12px 16px',
              borderRadius: '12px',
              backdropFilter: 'blur(4px)',
              WebkitBackdropFilter: 'blur(4px)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <span className="material-icons" style={{ color: 'white' }}>search</span>
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Gönderilerde ara..."
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'white',
                  fontSize: '1rem',
                  width: '100%',
                  outline: 'none'
                }}
                className="search-input"
              />
            </div>
            
            {/* Admin Yazı Oluşturma Butonu */}
            {currentAdmin && (
              <AdminCreatePost 
                currentAdmin={currentAdmin} 
                onPostCreated={handlePostCreated}
              />
            )}
          </div>
        </div>
      </div>

      <div className="container feed-container">
        {/* Sol Sidebar */}
        <div className="left-sidebar">
          <RecommendedPosts isHomePage={true} />
        </div>
        
        {/* Ana İçerik */}
        <div className="main-content">
          {/* Gönderiler */}
          <div className="posts">
            {currentPosts.map(post => (
              <Post key={post.id} post={post} />
            ))}
          </div>

          {/* Sayfalama */}
          {totalPages > 1 && (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '8px',
              marginTop: '32px',
              padding: '24px 0'
            }}>
              {/* Önceki Sayfa Butonu */}
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                style={{
                  padding: '8px 16px',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-lg)',
                  background: currentPage === 1 ? 'var(--border-light)' : 'var(--surface-color)',
                  color: currentPage === 1 ? 'var(--text-secondary)' : 'var(--text-color)',
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  if (currentPage !== 1) {
                    e.target.style.background = 'var(--background-color)';
                    e.target.style.borderColor = 'var(--primary-color)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (currentPage !== 1) {
                    e.target.style.background = 'var(--surface-color)';
                    e.target.style.borderColor = 'var(--border-color)';
                  }
                }}
              >
                <span className="material-icons" style={{ fontSize: '16px' }}>chevron_left</span>
                Önceki
              </button>

              {/* Sayfa Numaraları */}
              <div style={{
                display: 'flex',
                gap: '4px'
              }}>
                {Array.from({ length: totalPages }, (_, index) => index + 1).map(pageNumber => {
                  // Maksimum 5 sayfa numarası göster
                  if (totalPages <= 5) {
                    return (
                      <button
                        key={pageNumber}
                        onClick={() => handlePageChange(pageNumber)}
                        style={{
                          padding: '8px 12px',
                          border: '1px solid var(--border-color)',
                          borderRadius: 'var(--radius-lg)',
                          background: currentPage === pageNumber ? 'var(--primary-color)' : 'var(--surface-color)',
                          color: currentPage === pageNumber ? 'white' : 'var(--text-color)',
                          cursor: 'pointer',
                          fontSize: '0.9rem',
                          fontWeight: '500',
                          minWidth: '40px',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          if (currentPage !== pageNumber) {
                            e.target.style.background = 'var(--background-color)';
                            e.target.style.borderColor = 'var(--primary-color)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (currentPage !== pageNumber) {
                            e.target.style.background = 'var(--surface-color)';
                            e.target.style.borderColor = 'var(--border-color)';
                          }
                        }}
                      >
                        {pageNumber}
                      </button>
                    );
                  } else {
                    // Çok sayfa varsa akıllı gösterim
                    if (pageNumber === 1 || pageNumber === totalPages || 
                        (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)) {
                      return (
                        <button
                          key={pageNumber}
                          onClick={() => handlePageChange(pageNumber)}
                          style={{
                            padding: '8px 12px',
                            border: '1px solid var(--border-color)',
                            borderRadius: 'var(--radius-lg)',
                            background: currentPage === pageNumber ? 'var(--primary-color)' : 'var(--surface-color)',
                            color: currentPage === pageNumber ? 'white' : 'var(--text-color)',
                            cursor: 'pointer',
                            fontSize: '0.9rem',
                            fontWeight: '500',
                            minWidth: '40px',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseEnter={(e) => {
                            if (currentPage !== pageNumber) {
                              e.target.style.background = 'var(--background-color)';
                              e.target.style.borderColor = 'var(--primary-color)';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (currentPage !== pageNumber) {
                              e.target.style.background = 'var(--surface-color)';
                              e.target.style.borderColor = 'var(--border-color)';
                            }
                          }}
                        >
                          {pageNumber}
                        </button>
                      );
                    } else if (pageNumber === currentPage - 2 || pageNumber === currentPage + 2) {
                      return (
                        <span
                          key={pageNumber}
                          style={{
                            padding: '8px 4px',
                            color: 'var(--text-secondary)',
                            fontSize: '0.9rem'
                          }}
                        >
                          ...
                        </span>
                      );
                    }
                    return null;
                  }
                })}
              </div>

              {/* Sonraki Sayfa Butonu */}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                style={{
                  padding: '8px 16px',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-lg)',
                  background: currentPage === totalPages ? 'var(--border-light)' : 'var(--surface-color)',
                  color: currentPage === totalPages ? 'var(--text-secondary)' : 'var(--text-color)',
                  cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  if (currentPage !== totalPages) {
                    e.target.style.background = 'var(--background-color)';
                    e.target.style.borderColor = 'var(--primary-color)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (currentPage !== totalPages) {
                    e.target.style.background = 'var(--surface-color)';
                    e.target.style.borderColor = 'var(--border-color)';
                  }
                }}
              >
                Sonraki
                <span className="material-icons" style={{ fontSize: '16px' }}>chevron_right</span>
              </button>
            </div>
          )}

          {/* Sayfa Bilgisi */}
          {totalPages > 1 && (
            <div style={{
              textAlign: 'center',
              marginTop: '16px',
              color: 'var(--text-secondary)',
              fontSize: '0.9rem'
            }}>
              Sayfa {currentPage} / {totalPages} • Toplam {filteredPosts.length} yazı
            </div>
          )}
        </div>

        {/* Sağ Sidebar */}
        <div className="right-sidebar">
          <TrendingPosts />
        </div>
      </div>
    </>
  );
};

export default Feed; 