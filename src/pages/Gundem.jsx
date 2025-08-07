import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Post from '../components/Post';
import AdminCreatePost from '../components/AdminCreatePost';
import { users } from '../data/dummyData';
import { usePosts } from '../context/PostContext';
import '../styles/Feed.css';

const Gundem = ({ currentAdmin }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 8;
  
  const { posts: feedPosts, loading, error, addPost } = usePosts();

  const handlePostCreated = (newPost) => {
    addPost(newPost);
    setCurrentPage(1);
  };

  // Kategorileri tanımla
  const categories = [
    { id: 'all', name: 'Tümü', icon: 'dashboard', color: '#4c7bbe' },
    { id: 'technology', name: 'Teknoloji', icon: 'computer', color: '#2563eb' },
    { id: 'science', name: 'Bilim', icon: 'science', color: '#059669' },
    { id: 'health', name: 'Sağlık', icon: 'health_and_safety', color: '#dc2626' },
    { id: 'education', name: 'Eğitim', icon: 'school', color: '#7c3aed' },
    { id: 'business', name: 'İş Dünyası', icon: 'business', color: '#ea580c' },
    { id: 'lifestyle', name: 'Yaşam', icon: 'favorite', color: '#be185d' },
    { id: 'environment', name: 'Çevre', icon: 'eco', color: '#16a34a' }
  ];

  // En popüler yazıları hesapla
  const popularPosts = useMemo(() => {
    return [...feedPosts]
      .sort((a, b) => {
        const scoreA = (a.likes * 2) + (a.views * 0.1) + (a.comments || 0);
        const scoreB = (b.likes * 2) + (b.views * 0.1) + (b.comments || 0);
        return scoreB - scoreA;
      })
      .slice(0, 5);
  }, [feedPosts]);

  // En popüler etiketleri hesapla
  const popularTags = useMemo(() => {
    const tagStats = {};
    
    feedPosts.forEach(post => {
      if (post.tags && Array.isArray(post.tags)) {
        post.tags.forEach(tag => {
          const normalizedTag = tag.toLowerCase();
          if (!tagStats[normalizedTag]) {
            tagStats[normalizedTag] = {
              name: tag,
              count: 0,
              totalLikes: 0,
              totalViews: 0
            };
          }
          tagStats[normalizedTag].count++;
          tagStats[normalizedTag].totalLikes += post.likes || 0;
          tagStats[normalizedTag].totalViews += post.views || 0;
        });
      }
    });

    return Object.values(tagStats)
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }, [feedPosts]);

  // En aktif yazarları hesapla
  const activeAuthors = useMemo(() => {
    const authorStats = {};
    
    feedPosts.forEach(post => {
      const author = users.find(user => user.id === post.userId);
      if (author) {
        if (!authorStats[author.id]) {
          authorStats[author.id] = {
            ...author,
            postCount: 0,
            totalLikes: 0,
            totalViews: 0
          };
        }
        authorStats[author.id].postCount++;
        authorStats[author.id].totalLikes += post.likes || 0;
        authorStats[author.id].totalViews += post.views || 0;
      }
    });

    return Object.values(authorStats)
      .sort((a, b) => b.postCount - a.postCount)
      .slice(0, 5);
  }, [feedPosts, users]);

  // Seçili kategoriye göre yazıları filtrele
  const filteredPosts = useMemo(() => {
    let filtered = feedPosts;
    
    // Kategori seçiliyse filtrele
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(post => 
        post.tags && post.tags.some(tag => 
          tag.toLowerCase().includes(selectedCategory.toLowerCase())
        )
      );
    }

    // Arama sorgusu varsa filtrele
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      filtered = filtered.filter(post => {
        const author = users.find(user => user.id === post.userId);
        return (
          post.content.toLowerCase().includes(searchLower) ||
          author.name.toLowerCase().includes(searchLower) ||
          (post.title && post.title.toLowerCase().includes(searchLower)) ||
          (post.tags && post.tags.some(tag => tag.toLowerCase().includes(searchLower)))
        );
      });
    }

    // Popülerliğe göre sırala
    return filtered.sort((a, b) => {
      const scoreA = (a.likes * 2) + (a.views * 0.1) + (a.comments || 0);
      const scoreB = (b.likes * 2) + (b.views * 0.1) + (b.comments || 0);
      return scoreB - scoreA;
    });
  }, [feedPosts, selectedCategory, searchQuery, users]);

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

  // Kategori seçildiğinde ilk sayfaya dön
  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1);
  };

  // Sayfa değiştirme fonksiyonu
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
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
         width: '1360px',
         boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
         marginLeft: '19px',
       }}>
                   <div style={{
            display: 'flex',
            gap: '60px',
            maxWidth: '1500px',
            margin: '0 auto',
            alignItems: 'flex-start'
          }}>
            {/* Sol Taraf - Başlık ve Arama */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
              flex: 1,
              marginTop: '20px',
              marginLeft: '20px'
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
                  Gündem
                </h1>
                <p style={{
                  fontSize: '1.2rem',
                  fontWeight: '400',
                  margin: 0,
                  color: 'white'
                }}>
                  En popüler içerikleri keşfedin ve güncel konuları takip edin
                </p>
              </div>

              <div style={{
                display: 'flex',
                gap: '16px',
                maxWidth: '500px',
                alignItems: 'center'
              }}>
                <div style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  padding: '12px 16px',
                  borderRadius: '0',
                  backdropFilter: 'blur(4px)',
                  WebkitBackdropFilter: 'blur(4px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}>
                  <span className="material-icons" style={{ color: 'white' }}>search</span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder="Gündem yazılarında ara..."
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

            {/* Sağ Taraf - En Popüler Etiketler Tablosu */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '0',
              padding: '16px',
              backdropFilter: 'blur(4px)',
              WebkitBackdropFilter: 'blur(4px)',
              minWidth: '420px',
              maxWidth: '460px'
            }}>
              <h3 style={{
                fontSize: '1rem',
                fontWeight: '600',
                margin: '0 0 12px 0',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <span className="material-icons" style={{ fontSize: '18px' }}>trending_up</span>
                Popüler Etiketler
              </h3>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '8px'
              }}>
                {popularTags.slice(0, 6).map((tag, index) => (
                  <div key={tag.name} style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '0',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                    e.target.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                    e.target.style.transform = 'translateY(0)';
                  }}
                  onClick={() => handleCategorySelect(tag.name.toLowerCase())}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{
                        background: 'linear-gradient(135deg, var(--primary-color), var(--accent-color))',
                        color: 'white',
                        width: '20px',
                        height: '20px',
                        borderRadius: '0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.7rem',
                        fontWeight: '700'
                      }}>
                        #{index + 1}
                      </span>
                      <span style={{
                        fontSize: '0.85rem',
                        fontWeight: '500',
                        color: 'white'
                      }}>
                        {tag.name}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{
                        fontSize: '0.75rem',
                        color: 'rgba(255, 255, 255, 0.7)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '2px'
                      }}>
                        <span className="material-icons" style={{ fontSize: '12px' }}>article</span>
                        {tag.count}
                      </span>
                      <span style={{
                        fontSize: '0.75rem',
                        color: 'rgba(255, 255, 255, 0.7)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '2px'
                      }}>
                        <span className="material-icons" style={{ fontSize: '12px' }}>favorite</span>
                        {tag.totalLikes}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
       </div>

      <div className="container" style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 20px' }}>
                          {/* Arama ve Kategori Filtreleri */}
         <div style={{
           background: 'var(--surface-color)',
           border: '2px solid var(--border-color)',
           borderRadius: '0',
           padding: '24px',
           marginTop: '80px',
           marginBottom: '32px',
           boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
         }}>
           <div style={{
             display: 'flex',
             justifyContent: 'space-between',
             alignItems: 'center',
             gap: '20px'
           }}>
             {/* Sol Taraf - Arama Çubuğu */}
             <div style={{
               flex: 1,
               maxWidth: '400px'
             }}>
               <div style={{
                 display: 'flex',
                 alignItems: 'center',
                 gap: '12px',
                 background: 'var(--background-color)',
                 padding: '12px 16px',
                 borderRadius: '0',
                 border: '2px solid var(--border-light)',
                 boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
               }}>
                 <span className="material-icons" style={{ color: 'var(--text-secondary)' }}>search</span>
                 <input
                   type="text"
                   value={searchQuery}
                   onChange={handleSearchChange}
                   placeholder="Gündem yazılarında ara..."
                   style={{
                     background: 'none',
                     border: 'none',
                     color: 'var(--text-color)',
                     fontSize: '1rem',
                     width: '100%',
                     outline: 'none'
                   }}
                   className="search-input"
                 />
               </div>
             </div>

             {/* Sağ Taraf - Kategori Filtreleri */}
             <div style={{
               display: 'flex',
               gap: '12px',
               flexWrap: 'wrap',
               justifyContent: 'flex-end'
             }}>
               {categories.map(category => (
                 <button
                   key={category.id}
                   onClick={() => handleCategorySelect(category.id)}
                   style={{
                     display: 'flex',
                     alignItems: 'center',
                     gap: '8px',
                     padding: '12px 20px',
                     background: selectedCategory === category.id 
                       ? category.color 
                       : 'var(--background-color)',
                     color: selectedCategory === category.id 
                       ? 'white' 
                       : 'var(--text-color)',
                     border: `2px solid ${selectedCategory === category.id ? category.color : 'var(--border-light)'}`,
                     borderRadius: '0',
                     cursor: 'pointer',
                     fontSize: '1rem',
                     fontWeight: '600',
                     transition: 'all 0.3s ease',
                     boxShadow: selectedCategory === category.id 
                       ? `0 4px 12px ${category.color}40` 
                       : '0 2px 8px rgba(0,0,0,0.1)'
                   }}
                   onMouseEnter={(e) => {
                     if (selectedCategory !== category.id) {
                       e.target.style.transform = 'translateY(-2px)';
                       e.target.style.boxShadow = '0 6px 16px rgba(0,0,0,0.15)';
                     }
                   }}
                   onMouseLeave={(e) => {
                     if (selectedCategory !== category.id) {
                       e.target.style.transform = 'translateY(0)';
                       e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                     }
                   }}
                 >
                   <span className="material-icons" style={{ fontSize: '20px' }}>
                     {category.icon}
                   </span>
                   {category.name}
                 </button>
               ))}
             </div>
           </div>
         </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 2fr 1fr',
          gap: '32px',
          alignItems: 'start'
        }}>
          {/* Sol Sidebar - Popüler Yazılar */}
          <div style={{
            position: 'sticky',
            top: '120px'
          }}>
            <div style={{
              background: 'var(--surface-color)',
              border: '2px solid var(--border-color)',
              borderRadius: '0',
              padding: '24px',
              marginBottom: '24px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{
                fontSize: '1.3rem',
                fontWeight: '700',
                margin: '0 0 20px 0',
                color: 'var(--text-color)',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <span className="material-icons" style={{ 
                  fontSize: '24px',
                  color: 'var(--primary-color)'
                }}>trending_up</span>
                Popüler Yazılar
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {popularPosts.map((post, index) => (
                  <Link 
                    key={post.id}
                    to={`/post/${post.id}`}
                    style={{
                      textDecoration: 'none',
                      color: 'inherit'
                    }}
                  >
                    <div style={{
                      padding: '16px',
                      borderRadius: '0',
                      background: 'var(--background-color)',
                      border: '1px solid var(--border-light)',
                      cursor: 'pointer',
                      position: 'relative',
                      overflow: 'hidden',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 6px 16px rgba(0,0,0,0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = 'none';
                    }}
                    >
                      <div style={{
                        position: 'absolute',
                        top: '0',
                        left: '0',
                        width: '4px',
                        height: '100%',
                        background: `linear-gradient(135deg, var(--primary-color), var(--accent-color))`,
                        borderRadius: '0'
                      }} />
                      
                      <div style={{ paddingLeft: '12px' }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          marginBottom: '8px'
                        }}>
                          <span style={{
                            background: 'linear-gradient(135deg, var(--primary-color), var(--accent-color))',
                            color: 'white',
                            width: '28px',
                            height: '28px',
                            borderRadius: '0',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.8rem',
                            fontWeight: '700'
                          }}>
                            #{index + 1}
                          </span>
                          <span style={{
                            fontSize: '0.85rem',
                            color: 'var(--text-secondary)',
                            fontWeight: '500'
                          }}>
                            {users.find(user => user.id === post.userId)?.name || 'Bilinmeyen Yazar'}
                          </span>
                        </div>
                        
                        <h4 style={{
                          fontSize: '1rem',
                          fontWeight: '600',
                          margin: '0 0 8px 0',
                          color: 'var(--text-color)',
                          lineHeight: '1.4',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}>
                          {post.title}
                        </h4>
                        
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          fontSize: '0.8rem',
                          color: 'var(--text-secondary)'
                        }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <span className="material-icons" style={{ fontSize: '14px' }}>visibility</span>
                            {post.views}
                          </span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <span className="material-icons" style={{ fontSize: '14px' }}>favorite</span>
                            {post.likes}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Aktif Yazarlar */}
            <div style={{
              background: 'var(--surface-color)',
              border: '2px solid var(--border-color)',
              borderRadius: '0',
              padding: '24px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{
                fontSize: '1.3rem',
                fontWeight: '700',
                margin: '0 0 20px 0',
                color: 'var(--text-color)',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <span className="material-icons" style={{ 
                  fontSize: '24px',
                  color: 'var(--primary-color)'
                }}>person</span>
                Aktif Yazarlar
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {activeAuthors.map((author, index) => (
                  <div key={author.id} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px',
                    borderRadius: '0',
                    background: 'var(--background-color)',
                    border: '1px solid var(--border-light)'
                  }}>
                    <span style={{
                      background: 'linear-gradient(135deg, var(--primary-color), var(--accent-color))',
                      color: 'white',
                      width: '32px',
                      height: '32px',
                      borderRadius: '0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.9rem',
                      fontWeight: '600'
                    }}>
                      {author.name.charAt(0).toUpperCase()}
                    </span>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        color: 'var(--text-color)',
                        marginBottom: '2px'
                      }}>
                        {author.name}
                      </div>
                      <div style={{
                        fontSize: '0.8rem',
                        color: 'var(--text-secondary)'
                      }}>
                        {author.postCount} yazı • {author.totalLikes} beğeni
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Ana İçerik */}
          <div>
            {/* Seçili Kategori Bilgisi */}
            {selectedCategory !== 'all' && (
              <div style={{
                background: 'var(--surface-color)',
                border: '2px solid var(--border-color)',
                borderRadius: '0',
                padding: '24px',
                marginBottom: '24px',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
              }}>
                <div style={{
                  background: categories.find(c => c.id === selectedCategory)?.color || 'var(--primary-color)',
                  color: 'white',
                  width: '48px',
                  height: '48px',
                  borderRadius: '0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <span className="material-icons" style={{ fontSize: '24px' }}>
                    {categories.find(c => c.id === selectedCategory)?.icon}
                  </span>
                </div>
                <div>
                  <h3 style={{
                    fontSize: '1.2rem',
                    fontWeight: '600',
                    margin: '0 0 4px 0',
                    color: 'var(--text-color)'
                  }}>
                    {categories.find(c => c.id === selectedCategory)?.name} Kategorisi
                  </h3>
                  <p style={{
                    fontSize: '0.9rem',
                    margin: 0,
                    color: 'var(--text-secondary)'
                  }}>
                    {filteredPosts.length} yazı bulundu
                  </p>
                </div>
              </div>
            )}

            {/* Yükleme Durumu */}
            {loading && (
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '60px 20px',
                color: 'var(--text-secondary)',
                fontSize: '1.1rem'
              }}>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '16px'
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    border: '3px solid var(--border-color)',
                    borderTop: '3px solid var(--primary-color)',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }}></div>
                  <span>Yazılar yükleniyor...</span>
                </div>
              </div>
            )}

            {/* Hata Durumu */}
            {error && !loading && (
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '60px 20px',
                color: '#dc3545',
                fontSize: '1.1rem'
              }}>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '16px'
                }}>
                  <span className="material-icons" style={{ fontSize: '48px' }}>error</span>
                  <span>{error}</span>
                  <button
                    onClick={() => window.location.reload()}
                    style={{
                      padding: '8px 16px',
                      background: 'var(--primary-color)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '0.9rem'
                    }}
                  >
                    Tekrar Dene
                  </button>
                </div>
              </div>
            )}

            {/* Yazılar */}
            {!loading && !error && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {currentPosts.length > 0 ? (
                  currentPosts.map(post => (
                    <Post key={post.id} post={post} />
                  ))
                ) : (
                  <div style={{
                    textAlign: 'center',
                    padding: '60px 24px',
                    color: 'var(--text-secondary)',
                    fontSize: '1.1rem',
                    background: 'var(--surface-color)',
                    border: '2px solid var(--border-color)',
                    borderRadius: '0'
                  }}>
                    <span className="material-icons" style={{ 
                      fontSize: '64px', 
                      marginBottom: '20px', 
                      display: 'block',
                      color: 'var(--primary-color)',
                      opacity: 0.5
                    }}>
                      {selectedCategory !== 'all' ? 'category' : 'article'}
                    </span>
                    {selectedCategory !== 'all' 
                      ? `"${categories.find(c => c.id === selectedCategory)?.name}" kategorisinde henüz yazı bulunmuyor.`
                      : 'Henüz yazı bulunmuyor.'
                    }
                  </div>
                )}
              </div>
            )}

            {/* Sayfalama */}
            {totalPages > 1 && (
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '8px',
                marginTop: '40px',
                padding: '32px 0'
              }}>
                {/* Önceki Sayfa Butonu */}
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  style={{
                    padding: '12px 20px',
                    border: '2px solid var(--border-color)',
                    borderRadius: '0',
                    background: currentPage === 1 ? 'var(--border-light)' : 'var(--surface-color)',
                    color: currentPage === 1 ? 'var(--text-secondary)' : 'var(--text-color)',
                    cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '0.95rem',
                    fontWeight: '600',
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
                  <span className="material-icons" style={{ fontSize: '18px' }}>chevron_left</span>
                  Önceki
                </button>

                {/* Sayfa Numaraları */}
                <div style={{
                  display: 'flex',
                  gap: '6px'
                }}>
                  {Array.from({ length: totalPages }, (_, index) => index + 1).map(pageNumber => {
                    if (totalPages <= 7) {
                      return (
                        <button
                          key={pageNumber}
                          onClick={() => handlePageChange(pageNumber)}
                          style={{
                            padding: '12px 16px',
                            border: '2px solid var(--border-color)',
                            borderRadius: '0',
                            background: currentPage === pageNumber ? 'var(--primary-color)' : 'var(--surface-color)',
                            color: currentPage === pageNumber ? 'white' : 'var(--text-color)',
                            cursor: 'pointer',
                            fontSize: '0.95rem',
                            fontWeight: '600',
                            minWidth: '48px',
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
                      if (pageNumber === 1 || pageNumber === totalPages || 
                          (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)) {
                        return (
                          <button
                            key={pageNumber}
                            onClick={() => handlePageChange(pageNumber)}
                            style={{
                              padding: '12px 16px',
                              border: '2px solid var(--border-color)',
                              borderRadius: '12px',
                              background: currentPage === pageNumber ? 'var(--primary-color)' : 'var(--surface-color)',
                              color: currentPage === pageNumber ? 'white' : 'var(--text-color)',
                              cursor: 'pointer',
                              fontSize: '0.95rem',
                              fontWeight: '600',
                              minWidth: '48px',
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
                              padding: '12px 8px',
                              color: 'var(--text-secondary)',
                              fontSize: '0.95rem',
                              fontWeight: '600'
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
                    padding: '12px 20px',
                    border: '2px solid var(--border-color)',
                    borderRadius: '0',
                    background: currentPage === totalPages ? 'var(--border-light)' : 'var(--surface-color)',
                    color: currentPage === totalPages ? 'var(--text-secondary)' : 'var(--text-color)',
                    cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '0.95rem',
                    fontWeight: '600',
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
                  <span className="material-icons" style={{ fontSize: '18px' }}>chevron_right</span>
                </button>
              </div>
            )}

            {/* Sayfa Bilgisi */}
            {totalPages > 1 && (
              <div style={{
                textAlign: 'center',
                marginTop: '20px',
                color: 'var(--text-secondary)',
                fontSize: '0.9rem',
                fontWeight: '500'
              }}>
                Sayfa {currentPage} / {totalPages} • Toplam {filteredPosts.length} yazı
                {selectedCategory !== 'all' && ` • ${categories.find(c => c.id === selectedCategory)?.name} kategorisi`}
              </div>
            )}
          </div>

          {/* Sağ Sidebar - İstatistikler */}
          <div style={{
            position: 'sticky',
            top: '120px'
          }}>
            <div style={{
              background: 'var(--surface-color)',
              border: '2px solid var(--border-color)',
              borderRadius: '0',
              padding: '24px',
              marginBottom: '24px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{
                fontSize: '1.3rem',
                fontWeight: '700',
                margin: '0 0 20px 0',
                color: 'var(--text-color)',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <span className="material-icons" style={{ 
                  fontSize: '24px',
                  color: 'var(--primary-color)'
                }}>analytics</span>
                Gündem İstatistikleri
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px',
                  background: 'var(--background-color)',
                  borderRadius: '0',
                  border: '1px solid var(--border-light)'
                }}>
                  <div>
                    <div style={{
                      fontSize: '0.9rem',
                      color: 'var(--text-secondary)',
                      marginBottom: '4px'
                    }}>
                      Toplam Yazı
                    </div>
                    <div style={{
                      fontSize: '1.5rem',
                      fontWeight: '700',
                      color: 'var(--text-color)'
                    }}>
                      {feedPosts.length}
                    </div>
                  </div>
                  <span className="material-icons" style={{ 
                    fontSize: '32px',
                    color: 'var(--primary-color)',
                    opacity: 0.7
                  }}>
                    article
                  </span>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px',
                  background: 'var(--background-color)',
                  borderRadius: '0',
                  border: '1px solid var(--border-light)'
                }}>
                  <div>
                    <div style={{
                      fontSize: '0.9rem',
                      color: 'var(--text-secondary)',
                      marginBottom: '4px'
                    }}>
                      Toplam Beğeni
                    </div>
                    <div style={{
                      fontSize: '1.5rem',
                      fontWeight: '700',
                      color: 'var(--text-color)'
                    }}>
                      {feedPosts.reduce((sum, post) => sum + (post.likes || 0), 0)}
                    </div>
                  </div>
                  <span className="material-icons" style={{ 
                    fontSize: '32px',
                    color: '#dc2626',
                    opacity: 0.7
                  }}>
                    favorite
                  </span>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px',
                  background: 'var(--background-color)',
                  borderRadius: '0',
                  border: '1px solid var(--border-light)'
                }}>
                  <div>
                    <div style={{
                      fontSize: '0.9rem',
                      color: 'var(--text-secondary)',
                      marginBottom: '4px'
                    }}>
                      Toplam Görüntüleme
                    </div>
                    <div style={{
                      fontSize: '1.5rem',
                      fontWeight: '700',
                      color: 'var(--text-color)'
                    }}>
                      {feedPosts.reduce((sum, post) => sum + (post.views || 0), 0)}
                    </div>
                  </div>
                  <span className="material-icons" style={{ 
                    fontSize: '32px',
                    color: '#059669',
                    opacity: 0.7
                  }}>
                    visibility
                  </span>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px',
                  background: 'var(--background-color)',
                  borderRadius: '0',
                  border: '1px solid var(--border-light)'
                }}>
                  <div>
                    <div style={{
                      fontSize: '0.9rem',
                      color: 'var(--text-secondary)',
                      marginBottom: '4px'
                    }}>
                      Aktif Yazar
                    </div>
                    <div style={{
                      fontSize: '1.5rem',
                      fontWeight: '700',
                      color: 'var(--text-color)'
                    }}>
                      {activeAuthors.length}
                    </div>
                  </div>
                  <span className="material-icons" style={{ 
                    fontSize: '32px',
                    color: '#7c3aed',
                    opacity: 0.7
                  }}>
                    person
                  </span>
                </div>
              </div>
            </div>

            {/* Gündemin Amacı */}
            <div style={{
              background: 'var(--surface-color)',
              border: '2px solid var(--border-color)',
              borderRadius: '0',
              padding: '24px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{
                fontSize: '1.3rem',
                fontWeight: '700',
                margin: '0 0 16px 0',
                color: 'var(--text-color)',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <span className="material-icons" style={{ 
                  fontSize: '24px',
                  color: 'var(--primary-color)'
                }}>info</span>
                Gündemin Amacı
              </h3>
              
              <div style={{
                fontSize: '0.95rem',
                lineHeight: '1.6',
                color: 'var(--text-secondary)'
              }}>
                <p style={{ margin: '0 0 12px 0' }}>
                  Gündem sayfası, en popüler ve güncel içerikleri bir arada sunarak kullanıcıların ilgi alanlarına göre bilgiye hızlıca erişmesini sağlar.
                </p>
                <p style={{ margin: '0 0 12px 0' }}>
                  Kategorilere göre filtreleme yaparak, en çok konuşulan konuları ve trend olan etiketleri keşfedebilir, topluluk içindeki en aktif yazarları takip edebilirsiniz.
                </p>
                <p style={{ margin: 0 }}>
                  Bu sayede bilgi paylaşımını teşvik eder ve kaliteli içeriklerin daha fazla kişiye ulaşmasını destekleriz.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Gundem; 