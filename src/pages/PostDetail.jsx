import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { users, admins, comments } from '../data/dummyData';
import { usePosts } from '../context/PostContext';
import RecommendedPosts from '../components/RecommendedPosts';

const PostDetail = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [postViews, setPostViews] = useState(0);
  const [likes, setLikes] = useState(0);
  const [shares, setShares] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [commentForm, setCommentForm] = useState({
    name: '',
    email: '',
    website: ''
  });
  const [postComments, setPostComments] = useState([]);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const hasViewBeenCounted = useRef(false);

  const { getPostById, loading, error } = usePosts();
  const post = getPostById(postId);

  // Post bulunduğunda state'leri güncelle
  useEffect(() => {
    if (post) {
      setPostViews(post.views || 0);
      setLikes(post.likes || 0);
      setShares(post.shares || 0);
    }
  }, [post]);

  // Yazar bulma fonksiyonu
  const getAuthor = (post) => {
    // Backend'den gelen yazar bilgilerini kullan
    if (post?.writerFirstName && post?.writerLastName) {
      return {
        name: `${post.writerFirstName} ${post.writerLastName}`,
        profileImage: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde'
      };
    }
    
    if (post?.authorId) {
      return admins.find(admin => admin.id === post.authorId) || users.find(user => user.id === post.userId);
    }
    return users.find(user => user.id === post.userId);
  };

  const author = post ? getAuthor(post) : null;

  useEffect(() => {
    if (post && !hasViewBeenCounted.current) {
      hasViewBeenCounted.current = true;
      const newViewCount = postViews + 1;
      setPostViews(newViewCount);
      post.views = newViewCount;
    }
  }, [post, postViews]);

  // Yorumları yükle
  useEffect(() => {
    if (post) {
      const filteredComments = comments.filter(comment => comment.postId === post.id);
      setPostComments(filteredComments);
    }
  }, [post]);

  const handleLike = () => {
    if (isLiked) {
      setLikes(prev => prev - 1);
    } else {
      setLikes(prev => prev + 1);
    }
    setIsLiked(!isLiked);
  };

  const handleShare = () => {
    setShares(prev => prev + 1);
    post.shares = (post.shares || 0) + 1;
    
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.content,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link panoya kopyalandı!');
    }
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!commentText.trim() || !commentForm.name.trim()) return;

    setIsSubmittingComment(true);
    
    const newComment = {
      id: Date.now(),
      postId: post.id,
      content: commentText.trim(),
      authorName: commentForm.name.trim(),
      authorEmail: commentForm.email.trim(),
      authorWebsite: commentForm.website.trim(),
      timestamp: new Date().toISOString(),
      likes: 0
    };

    // Global comments array'ine ekle
    comments.push(newComment);
    
    // Local state'i güncelle
    setPostComments(prevComments => [...prevComments, newComment]);
    
    setCommentText('');
    setCommentForm({
      name: '',
      email: '',
      website: ''
    });
    setIsSubmittingComment(false);
  };

  const handleCommentLike = (commentId) => {
    // Global comments array'ini güncelle
    const commentIndex = comments.findIndex(comment => comment.id === commentId);
    if (commentIndex !== -1) {
      comments[commentIndex].likes += 1;
    }
    
    // Local state'i güncelle
    setPostComments(prevComments => 
      prevComments.map(comment => 
        comment.id === commentId 
          ? { ...comment, likes: comment.likes + 1 }
          : comment
      )
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Yükleme durumu
  if (loading) {
    return (
      <div className="container" style={{ 
        marginTop: '100px', 
        maxWidth: '600px',
        textAlign: 'center',
        padding: '0 20px'
      }}>
        <div className="card" style={{
          padding: '48px 24px',
          textAlign: 'center'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '3px solid var(--border-color)',
            borderTop: '3px solid var(--primary-color)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 24px'
          }}></div>
          <h2 style={{
            fontSize: '1.8rem',
            fontWeight: '600',
            marginBottom: '16px',
            color: 'var(--text-color)'
          }}>Yazı Yükleniyor...</h2>
          <p style={{
            fontSize: '1.1rem',
            color: 'var(--text-secondary)',
            lineHeight: '1.6'
          }}>
            Yazı detayları yükleniyor, lütfen bekleyin.
          </p>
        </div>
      </div>
    );
  }

  // Hata durumu
  if (error) {
    return (
      <div className="container" style={{ 
        marginTop: '100px', 
        maxWidth: '600px',
        textAlign: 'center',
        padding: '0 20px'
      }}>
        <div className="card" style={{
          padding: '48px 24px',
          textAlign: 'center'
        }}>
          <span className="material-icons" style={{
            fontSize: '64px',
            color: '#dc3545',
            marginBottom: '24px'
          }}>error</span>
          <h2 style={{
            fontSize: '1.8rem',
            fontWeight: '600',
            marginBottom: '16px',
            color: 'var(--text-color)'
          }}>Hata Oluştu</h2>
          <p style={{
            fontSize: '1.1rem',
            color: 'var(--text-secondary)',
            marginBottom: '32px',
            lineHeight: '1.6'
          }}>
            {error}
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button
              onClick={() => window.location.reload()}
              className="btn btn-primary"
            >
              <span className="material-icons">refresh</span>
              Tekrar Dene
            </button>
            <Link to="/feed" className="btn btn-outline">
              <span className="material-icons">home</span>
              Ana Sayfaya Dön
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Yazı bulunamadı durumu
  if (!post) {
    return (
      <div className="container" style={{ 
        marginTop: '100px', 
        maxWidth: '600px',
        textAlign: 'center',
        padding: '0 20px'
      }}>
        <div className="card" style={{
          padding: '48px 24px',
          textAlign: 'center'
        }}>
          <span className="material-icons" style={{
            fontSize: '64px',
            color: 'var(--text-secondary)',
            marginBottom: '24px'
          }}>search_off</span>
          <h2 style={{
            fontSize: '1.8rem',
            fontWeight: '600',
            marginBottom: '16px',
            color: 'var(--text-color)'
          }}>Yazı Bulunamadı</h2>
          <p style={{
            fontSize: '1.1rem',
            color: 'var(--text-secondary)',
            marginBottom: '32px',
            lineHeight: '1.6'
          }}>
            Aradığınız yazı mevcut değil veya silinmiş olabilir.
          </p>
          <Link to="/feed" className="btn btn-primary">
            <span className="material-icons">home</span>
            Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>


      <div className="post-detail-container" style={{ paddingTop: '40px' }}>
        {/* Ana İçerik */}
        <div className="post-detail-content">
          {/* Post Başlığı ve Meta Bilgileri */}
          <div className="card" style={{
            marginBottom: '24px',
            padding: '32px',
            position: 'relative',
            overflow: 'visible'
          }}>
            {/* Geri Dönüş Butonu */}
            <button
              onClick={() => navigate('/feed')}
              style={{
                position: 'absolute',
                top: '1px',
                left: '-52px',
                background: 'transparent',
                color: 'var(--primary-color)',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: 'none',
                zIndex: 10,
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'scale(1)';
              }}
            >
              <span className="material-icons" style={{ fontSize: '28px' }}>arrow_back</span>
            </button>
            {/* Yazar Bilgisi */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '20px'
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--primary-color), var(--accent-color))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: '600',
                fontSize: '1.2rem'
              }}>
                {author?.name?.charAt(0) || '?'}
              </div>
              <div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '4px'
                }}>
                  <h3 style={{
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    color: 'var(--text-color)',
                    margin: 0
                  }}>
                    {author?.name || 'Bilinmeyen Yazar'}
                  </h3>
                  {post.authorId && (
                    <span style={{
                      background: '#dc3545',
                      color: 'white',
                      padding: '2px 8px',
                      borderRadius: '12px',
                      fontSize: '0.7rem',
                      fontWeight: '500'
                    }}>
                      ADMIN
                    </span>
                  )}
                </div>
                <div style={{
                  fontSize: '0.9rem',
                  color: 'var(--text-secondary)'
                }}>
                  {formatDate(post.timestamp)}
                </div>
              </div>
            </div>

            {/* Post Başlığı */}
            <h1 style={{
              fontSize: '2.5rem',
              fontWeight: '700',
              lineHeight: '1.2',
              margin: '0 0 20px 0',
              color: 'var(--text-color)'
            }}>
              {post.title}
            </h1>

            {/* Etiketler */}
            {post.tags && post.tags.length > 0 && (
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px',
                marginBottom: '24px'
              }}>
                {post.tags.map((tag, index) => (
                  <span key={index} style={{
                    background: 'var(--background-color)',
                    color: 'var(--primary-color)',
                    padding: '6px 12px',
                    borderRadius: '20px',
                    fontSize: '0.85rem',
                    fontWeight: '500',
                    border: '1px solid var(--border-color)'
                  }}>
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Post İçeriği */}
            <div style={{
              fontSize: '1.1rem',
              lineHeight: '1.8',
              color: 'var(--text-color)'
            }}>
              {post.content.split('\n').map((paragraph, index) => (
                <p key={index} style={{
                  marginBottom: '20px'
                }}>
                  {paragraph}
                </p>
              ))}
            </div>

            {/* İstatistikler */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '24px',
              padding: '16px 0',
              borderTop: '1px solid var(--border-light)',
              borderBottom: '1px solid var(--border-light)',
              margin: '24px 0'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                color: 'var(--text-secondary)',
                fontSize: '0.9rem'
              }}>
                <span className="material-icons" style={{ fontSize: '18px' }}>visibility</span>
                {postViews} görüntülenme
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                color: 'var(--text-secondary)',
                fontSize: '0.9rem'
              }}>
                <span className="material-icons" style={{ fontSize: '18px' }}>favorite</span>
                {likes} beğeni
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                color: 'var(--text-secondary)',
                fontSize: '0.9rem'
              }}>
                <span className="material-icons" style={{ fontSize: '18px' }}>share</span>
                {shares} paylaşım
              </div>
            </div>
          </div>

          {/* Etkileşim Butonları */}
          <div className="card" style={{
            marginBottom: '24px',
            padding: '24px'
          }}>
            <div style={{
              display: 'flex',
              gap: '16px',
              justifyContent: 'center'
            }}>
              <button
                onClick={handleLike}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 24px',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-lg)',
                  background: isLiked ? 'var(--primary-color)' : 'var(--surface-color)',
                  color: isLiked ? 'white' : 'var(--text-color)',
                  cursor: 'pointer',
                  fontWeight: '600',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  if (!isLiked) {
                    e.target.style.background = 'var(--background-color)';
                    e.target.style.borderColor = 'var(--primary-color)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isLiked) {
                    e.target.style.background = 'var(--surface-color)';
                    e.target.style.borderColor = 'var(--border-color)';
                  }
                }}
              >
                <span className="material-icons" style={{ fontSize: '20px' }}>
                  {isLiked ? 'favorite' : 'favorite_border'}
                </span>
                {isLiked ? 'Beğenildi' : 'Beğen'}
              </button>

              <button
                onClick={handleShare}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 24px',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-lg)',
                  background: 'var(--surface-color)',
                  color: 'var(--text-color)',
                  cursor: 'pointer',
                  fontWeight: '600',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'var(--background-color)';
                  e.target.style.borderColor = 'var(--primary-color)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'var(--surface-color)';
                  e.target.style.borderColor = 'var(--border-color)';
                }}
              >
                <span className="material-icons" style={{ fontSize: '20px' }}>share</span>
                Paylaş
              </button>

              <button
                onClick={() => setShowComments(!showComments)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 24px',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-lg)',
                  background: showComments ? 'var(--primary-color)' : 'var(--surface-color)',
                  color: showComments ? 'white' : 'var(--text-color)',
                  cursor: 'pointer',
                  fontWeight: '600',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  if (!showComments) {
                    e.target.style.background = 'var(--background-color)';
                    e.target.style.borderColor = 'var(--primary-color)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!showComments) {
                    e.target.style.background = 'var(--surface-color)';
                    e.target.style.borderColor = 'var(--border-color)';
                  }
                }}
              >
                <span className="material-icons" style={{ fontSize: '20px' }}>comment</span>
                Yorumlar ({postComments.length})
              </button>
            </div>
          </div>

          {/* Yorumlar Bölümü */}
          {showComments && (
            <div className="card" style={{
              marginBottom: '24px',
              padding: '24px'
            }}>
              <h3 style={{
                fontSize: '1.3rem',
                fontWeight: '600',
                marginBottom: '24px',
                color: 'var(--text-color)'
              }}>
                Yorumlar ({postComments.length})
              </h3>

              {/* Yorum Formu */}
              <form onSubmit={handleCommentSubmit} style={{
                marginBottom: '32px',
                padding: '24px',
                background: 'var(--background-color)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-light)'
              }}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '16px',
                  marginBottom: '16px'
                }}>
                  <input
                    type="text"
                    placeholder="Adınız *"
                    value={commentForm.name}
                    onChange={(e) => setCommentForm({...commentForm, name: e.target.value})}
                    required
                    style={{
                      padding: '12px',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-lg)',
                      fontSize: '0.9rem'
                    }}
                  />
                  <input
                    type="email"
                    placeholder="E-posta"
                    value={commentForm.email}
                    onChange={(e) => setCommentForm({...commentForm, email: e.target.value})}
                    style={{
                      padding: '12px',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-lg)',
                      fontSize: '0.9rem'
                    }}
                  />
                  <input
                    type="url"
                    placeholder="Website"
                    value={commentForm.website}
                    onChange={(e) => setCommentForm({...commentForm, website: e.target.value})}
                    style={{
                      padding: '12px',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-lg)',
                      fontSize: '0.9rem'
                    }}
                  />
                </div>
                <textarea
                  placeholder="Yorumunuzu yazın... *"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  required
                  rows="4"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-lg)',
                    fontSize: '0.9rem',
                    resize: 'vertical',
                    marginBottom: '16px'
                  }}
                />
                <button
                  type="submit"
                  disabled={isSubmittingComment}
                  style={{
                    padding: '12px 24px',
                    background: 'var(--primary-color)',
                    color: 'white',
                    border: 'none',
                    borderRadius: 'var(--radius-lg)',
                    fontWeight: '600',
                    cursor: isSubmittingComment ? 'not-allowed' : 'pointer',
                    opacity: isSubmittingComment ? 0.7 : 1
                  }}
                >
                  {isSubmittingComment ? 'Gönderiliyor...' : 'Yorum Gönder'}
                </button>
              </form>

              {/* Yorumlar Listesi */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {postComments.length === 0 ? (
                  <div style={{
                    textAlign: 'center',
                    padding: '32px',
                    color: 'var(--text-secondary)'
                  }}>
                    <span className="material-icons" style={{
                      fontSize: '48px',
                      marginBottom: '16px',
                      display: 'block'
                    }}>comment</span>
                    Henüz yorum yapılmamış. İlk yorumu siz yapın!
                  </div>
                ) : (
                  postComments.map(comment => (
                    <div key={comment.id} style={{
                      padding: '16px',
                      background: 'var(--background-color)',
                      borderRadius: 'var(--radius-lg)',
                      border: '1px solid var(--border-light)'
                    }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        marginBottom: '8px'
                      }}>
                        <div>
                          <div style={{
                            fontWeight: '600',
                            color: 'var(--text-color)',
                            marginBottom: '4px'
                          }}>
                            {comment.authorName}
                          </div>
                          <div style={{
                            fontSize: '0.8rem',
                            color: 'var(--text-secondary)'
                          }}>
                            {formatDate(comment.timestamp)}
                          </div>
                        </div>
                        <button
                          onClick={() => handleCommentLike(comment.id)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '4px 8px',
                            border: '1px solid var(--border-color)',
                            borderRadius: 'var(--radius-sm)',
                            background: 'var(--surface-color)',
                            color: 'var(--text-secondary)',
                            cursor: 'pointer',
                            fontSize: '0.8rem'
                          }}
                        >
                          <span className="material-icons" style={{ fontSize: '14px' }}>favorite</span>
                          {comment.likes}
                        </button>
                      </div>
                      <div style={{
                        fontSize: '0.95rem',
                        lineHeight: '1.6',
                        color: 'var(--text-color)'
                      }}>
                        {comment.content}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Sağ Sidebar - Önerilen Yazılar */}
        <div className="right-sidebar">
          <RecommendedPosts currentPostId={post.id} isHomePage={true} />
        </div>
      </div>
    </>
  );
};

export default PostDetail; 