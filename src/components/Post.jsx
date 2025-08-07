import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { users, admins } from '../data/dummyData';

const Post = ({ post, isDetailView, onDelete, hideViews }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes || 0);
  const [sharesCount, setSharesCount] = useState(post.shares || 0);
  const [showComments, setShowComments] = useState(false);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState(post.comments || []);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [commentForm, setCommentForm] = useState({
    name: '',
    email: '',
    website: ''
  });
  
  // Yazarı bul (admin veya normal kullanıcı)
  const author = post.authorId ? 
    admins.find(admin => admin.id === post.authorId) || users.find(user => user.id === post.userId) :
    users.find(user => user.id === post.userId);

  const handleLike = () => {
    if (isLiked) {
      setLikesCount(prev => prev - 1);
    } else {
      setLikesCount(prev => prev + 1);
    }
    setIsLiked(!isLiked);
  };

  const handleShare = () => {
    // Paylaşma sayısını artır
    setSharesCount(prev => prev + 1);
    
    // Post'un shares alanını güncelle
    post.shares = (post.shares || 0) + 1;
    
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.content,
        url: window.location.href
      });
    } else {
      // Fallback: URL'yi panoya kopyala
      navigator.clipboard.writeText(window.location.href);
      alert('Link panoya kopyalandı!');
    }
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!commentText.trim() || !commentForm.name.trim()) return;

    setIsSubmittingComment(true);
    
    // Yeni yorum oluştur
    const newComment = {
      id: Date.now(),
      content: commentText.trim(),
      authorName: commentForm.name.trim(),
      authorEmail: commentForm.email.trim(),
      authorWebsite: commentForm.website.trim(),
      timestamp: new Date().toISOString(),
      likes: 0
    };

    // Yorumları güncelle
    const updatedComments = [...comments, newComment];
    setComments(updatedComments);
    
    // Post'un comments alanını güncelle
    post.comments = updatedComments;
    
    // Formu temizle
    setCommentText('');
    setCommentForm({
      name: '',
      email: '',
      website: ''
    });
    setIsSubmittingComment(false);
  };

  const handleCommentLike = (commentId) => {
    setComments(prevComments => 
      prevComments.map(comment => 
        comment.id === commentId 
          ? { ...comment, likes: comment.likes + 1 }
          : comment
      )
    );
  };

  return (
    <div className="card post" style={{
      width: '100%',
      maxWidth: '100%',
      overflow: 'hidden',
      borderRadius: 0,
      border: '2px solid var(--border-color)',
    }}>
      <div className="post-header" style={{ 
        cursor: !isDetailView ? 'pointer' : 'default',
        width: '100%',
        maxWidth: '100%'
      }}>
        {!isDetailView ? (
          <Link to={`/post/${post.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div className="author-info" style={{ marginBottom: '8px' }}>
                  <h3 style={{ 
                    fontSize: '14px', 
                    fontWeight: '600',
                    color: 'var(--gray-color)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    {author.name}
                    {post.authorId && (
                      <span style={{
                        background: '#dc3545',
                        color: 'white',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        fontSize: '10px',
                        fontWeight: '500'
                      }}>
                        ADMIN
                      </span>
                    )}
                  </h3>
                </div>
                <h2 style={{ 
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  margin: 0
                }}>{post.title}</h2>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                color: 'var(--gray-color)',
                fontSize: '0.9rem'
              }}>
                {!hideViews && (
                  <>
                    <span className="material-icons" style={{ fontSize: '16px' }}>visibility</span>
                    {post.views || 0}
                  </>
                )}
              </div>
            </div>
          </Link>
        ) : (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div className="author-info" style={{ marginBottom: '16px' }}>
                  <h3 style={{ 
                    fontSize: '1.1rem', 
                    fontWeight: '600',
                    color: 'var(--gray-color)',
                    margin: 0,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    {author.name}
                    {post.authorId && (
                      <span style={{
                        background: '#dc3545',
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '500'
                      }}>
                        ADMIN
                      </span>
                    )}
                  </h3>
                </div>
                <h2 style={{ 
                  fontSize: '2rem', 
                  fontWeight: '700',
                  margin: 0,
                  marginBottom: '24px'
                }}>{post.title}</h2>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                color: 'var(--gray-color)',
                fontSize: '0.9rem'
              }}>
                {!hideViews && (
                  <>
                    <span className="material-icons" style={{ fontSize: '16px' }}>visibility</span>
                    {post.views || 0}
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="post-content" style={{ 
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        minHeight: isDetailView ? '300px' : 'auto',
        width: '100%',
        maxWidth: '100%',
        overflow: 'hidden',
        wordBreak: 'break-word'
      }}>
        <p style={{ 
          fontSize: '1.1rem', 
          lineHeight: '1.8',
          flex: 1,
          width: '100%',
          wordBreak: 'break-word'
        }}>
          {!isDetailView && post.content.length > 500 ? (
            <>
              {post.content.slice(0, 500)}...
              <Link 
                to={`/post/${post.id}`}
                style={{
                  color: 'var(--primary-color)',
                  textDecoration: 'none',
                  marginLeft: '4px',
                  fontWeight: '500'
                }}
              >
                devamını oku
              </Link>
            </>
          ) : (
            post.content
          )}
        </p>

        {post.tags && post.tags.length > 0 && (
          <div style={{ 
            display: 'flex', 
            gap: '8px', 
            flexWrap: 'wrap',
            width: '100%'
          }}>
            {post.tags.map((tag, index) => (
              <span 
                key={index}
                style={{
                  color: 'var(--primary-color)',
                  fontSize: '0.9rem',
                  cursor: 'pointer'
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 'auto',
          paddingTop: '20px',
          borderTop: '1px solid var(--border-color)'
        }}>
          <div className="post-actions" style={{ display: 'flex', gap: '8px' }}>
            <button 
              className={`action-button ${isLiked ? 'liked' : ''}`}
              onClick={handleLike}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: isLiked ? 'var(--primary-color)' : 'var(--gray-color)',
                padding: '2px 12px'
              }}
            >
              <span className="material-icons">
                {isLiked ? 'thumb_up' : 'thumb_up_off_alt'}
              </span>
              {likesCount}
            </button>
            
            <button
              onClick={() => setShowComments(!showComments)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--gray-color)',
                padding: '2px 12px'
              }}
            >
              <span className="material-icons">comment</span>
              {comments.length} Yorum
            </button>
            
            <button
              onClick={handleShare}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--gray-color)',
                padding: '2px 12px'
              }}
            >
              <span className="material-icons">share</span>
              Paylaş
            </button>
          </div>

          <span style={{ 
            fontSize: '0.9rem', 
            color: 'var(--gray-color)',
            marginTop: '16px',
            display: 'inline-block'
          }}>
            {new Date(post.timestamp).toLocaleDateString('tr-TR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </span>
        </div>

        {/* Yorumlar Bölümü */}
        {showComments && (
          <div style={{
            borderTop: '1px solid var(--border-color)',
            paddingTop: '20px',
            marginTop: '20px'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px'
            }}>
              <h3 style={{
                fontSize: '1.1rem',
                fontWeight: '600',
                color: 'var(--text-color)',
                margin: 0
              }}>
                Yorumlar ({comments.length})
              </h3>
              
              <button
                onClick={() => setShowCommentForm(!showCommentForm)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '6px',
                  border: '1px solid var(--primary-color)',
                  background: showCommentForm ? 'var(--primary-color)' : 'transparent',
                  color: showCommentForm ? 'white' : 'var(--primary-color)',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span className="material-icons" style={{ fontSize: '16px' }}>
                  {showCommentForm ? 'close' : 'add_comment'}
                </span>
                {showCommentForm ? 'Formu Kapat' : 'Yorum Yap'}
              </button>
            </div>

            {/* Yorum Formu */}
            {showCommentForm && (
              <form onSubmit={handleCommentSubmit} style={{ marginBottom: '24px' }}>
                <h4 style={{
                  fontSize: '1rem',
                  fontWeight: '600',
                  marginBottom: '16px',
                  color: 'var(--text-color)'
                }}>
                  Yorum Yap
                </h4>
                
                {/* Kişisel Bilgiler */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '12px',
                  marginBottom: '16px'
                }}>
                  <div>
                    <label style={{
                      display: 'block',
                      marginBottom: '6px',
                      color: 'var(--gray-color)',
                      fontSize: '0.9rem',
                      fontWeight: '500'
                    }}>
                      Adınız *
                    </label>
                    <input
                      type="text"
                      value={commentForm.name}
                      onChange={(e) => setCommentForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Adınızı girin"
                      required
                      style={{
                        width: '100%',
                        padding: '10px',
                        borderRadius: '6px',
                        border: '1px solid var(--border-color)',
                        fontSize: '0.9rem',
                        color: 'black'
                      }}
                    />
                  </div>
                  
                  <div>
                    <label style={{
                      display: 'block',
                      marginBottom: '6px',
                      color: 'var(--gray-color)',
                      fontSize: '0.9rem',
                      fontWeight: '500'
                    }}>
                      E-posta (İsteğe bağlı)
                    </label>
                    <input
                      type="email"
                      value={commentForm.email}
                      onChange={(e) => setCommentForm(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="E-posta adresiniz"
                      style={{
                        width: '100%',
                        padding: '10px',
                        borderRadius: '6px',
                        border: '1px solid var(--border-color)',
                        fontSize: '0.9rem',
                        color: 'black'
                      }}
                    />
                  </div>
                  
                  <div>
                    <label style={{
                      display: 'block',
                      marginBottom: '6px',
                      color: 'var(--gray-color)',
                      fontSize: '0.9rem',
                      fontWeight: '500'
                    }}>
                      Website (İsteğe bağlı)
                    </label>
                    <input
                      type="url"
                      value={commentForm.website}
                      onChange={(e) => setCommentForm(prev => ({ ...prev, website: e.target.value }))}
                      placeholder="Website adresiniz"
                      style={{
                        width: '100%',
                        padding: '10px',
                        borderRadius: '6px',
                        border: '1px solid var(--border-color)',
                        fontSize: '0.9rem',
                        color: 'black'
                      }}
                    />
                  </div>
                </div>

                {/* Yorum Metni */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '6px',
                    color: 'var(--gray-color)',
                    fontSize: '0.9rem',
                    fontWeight: '500'
                  }}>
                    Yorumunuz *
                  </label>
                  <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Yorumunuzu yazın..."
                    required
                    maxLength={500}
                    style={{
                      width: '100%',
                      minHeight: '100px',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-color)',
                      fontSize: '1rem',
                      resize: 'vertical',
                      color: 'black'
                    }}
                  />
                  <div style={{
                    textAlign: 'right',
                    fontSize: '0.8rem',
                    color: 'var(--gray-color)',
                    marginTop: '4px'
                  }}>
                    {commentText.length}/500 karakter
                  </div>
                </div>

                {/* Gönder Butonu */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '12px'
                }}>
                  <button
                    type="button"
                    onClick={() => setShowCommentForm(false)}
                    style={{
                      padding: '12px 24px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-color)',
                      background: 'white',
                      color: 'var(--gray-color)',
                      cursor: 'pointer',
                      fontSize: '1rem',
                      fontWeight: '500'
                    }}
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingComment || !commentText.trim() || !commentForm.name.trim()}
                    style={{
                      padding: '12px 24px',
                      borderRadius: '8px',
                      border: 'none',
                      background: 'var(--primary-color)',
                      color: 'white',
                      cursor: isSubmittingComment || !commentText.trim() || !commentForm.name.trim() ? 'not-allowed' : 'pointer',
                      fontSize: '1rem',
                      fontWeight: '500',
                      opacity: isSubmittingComment || !commentText.trim() || !commentForm.name.trim() ? 0.6 : 1,
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {isSubmittingComment ? 'Gönderiliyor...' : 'Yorumu Gönder'}
                  </button>
                </div>
              </form>
            )}

            {/* Yorumlar Listesi */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <div key={comment.id} style={{
                    padding: '16px',
                    background: 'var(--background-color)',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)'
                  }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '8px'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}>
                        <span style={{
                          fontWeight: '600',
                          color: 'var(--text-color)',
                          fontSize: '0.9rem'
                        }}>
                          {comment.authorName}
                        </span>
                        {comment.authorEmail && (
                          <span style={{
                            fontSize: '0.8rem',
                            color: 'var(--gray-color)'
                          }}>
                            ({comment.authorEmail})
                          </span>
                        )}
                      </div>
                      <span style={{
                        fontSize: '0.8rem',
                        color: 'var(--gray-color)'
                      }}>
                        {new Date(comment.timestamp).toLocaleDateString('tr-TR', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    <p style={{
                      margin: '0 0 12px 0',
                      fontSize: '1rem',
                      lineHeight: '1.5',
                      color: 'var(--text-color)'
                    }}>
                      {comment.content}
                    </p>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <button
                        onClick={() => handleCommentLike(comment.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: 'var(--gray-color)',
                          fontSize: '0.9rem'
                        }}
                      >
                        <span className="material-icons" style={{ fontSize: '16px' }}>thumb_up_off_alt</span>
                        {comment.likes}
                      </button>
                      {comment.authorWebsite && (
                        <a 
                          href={comment.authorWebsite}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            fontSize: '0.8rem',
                            color: 'var(--primary-color)',
                            textDecoration: 'none'
                          }}
                        >
                          Website
                        </a>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div style={{
                  textAlign: 'center',
                  padding: '32px',
                  color: 'var(--gray-color)',
                  fontSize: '1rem'
                }}>
                  Henüz yorum yapılmamış. İlk yorumu siz yapın!
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Post; 