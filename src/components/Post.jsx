import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { users } from '../data/dummyData';
import ReportModal from './ReportModal';
import analyzeReport from '../services/reportAnalyzer';

const Post = ({ post, currentUser, isDetailView, onDelete }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [newReply, setNewReply] = useState('');
  const [showReplies, setShowReplies] = useState({});
  const [showReportModal, setShowReportModal] = useState(false);
  const [isReporting, setIsReporting] = useState(false);
  const author = users.find(user => user.id === post.userId);

  const handleLike = () => {
    if (isLiked) {
      setLikesCount(prev => prev - 1);
    } else {
      setLikesCount(prev => prev + 1);
    }
    setIsLiked(!isLiked);
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const comment = {
      id: post.comments.length + 1,
      userId: currentUser.id,
      content: newComment,
      timestamp: new Date().toISOString(),
      replies: []
    };

    post.comments.push(comment);
    setNewComment('');
  };

  const handleAddReply = (e, commentId) => {
    e.preventDefault();
    if (!newReply.trim()) return;

    const reply = {
      id: Date.now(),
      userId: currentUser.id,
      content: newReply,
      timestamp: new Date().toISOString()
    };

    const comment = post.comments.find(c => c.id === commentId);
    if (!comment.replies) comment.replies = [];
    comment.replies.push(reply);
    
    setNewReply('');
    setReplyingTo(null);
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const toggleReplies = (commentId) => {
    setShowReplies(prev => ({
      ...prev,
      [commentId]: !prev[commentId]
    }));
  };

  const handleReport = async (reportData) => {
    setIsReporting(true);
    try {
      const analysis = await analyzeReport(reportData, post.content);
      
      if (analysis.accepted === true && analysis.confidence > 0.8) {
        // Rapor kabul edildi ve güven skoru yüksek
        if (onDelete) {
          onDelete(post.id);
        }
        alert('Raporunuz değerlendirildi ve içerik kaldırıldı.');
      } else if (analysis.accepted === null) {
        alert('Raporunuz manuel incelemeye alındı.');
      } else {
        alert('Raporunuz değerlendirildi fakat içerik politikalarımızı ihlal etmiyor.');
      }
    } catch (error) {
      console.error('Rapor işlenirken hata:', error);
      alert('Rapor işlenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
    } finally {
      setIsReporting(false);
    }
  };

  return (
    <>
      <div className="card post">
        <div className="post-header" style={{ cursor: !isDetailView ? 'pointer' : 'default' }}>
          {!isDetailView ? (
            <Link to={`/post/${post.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
              <div className="author-info" style={{ marginBottom: '8px' }}>
                <Link to={`/profile/${author.id}`} style={{ 
                  textDecoration: 'none', 
                  color: 'var(--gray-color)',
                  fontWeight: '600'
                }}>
                  <h3 style={{ 
                    fontSize: '14px', 
                    fontWeight: '600',
                    color: 'var(--gray-color)'
                  }}>{author.name}</h3>
                </Link>
              </div>
              <h2 style={{ 
                fontSize: '1.25rem',
                fontWeight: '600',
                margin: 0
              }}>{post.title}</h2>
            </Link>
          ) : (
            <div>
              <div className="author-info" style={{ marginBottom: '16px' }}>
                <Link to={`/profile/${author.id}`} style={{ 
                  textDecoration: 'none', 
                  color: 'var(--gray-color)',
                  fontWeight: '600'
                }}>
                  <h3 style={{ 
                    fontSize: '1.1rem', 
                    fontWeight: '600',
                    color: 'var(--gray-color)',
                    margin: 0
                  }}>{author.name}</h3>
                </Link>
              </div>
              <h2 style={{ 
                fontSize: '2rem', 
                fontWeight: '700',
                margin: 0,
                marginBottom: '24px'
              }}>{post.title}</h2>
            </div>
          )}
        </div>

        <div className="post-content" style={{ 
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          minHeight: isDetailView ? '300px' : 'auto'
        }}>
          <p style={{ 
            fontSize: '1.1rem', 
            lineHeight: '1.8',
            flex: 1
          }}>{post.content}</p>

          {post.tags && post.tags.length > 0 && (
            <div style={{ 
              display: 'flex', 
              gap: '8px', 
              flexWrap: 'wrap'
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
            <div className="post-actions">
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
                  color: isLiked ? 'var(--primary-color)' : 'var(--gray-color)'
                }}
              >
                <span className="material-icons">
                  {isLiked ? 'thumb_up' : 'thumb_up_off_alt'}
                </span>
                {likesCount}
              </button>
              <div 
                className="action-button"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  color: 'var(--gray-color)'
                }}
              >
                <span className="material-icons">comment</span>
                {post.comments.length}
              </div>
              <button
                onClick={() => setShowReportModal(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--gray-color)'
                }}
                disabled={isReporting}
              >
                <span className="material-icons">flag</span>
                Raporla
              </button>
            </div>

            <span style={{ 
              fontSize: '0.9rem', 
              color: 'var(--gray-color)'
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
        </div>

        {(isDetailView || showComments) && (
          <div className="comments-section" style={{ marginTop: '16px' }}>
            <form onSubmit={handleAddComment} style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Yorum yaz..."
                  className="input-field"
                  style={{ 
                    margin: 0,
                    color: '#000000'
                  }}
                />
                <button type="submit" className="btn btn-primary">
                  Gönder
                </button>
              </div>
            </form>

            <div className="comments-list">
              {post.comments.map(comment => {
                const commentAuthor = users.find(user => user.id === comment.userId);
                const hasReplies = comment.replies && comment.replies.length > 0;
                
                return (
                  <div key={comment.id}>
                    <div className="comment" style={{ 
                      marginBottom: '12px',
                      padding: '12px',
                      backgroundColor: 'var(--background-color)',
                      borderRadius: '4px'
                    }}>
                      <div style={{ marginBottom: '4px' }}>
                        <Link to={`/profile/${commentAuthor.id}`} style={{ 
                          textDecoration: 'none', 
                          color: 'inherit',
                          fontWeight: '600'
                        }}>
                          <strong>{commentAuthor.name}</strong>
                        </Link>
                        <small style={{ marginLeft: '8px', color: 'var(--gray-color)' }}>
                          {formatDate(comment.timestamp)}
                        </small>
                      </div>
                      <p style={{ marginBottom: '8px' }}>{comment.content}</p>
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <button
                          onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--primary-color)',
                            cursor: 'pointer',
                            fontSize: '0.9rem',
                            padding: 0
                          }}
                        >
                          Yanıtla
                        </button>
                        {hasReplies && (
                          <button
                            onClick={() => toggleReplies(comment.id)}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: 'var(--primary-color)',
                              cursor: 'pointer',
                              fontSize: '0.9rem',
                              padding: 0,
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            <span className="material-icons" style={{ fontSize: '16px' }}>
                              {showReplies[comment.id] ? 'expand_less' : 'expand_more'}
                            </span>
                            {showReplies[comment.id] ? 'Yanıtları Gizle' : `${comment.replies.length} yanıtı göster`}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Yanıt formu */}
                    {replyingTo === comment.id && (
                      <form 
                        onSubmit={(e) => handleAddReply(e, comment.id)}
                        style={{ 
                          marginBottom: '12px',
                          marginLeft: '24px'
                        }}
                      >
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <input
                            type="text"
                            value={newReply}
                            onChange={(e) => setNewReply(e.target.value)}
                            placeholder="Yanıt yaz..."
                            className="input-field"
                            style={{ 
                              margin: 0,
                              color: '#000000'
                            }}
                          />
                          <button type="submit" className="btn btn-primary">
                            Yanıtla
                          </button>
                        </div>
                      </form>
                    )}

                    {/* Yanıtları göster */}
                    {hasReplies && showReplies[comment.id] && (
                      <div style={{ marginLeft: '24px' }}>
                        {comment.replies.map(reply => {
                          const replyAuthor = users.find(user => user.id === reply.userId);
                          return (
                            <div 
                              key={reply.id} 
                              className="comment"
                              style={{ 
                                marginBottom: '8px',
                                padding: '12px',
                                backgroundColor: 'var(--background-color)',
                                borderRadius: '4px'
                              }}
                            >
                              <div style={{ marginBottom: '4px' }}>
                                <Link to={`/profile/${replyAuthor.id}`} style={{ 
                                  textDecoration: 'none', 
                                  color: 'inherit',
                                  fontWeight: '600'
                                }}>
                                  <strong>{replyAuthor.name}</strong>
                                </Link>
                                <small style={{ marginLeft: '8px', color: 'var(--gray-color)' }}>
                                  {formatDate(reply.timestamp)}
                                </small>
                              </div>
                              <p>{reply.content}</p>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {showReportModal && (
        <ReportModal
          type="post"
          onClose={() => setShowReportModal(false)}
          onSubmit={handleReport}
        />
      )}
    </>
  );
};

export default Post; 