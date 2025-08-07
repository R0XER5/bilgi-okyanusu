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
  // Backend'den gelen yazar bilgilerini kullan
  const author = post.writerFirstName && post.writerLastName ? {
    name: `${post.writerFirstName} ${post.writerLastName}`,
    profileImage: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde' // Varsayılan profil resmi
  } : (post.authorId ? 
    admins.find(admin => admin.id === post.authorId) || users.find(user => user.id === post.userId) :
    users.find(user => user.id === post.userId)
  );

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

  // Post içeriği
  const postContent = (
    <>
      <div className="post-header" style={{ 
        width: '100%',
        maxWidth: '100%'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div className="author-info" style={{ marginBottom: isDetailView ? '16px' : '8px' }}>
              <h3 style={{ 
                fontSize: isDetailView ? '1.1rem' : '14px', 
                fontWeight: '600',
                color: 'var(--gray-color)',
                margin: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                {author?.name || 'Bilinmeyen Yazar'}
                {post.authorId && (
                  <span style={{
                    background: '#dc3545',
                    color: 'white',
                    padding: isDetailView ? '4px 8px' : '2px 6px',
                    borderRadius: isDetailView ? '6px' : '4px',
                    fontSize: isDetailView ? '12px' : '10px',
                    fontWeight: '500'
                  }}>
                    ADMIN
                  </span>
                )}
              </h3>
            </div>
            <h2 style={{ 
              fontSize: isDetailView ? '1.8rem' : '1.25rem',
              fontWeight: '600',
              margin: 0,
              lineHeight: '1.3'
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

      <div className="post-content" style={{
        marginTop: '16px',
        fontSize: isDetailView ? '1.1rem' : '1rem',
        lineHeight: '1.6',
        color: 'var(--text-color)'
      }}>
        {isDetailView ? (
          <div style={{ whiteSpace: 'pre-wrap' }}>{post.content}</div>
        ) : (
          <p style={{
            margin: 0,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            {post.content}
          </p>
        )}
      </div>

      {/* Etiketler */}
      {post.tags && post.tags.length > 0 && (
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px',
          marginTop: '16px'
        }}>
          {post.tags.map((tag, index) => (
            <span key={index} style={{
              background: 'var(--background-color)',
              color: 'var(--primary-color)',
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '0.8rem',
              fontWeight: '500',
              border: '1px solid var(--border-color)'
            }}>
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Post Actions */}
      <div className="post-actions" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '20px',
        paddingTop: '16px',
        borderTop: '1px solid var(--border-light)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          <button
            onClick={handleLike}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: isLiked ? 'var(--primary-color)' : 'var(--gray-color)',
              fontSize: '0.9rem',
              fontWeight: '500',
              padding: '8px 12px',
              borderRadius: '6px',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'var(--background-color)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'none';
            }}
          >
            <span className="material-icons" style={{ fontSize: '18px' }}>
              {isLiked ? 'favorite' : 'favorite_border'}
            </span>
            {likesCount}
          </button>

          <button
            onClick={() => setShowComments(!showComments)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--gray-color)',
              fontSize: '0.9rem',
              fontWeight: '500',
              padding: '8px 12px',
              borderRadius: '6px',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'var(--background-color)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'none';
            }}
          >
            <span className="material-icons" style={{ fontSize: '18px' }}>comment</span>
            {comments.length}
          </button>

          <button
            onClick={handleShare}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--gray-color)',
              fontSize: '0.9rem',
              fontWeight: '500',
              padding: '8px 12px',
              borderRadius: '6px',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'var(--background-color)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'none';
            }}
          >
            <span className="material-icons" style={{ fontSize: '18px' }}>share</span>
            {sharesCount}
          </button>
        </div>

        <div style={{
          fontSize: '0.8rem',
          color: 'var(--gray-color)'
        }}>
          {new Date(post.timestamp).toLocaleDateString('tr-TR', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </div>
      </div>

      {/* Admin Silme Butonu */}
      {onDelete && (
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          marginTop: '16px',
          paddingTop: '16px',
          borderTop: '1px solid var(--border-light)'
        }}>
          <button
            onClick={() => onDelete(post.id)}
            style={{
              background: '#dc3545',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: '500'
            }}
          >
            Yazıyı Sil
          </button>
        </div>
      )}

      {/* Yorumlar Bölümü */}
      {showComments && (
        <div style={{
          marginTop: '24px',
          paddingTop: '24px',
          borderTop: '2px solid var(--border-color)'
        }}>
          <h4 style={{
            fontSize: '1.1rem',
            fontWeight: '600',
            margin: '0 0 16px 0',
            color: 'var(--text-color)'
          }}>
            Yorumlar ({comments.length})
          </h4>

          {/* Yorum Formu */}
          {!showCommentForm ? (
            <button
              onClick={() => setShowCommentForm(true)}
              style={{
                background: 'var(--primary-color)',
                color: 'white',
                border: 'none',
                padding: '12px 20px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: '500',
                marginBottom: '20px'
              }}
            >
              Yorum Yap
            </button>
          ) : (
            <form onSubmit={handleCommentSubmit} style={{
              background: 'var(--background-color)',
              padding: '20px',
              borderRadius: '8px',
              marginBottom: '20px',
              border: '1px solid var(--border-color)'
            }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '12px',
                marginBottom: '16px'
              }}>
                <input
                  type="text"
                  placeholder="Adınız *"
                  value={commentForm.name}
                  onChange={(e) => setCommentForm(prev => ({ ...prev, name: e.target.value }))}
                  required
                  style={{
                    padding: '10px 12px',
                    border: '1px solid var(--border-color)',
                    borderRadius: '6px',
                    fontSize: '0.9rem'
                  }}
                />
                <input
                  type="email"
                  placeholder="E-posta"
                  value={commentForm.email}
                  onChange={(e) => setCommentForm(prev => ({ ...prev, email: e.target.value }))}
                  style={{
                    padding: '10px 12px',
                    border: '1px solid var(--border-color)',
                    borderRadius: '6px',
                    fontSize: '0.9rem'
                  }}
                />
              </div>
              <input
                type="url"
                placeholder="Website (opsiyonel)"
                value={commentForm.website}
                onChange={(e) => setCommentForm(prev => ({ ...prev, website: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid var(--border-color)',
                  borderRadius: '6px',
                  fontSize: '0.9rem',
                  marginBottom: '16px'
                }}
              />
              <textarea
                placeholder="Yorumunuz *"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                required
                rows="4"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid var(--border-color)',
                  borderRadius: '6px',
                  fontSize: '0.9rem',
                  resize: 'vertical',
                  marginBottom: '16px'
                }}
              />
              <div style={{
                display: 'flex',
                gap: '12px',
                justifyContent: 'flex-end'
              }}>
                <button
                  type="button"
                  onClick={() => setShowCommentForm(false)}
                  style={{
                    padding: '10px 20px',
                    border: '1px solid var(--border-color)',
                    background: 'white',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.9rem'
                  }}
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingComment}
                  style={{
                    padding: '10px 20px',
                    background: 'var(--primary-color)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: isSubmittingComment ? 'not-allowed' : 'pointer',
                    fontSize: '0.9rem',
                    opacity: isSubmittingComment ? 0.7 : 1
                  }}
                >
                  {isSubmittingComment ? 'Gönderiliyor...' : 'Yorum Gönder'}
                </button>
              </div>
            </form>
          )}

          {/* Yorumlar Listesi */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {comments.length > 0 ? (
              comments.map(comment => (
                <div key={comment.id} style={{
                  background: 'var(--background-color)',
                  padding: '16px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-light)'
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
    </>
  );

  return (
    <div className="card post" style={{
      width: '100%',
      maxWidth: '100%',
      overflow: 'hidden',
      borderRadius: 0,
      border: '2px solid var(--border-color)',
      cursor: !isDetailView ? 'pointer' : 'default',
      transition: !isDetailView ? 'all 0.2s ease' : 'none'
    }}
    onMouseEnter={!isDetailView ? (e) => {
      e.currentTarget.style.transform = 'translateY(-2px)';
      e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
    } : undefined}
    onMouseLeave={!isDetailView ? (e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.1)';
    } : undefined}
    >
      {!isDetailView ? (
        <Link to={`/post/${post.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
          {postContent}
        </Link>
      ) : (
        <div style={{ padding: '24px' }}>
          {postContent}
        </div>
      )}
    </div>
  );
};

export default Post; 