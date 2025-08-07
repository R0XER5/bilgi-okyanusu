import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { posts, users, comments, siteStats } from '../data/dummyData';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('posts');
  const [postsList, setPostsList] = useState([...posts]);
  const [commentsList, setCommentsList] = useState([...comments]);
  const [showPostOptions, setShowPostOptions] = useState(null);
  const [showCommentOptions, setShowCommentOptions] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [editForm, setEditForm] = useState({
    title: '',
    content: '',
    tags: ''
  });
  // Toplu seçim için state'ler
  const [selectedPosts, setSelectedPosts] = useState([]);
  const [selectedComments, setSelectedComments] = useState([]);
  const [showPostSelection, setShowPostSelection] = useState(false);
  const [showCommentSelection, setShowCommentSelection] = useState(false);

  const stats = {
    totalPosts: postsList.length,
    totalUsers: users.length,
    totalComments: commentsList.length,
    totalShares: postsList.reduce((sum, post) => sum + (post.shares || 0), 0),
    totalViews: postsList.reduce((sum, post) => sum + (post.views || 0), 0),
    totalLikes: postsList.reduce((sum, post) => sum + (post.likes || 0), 0),
    totalTags: postsList.reduce((sum, post) => sum + (post.tags ? post.tags.length : 0), 0)
  };

  const handleDeletePost = (postId) => {
    if (window.confirm('Bu gönderiyi silmek istediğinizden emin misiniz?')) {
      setPostsList(prevPosts => prevPosts.filter(post => post.id !== postId));
      // Aynı zamanda global posts array'ini de güncelle
      const postIndex = posts.findIndex(post => post.id === postId);
      if (postIndex !== -1) {
        posts.splice(postIndex, 1);
      }
      setShowPostOptions(null);
      setSelectedPosts(selectedPosts.filter(id => id !== postId));
    }
  };

  // Toplu gönderi silme
  const handleBulkDeletePosts = () => {
    if (selectedPosts.length === 0) return;
    if (window.confirm('Seçili gönderileri silmek istediğinizden emin misiniz?')) {
      setPostsList(prevPosts => prevPosts.filter(post => !selectedPosts.includes(post.id)));
      selectedPosts.forEach(postId => {
        const postIndex = posts.findIndex(post => post.id === postId);
        if (postIndex !== -1) {
          posts.splice(postIndex, 1);
        }
      });
      setSelectedPosts([]);
    }
  };

  const handleDeleteComment = (commentId) => {
    if (window.confirm('Bu yorumu silmek istediğinizden emin misiniz?')) {
      setCommentsList(prevComments => prevComments.filter(comment => comment.id !== commentId));
      // Aynı zamanda global comments array'ini de güncelle
      const commentIndex = comments.findIndex(comment => comment.id === commentId);
      if (commentIndex !== -1) {
        comments.splice(commentIndex, 1);
      }
      setShowCommentOptions(null);
      setSelectedComments(selectedComments.filter(id => id !== commentId));
    }
  };

  // Toplu yorum silme
  const handleBulkDeleteComments = () => {
    if (selectedComments.length === 0) return;
    if (window.confirm('Seçili yorumları silmek istediğinizden emin misiniz?')) {
      setCommentsList(prevComments => prevComments.filter(comment => !selectedComments.includes(comment.id)));
      selectedComments.forEach(commentId => {
        const commentIndex = comments.findIndex(comment => comment.id === commentId);
        if (commentIndex !== -1) {
          comments.splice(commentIndex, 1);
        }
      });
      setSelectedComments([]);
    }
  };

  const handleEditPost = (post) => {
    setEditingPost(post);
    setEditForm({
      title: post.title,
      content: post.content,
      tags: post.tags ? post.tags.join(' ') : ''
    });
    setShowEditModal(true);
    setShowPostOptions(null);
  };

  const handleSaveEdit = () => {
    if (!editForm.title.trim() || !editForm.content.trim()) {
      alert('Başlık ve içerik alanları zorunludur!');
      return;
    }

    // Etiketleri işle
    const processedTags = editForm.tags
      .split(/[	\s,]+/)
      .filter(tag => tag.trim())
      .map(tag => {
        const trimmedTag = tag.trim();
        return trimmedTag.startsWith('#') ? trimmedTag : `#${trimmedTag}`;
      });

    // Post'u güncelle
    const updatedPost = {
      ...editingPost,
      title: editForm.title.trim(),
      content: editForm.content.trim(),
      tags: processedTags
    };

    // Local state'i güncelle
    setPostsList(prevPosts => 
      prevPosts.map(post => 
        post.id === editingPost.id ? updatedPost : post
      )
    );

    // Global posts array'ini güncelle
    const postIndex = posts.findIndex(post => post.id === editingPost.id);
    if (postIndex !== -1) {
      posts[postIndex] = updatedPost;
    }

    setShowEditModal(false);
    setEditingPost(null);
    setEditForm({ title: '', content: '', tags: '' });
  };

  return (
    <div className="container" style={{ 
      marginTop: '72px',
      padding: '24px 0',
      maxWidth: 'var(--max-width)',
      display: 'grid',
      gridTemplateColumns: '250px 1fr 250px',
      gap: '24px',
      width: '100%'
    }}>
      {/* Sol Sidebar */}
      <div style={{ width: '100%' }}>
        <div className="card">
          <h3 style={{ 
            fontSize: '1.2rem',
            fontWeight: '600',
            marginBottom: '16px',
            color: 'var(--text-color)'
          }}>
            Hızlı İstatistikler
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{
              padding: '16px',
              background: 'var(--background-color)',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '1.8rem', fontWeight: '700', color: 'var(--primary-color)' }}>
                {stats.totalPosts}
              </div>
              <div style={{ color: 'var(--gray-color)', fontSize: '0.9rem' }}>Gönderi</div>
            </div>
            
            <div style={{
              padding: '16px',
              background: 'var(--background-color)',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '1.8rem', fontWeight: '700', color: 'var(--primary-color)' }}>
                {stats.totalComments}
              </div>
              <div style={{ color: 'var(--gray-color)', fontSize: '0.9rem' }}>Yorum</div>
            </div>
            
            <div style={{
              padding: '16px',
              background: 'var(--background-color)',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '1.8rem', fontWeight: '700', color: 'var(--primary-color)' }}>
                {stats.totalShares}
              </div>
              <div style={{ color: 'var(--gray-color)', fontSize: '0.9rem' }}>Paylaşım</div>
            </div>
          </div>

          {/* Gündem Butonu */}
          <div style={{ marginTop: '24px' }}>
            <Link 
              to="/trending" 
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '16px',
                background: 'var(--primary-color)',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '600',
                transition: 'all 0.2s ease',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'var(--secondary-color)';
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'var(--primary-color)';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
              }}
            >
              <span className="material-icons" style={{ fontSize: '20px' }}>trending_up</span>
              Gündem Sayfasına Git
            </Link>
          </div>
        </div>
      </div>
      
      {/* Ana İçerik */}
      <div style={{ width: '100%' }}>
      <div className="card">
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

          {/* Sekmeler */}
          <div style={{
            display: 'flex',
            borderBottom: '1px solid var(--border-color)',
            marginBottom: '24px'
          }}>
            <button
              onClick={() => setActiveTab('posts')}
              style={{
                padding: '12px 24px',
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '500',
                color: activeTab === 'posts' ? 'var(--primary-color)' : 'var(--gray-color)',
                borderBottom: activeTab === 'posts' ? '2px solid var(--primary-color)' : 'none',
                transition: 'all 0.2s ease'
              }}
            >
              Gönderiler
            </button>
            <button
              onClick={() => setActiveTab('comments')}
              style={{
                padding: '12px 24px',
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '500',
                color: activeTab === 'comments' ? 'var(--primary-color)' : 'var(--gray-color)',
                borderBottom: activeTab === 'comments' ? '2px solid var(--primary-color)' : 'none',
                transition: 'all 0.2s ease'
              }}
            >
              Yorumlar
            </button>
          </div>

          {/* İçerik Alanı */}
              <div style={{
            width: '100%',
            minHeight: '400px'
          }}>
          {activeTab === 'posts' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
              <h2 style={{ 
                fontSize: '1.5rem',
                fontWeight: '600',
                marginBottom: '24px'
              }}>
                Gönderiler
              </h2>
              {/* Toplu Sil Butonu */}
              {showPostSelection && (
                <div style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <input
                    type="checkbox"
                    checked={selectedPosts.length === postsList.length && postsList.length > 0}
                    onChange={e => {
                      if (e.target.checked) {
                        setSelectedPosts(postsList.map(post => post.id));
                      } else {
                        setSelectedPosts([]);
                      }
                    }}
                    style={{ width: '22px', height: '22px', transform: 'scale(1.3)', cursor: 'pointer' }}
                  />
                  <span>Tümünü Seç</span>
                  <button
                    onClick={handleBulkDeletePosts}
                    disabled={selectedPosts.length === 0}
                    style={{
                      padding: '6px 16px',
                      borderRadius: '6px',
                      border: '1px solid #dc3545',
                      background: '#dc3545',
                      color: 'white',
                      cursor: selectedPosts.length === 0 ? 'not-allowed' : 'pointer',
                      fontSize: '0.95rem',
                      fontWeight: '500',
                      marginLeft: '8px'
                    }}
                  >
                    Toplu Sil
                  </button>
                </div>
              )}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
                  {postsList.map(post => {
                  const author = users.find(user => user.id === post.userId);
                  return (
                    <div 
                      key={post.id}
                      className="card"
                      style={{
                        padding: '20px',
                        background: 'var(--background-color)',
                          border: '1px solid var(--border-color)',
                          width: '100%',
                          position: 'relative'
                      }}
                    >
                      {/* Seçenekler Butonu */}
                      <div style={{ position: 'absolute', top: '12px', right: '12px', zIndex: 10 }}>
                        <button
                          onClick={() => setShowPostOptions(showPostOptions === post.id ? null : post.id)}
                          style={{
                            background: 'var(--gray-color)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '10px',
                            width: '32px',
                            height: '32px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '16px'
                          }}
                          title="Seçenekler"
                        >
                          <span className="material-icons" style={{ fontSize: '18px' }}>more_vert</span>
                        </button>
                        
                        {/* Seçenekler Menüsü */}
                        {showPostOptions === post.id && (
                          <div style={{
                            position: 'absolute',
                            top: '40px',
                            right: '0',
                            background: 'white',
                            border: '1px solid var(--border-color)',
                            borderRadius: '8px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                            minWidth: '120px',
                            zIndex: 20
                          }}>
                            <button
                              onClick={() => setShowPostSelection(!showPostSelection)}
                              style={{
                                width: '100%',
                                padding: '8px 12px',
                                border: 'none',
                                background: 'none',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                color: 'var(--primary-color)',
                                fontSize: '0.9rem'
                              }}
                            >
                              <span className="material-icons" style={{ fontSize: '16px' }}>check_box</span>
                              {showPostSelection ? 'Seçimi Kapat' : 'Seç'}
                            </button>
                            <button
                              onClick={() => handleEditPost(post)}
                              style={{
                                width: '100%',
                                padding: '8px 12px',
                                border: 'none',
                                background: 'none',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                color: 'var(--primary-color)',
                                fontSize: '0.9rem'
                              }}
                            >
                              <span className="material-icons" style={{ fontSize: '16px' }}>edit</span>
                              Düzenle
                            </button>
                            <button
                              onClick={() => handleDeletePost(post.id)}
                              style={{
                                width: '100%',
                                padding: '8px 12px',
                                border: 'none',
                                background: 'none',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                color: '#dc3545',
                                fontSize: '0.9rem'
                              }}
                            >
                              <span className="material-icons" style={{ fontSize: '16px' }}>delete</span>
                              Sil
                            </button>
                          </div>
                        )}
                      </div>

                      <div style={{ 
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        marginBottom: '12px'
                      }}>
                        <div>
                          <h3 style={{ 
                            fontSize: '1.2rem',
                            fontWeight: '600',
                            marginBottom: '8px'
                          }}>
                            {post.title}
                          </h3>
                          <p style={{ 
                            color: 'var(--gray-color)',
                            fontSize: '0.9rem',
                            marginBottom: '4px'
                          }}>
                            Yazar: {author.name}
                          </p>
                          <p style={{ 
                            color: 'var(--gray-color)',
                            fontSize: '0.9rem'
                          }}>
                            Tarih: {new Date(post.timestamp).toLocaleDateString('tr-TR')}
                          </p>
                        </div>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '16px',
                          fontSize: '0.9rem',
                            color: 'var(--gray-color)',
                            marginRight: '50px'
                        }}>
                          {/* Checkbox görüntülemenin solunda */}
                          {showPostSelection && (
                            <input
                              type="checkbox"
                              checked={selectedPosts.includes(post.id)}
                              onChange={e => {
                                if (e.target.checked) {
                                  setSelectedPosts([...selectedPosts, post.id]);
                                } else {
                                  setSelectedPosts(selectedPosts.filter(id => id !== post.id));
                                }
                              }}
                              style={{ width: '22px', height: '22px', transform: 'scale(1.3)', marginRight: '8px', cursor: 'pointer' }}
                            />
                          )}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <span className="material-icons" style={{ fontSize: '16px' }}>visibility</span>
                            {post.views || 0}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <span className="material-icons" style={{ fontSize: '16px' }}>thumb_up</span>
                            {post.likes || 0}
                          </div>
                        </div>
                      </div>
                      
                      <p style={{
                        fontSize: '0.9rem',
                        lineHeight: '1.5',
                        marginBottom: '12px'
                      }}>
                        {post.content.length > 200 ? `${post.content.slice(0, 200)}...` : post.content}
                      </p>
                      
                      {post.tags && post.tags.length > 0 && (
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          {post.tags.map((tag, index) => (
                            <span 
                              key={index}
                              style={{
                                background: 'var(--primary-color)',
                                color: 'white',
                                padding: '4px 8px',
                                borderRadius: '12px',
                                fontSize: '0.8rem'
                              }}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

            {activeTab === 'comments' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
              <h2 style={{ 
                fontSize: '1.5rem',
                fontWeight: '600',
                marginBottom: '24px'
              }}>
                  Yorumlar
              </h2>
              {/* Toplu Sil Butonu */}
              {showCommentSelection && (
                <div style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <input
                    type="checkbox"
                    checked={selectedComments.length === commentsList.length && commentsList.length > 0}
                    onChange={e => {
                      if (e.target.checked) {
                        setSelectedComments(commentsList.map(comment => comment.id));
                      } else {
                        setSelectedComments([]);
                      }
                    }}
                    style={{ width: '22px', height: '22px', transform: 'scale(1.3)', cursor: 'pointer' }}
                  />
                  <span>Tümünü Seç</span>
                  <button
                    onClick={handleBulkDeleteComments}
                    disabled={selectedComments.length === 0}
                    style={{
                      padding: '6px 16px',
                      borderRadius: '6px',
                      border: '1px solid #dc3545',
                      background: '#dc3545',
                      color: 'white',
                      cursor: selectedComments.length === 0 ? 'not-allowed' : 'pointer',
                      fontSize: '0.95rem',
                      fontWeight: '500',
                      marginLeft: '8px'
                    }}
                  >
                    Toplu Sil
                  </button>
                </div>
              )}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
                  {commentsList.map(comment => {
                    const commentPost = postsList.find(post => post.id === comment.postId);
                    return (
                  <div 
                        key={comment.id}
                    className="card"
                    style={{
                      padding: '20px',
                      background: 'var(--background-color)',
                          border: '1px solid var(--border-color)',
                          width: '100%',
                          position: 'relative'
                    }}
                  >

                        {/* Seçenekler Butonu */}
                        <div style={{ position: 'absolute', top: '12px', right: '12px', zIndex: 10 }}>
                          <button
                            onClick={() => setShowCommentOptions(showCommentOptions === comment.id ? null : comment.id)}
                            style={{
                              background: 'var(--gray-color)',
                              color: 'white',
                              border: 'none',
                              borderRadius: '10px',
                              width: '32px',
                              height: '32px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '16px'
                            }}
                            title="Seçenekler"
                          >
                            <span className="material-icons" style={{ fontSize: '18px' }}>more_vert</span>
                          </button>
                          
                          {/* Seçenekler Menüsü */}
                          {showCommentOptions === comment.id && (
                            <div style={{
                              position: 'absolute',
                              top: '40px',
                              right: '0',
                              background: 'white',
                              border: '1px solid var(--border-color)',
                              borderRadius: '8px',
                              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                              minWidth: '120px',
                              zIndex: 20
                            }}>
                              <button
                                onClick={() => setShowCommentSelection(!showCommentSelection)}
                                style={{
                                  width: '100%',
                                  padding: '8px 12px',
                                  border: 'none',
                                  background: 'none',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '8px',
                                  color: 'var(--primary-color)',
                                  fontSize: '0.9rem'
                                }}
                              >
                                <span className="material-icons" style={{ fontSize: '16px' }}>check_box</span>
                                {showCommentSelection ? 'Seçimi Kapat' : 'Seç'}
                              </button>
                              <button
                                onClick={() => handleDeleteComment(comment.id)}
                                style={{
                                  width: '100%',
                                  padding: '8px 12px',
                                  border: 'none',
                                  background: 'none',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '8px',
                                  color: '#dc3545',
                                  fontSize: '0.9rem'
                                }}
                              >
                                <span className="material-icons" style={{ fontSize: '16px' }}>delete</span>
                                Sil
                              </button>
                            </div>
                          )}
                        </div>

                    <div style={{ 
                      display: 'flex',
                      justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          marginBottom: '12px'
                    }}>
                      <div>
                        <h3 style={{ 
                              fontSize: '1.1rem',
                          fontWeight: '600',
                          marginBottom: '8px'
                        }}>
                              {comment.authorName}
                        </h3>
                            {comment.authorEmail && (
                              <p style={{ 
                                color: 'var(--gray-color)',
                                fontSize: '0.9rem',
                                marginBottom: '4px'
                              }}>
                                {comment.authorEmail}
                              </p>
                            )}
                            {comment.authorWebsite && (
                        <p style={{ 
                          color: 'var(--gray-color)',
                          fontSize: '0.9rem',
                          marginBottom: '4px'
                        }}>
                                Website: {comment.authorWebsite}
                        </p>
                            )}
                        <p style={{ 
                          color: 'var(--gray-color)',
                          fontSize: '0.9rem',
                          marginBottom: '8px'
                        }}>
                              Gönderi: {commentPost?.title || 'Silinmiş Gönderi'}
                        </p>
                          <p style={{
                              color: 'var(--gray-color)',
                              fontSize: '0.9rem'
                          }}>
                              Tarih: {new Date(comment.timestamp).toLocaleDateString('tr-TR')}
                          </p>
                      </div>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        fontSize: '0.9rem',
                            color: 'var(--gray-color)',
                            marginRight: '50px'
                      }}>
                        {/* Checkbox görüntülemenin solunda */}
                        {showCommentSelection && (
                          <input
                            type="checkbox"
                            checked={selectedComments.includes(comment.id)}
                            onChange={e => {
                              if (e.target.checked) {
                                setSelectedComments([...selectedComments, comment.id]);
                              } else {
                                setSelectedComments(selectedComments.filter(id => id !== comment.id));
                              }
                            }}
                            style={{ width: '22px', height: '22px', transform: 'scale(1.3)', marginRight: '8px', cursor: 'pointer' }}
                          />
                        )}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <span className="material-icons" style={{ fontSize: '16px' }}>thumb_up</span>
                              {comment.likes || 0}
                            </div>
                        </div>
                        </div>
                        
                        <p style={{
                          fontSize: '0.9rem',
                          lineHeight: '1.5',
                          padding: '12px',
                          background: 'var(--surface-color)',
                          borderRadius: '8px',
                          border: '1px solid var(--border-color)'
                        }}>
                          {comment.content}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
                      </div>
                    </div>
                  </div>

      {/* Sağ Sidebar */}
      <div style={{ width: '100%' }}>
        <div className="card">
          <h3 style={{ 
            fontSize: '1.2rem',
            fontWeight: '600',
            marginBottom: '16px',
            color: 'var(--text-color)'
          }}>
            Hızlı İstatistikler
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{
              padding: '16px',
              background: 'var(--background-color)',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '1.8rem', fontWeight: '700', color: 'var(--primary-color)' }}>
                {stats.totalViews}
              </div>
              <div style={{ color: 'var(--gray-color)', fontSize: '0.9rem' }}>Görüntüleme</div>
            </div>
            
            <div style={{
              padding: '16px',
              background: 'var(--background-color)',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '1.8rem', fontWeight: '700', color: 'var(--primary-color)' }}>
                {stats.totalLikes}
              </div>
              <div style={{ color: 'var(--gray-color)', fontSize: '0.9rem' }}>Beğeni</div>
            </div>
            
            <div style={{
              padding: '16px',
              background: 'var(--background-color)',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '1.8rem', fontWeight: '700', color: 'var(--primary-color)' }}>
                {stats.totalTags}
              </div>
              <div style={{ color: 'var(--gray-color)', fontSize: '0.9rem' }}>Etiket</div>
            </div>
          </div>
        </div>
      </div>

      {/* Düzenleme Modal */}
      {showEditModal && (
        <div 
          className="modal-overlay" 
          onClick={() => setShowEditModal(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}
        >
          <div 
            className="modal-content" 
            onClick={e => e.stopPropagation()}
            style={{
              background: 'white',
              borderRadius: '12px',
              padding: '32px',
              maxWidth: '600px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px'
            }}>
              <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '600', color: 'black' }}>
                Gönderiyi Düzenle
              </h2>
              <button
                onClick={() => setShowEditModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '8px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <span className="material-icons">close</span>
              </button>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleSaveEdit(); }}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  color: 'var(--gray-color)',
                  fontSize: '0.9rem'
                }}>
                  Başlık *
                </label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Gönderi başlığını girin"
                  required
                  maxLength={100}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    fontSize: '1rem',
                    boxSizing: 'border-box',
                    color: 'black'
                  }}
                />
                <div style={{
                  textAlign: 'right',
                  fontSize: '0.8rem',
                  color: 'var(--gray-color)',
                  marginTop: '4px'
                }}>
                  {editForm.title.length}/100 karakter
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  color: 'var(--gray-color)',
                  fontSize: '0.9rem'
                }}>
                  İçerik *
                </label>
                <textarea
                  value={editForm.content}
                  onChange={(e) => setEditForm(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Gönderi içeriğini girin..."
                  required
                  maxLength={5000}
                  style={{
                    width: '100%',
                    minHeight: '200px',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    fontSize: '1rem',
                    resize: 'vertical',
                    boxSizing: 'border-box',
                    color: 'black'
                  }}
                />
                <div style={{
                  textAlign: 'right',
                  fontSize: '0.8rem',
                  color: 'var(--gray-color)',
                  marginTop: '4px'
                }}>
                  {editForm.content.length}/5000 karakter
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  color: 'var(--gray-color)',
                  fontSize: '0.9rem'
                }}>
                  Etiketler (İsteğe bağlı)
                </label>
                <input
                  type="text"
                  value={editForm.tags}
                  onChange={(e) => setEditForm(prev => ({ ...prev, tags: e.target.value }))}
                  placeholder="Etiketler (#teknoloji #yazılım gibi)"
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    fontSize: '1rem',
                    boxSizing: 'border-box',
                    color: 'black'
                  }}
                />
                <div style={{
                  fontSize: '0.8rem',
                  color: 'var(--gray-color)',
                  marginTop: '4px'
                }}>
                  Etiketleri boşluk veya virgülle ayırın
                </div>
              </div>

              <div style={{
                display: 'flex',
                gap: '12px',
                justifyContent: 'flex-end'
              }}>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  style={{
                    padding: '12px 24px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    background: 'white',
                    color: 'var(--gray-color)',
                    cursor: 'pointer',
                    fontSize: '1rem'
                  }}
                >
                  İptal
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '12px 24px',
                    borderRadius: '8px',
                    border: 'none',
                    background: 'var(--primary-color)',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <span className="material-icons" style={{ fontSize: '20px' }}>save</span>
                  Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel; 