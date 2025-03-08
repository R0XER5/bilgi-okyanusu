import React, { useState } from 'react';
import Post from '../components/Post';
import TrendingPosts from '../components/TrendingPosts';
import RecommendedPosts from '../components/RecommendedPosts';
import { posts, users } from '../data/dummyData';

const Feed = ({ currentUser }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostTags, setNewPostTags] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreatePost = (e) => {
    e.preventDefault();
    if (!newPostContent.trim() || !newPostTitle.trim()) return;

    // Etiketleri işle
    const tags = newPostTags
      .split(' ')
      .filter(tag => tag.startsWith('#'))
      .map(tag => tag.trim());

    const newPost = {
      id: posts.length + 1,
      userId: currentUser.id,
      title: newPostTitle,
      content: newPostContent,
      tags: tags,
      timestamp: new Date().toISOString(),
      likes: 0,
      comments: []
    };

    posts.unshift(newPost);
    setNewPostContent('');
    setNewPostTitle('');
    setNewPostTags('');
    setIsModalOpen(false);
  };

  const filteredPosts = posts.filter(post => {
    const author = users.find(user => user.id === post.userId);
    const searchLower = searchQuery.toLowerCase();
    
    return (
      post.content.toLowerCase().includes(searchLower) ||
      author.name.toLowerCase().includes(searchLower) ||
      (post.title && post.title.toLowerCase().includes(searchLower)) ||
      (post.tags && post.tags.some(tag => tag.toLowerCase().includes(searchLower)))
    );
  });

  return (
    <>
      <div className="container feed-container">
        {/* Sol Sidebar */}
        <div className="left-sidebar">
          <RecommendedPosts currentUser={currentUser} isHomePage={true} />
        </div>
        
        {/* Ana İçerik */}
        <div className="main-content">
          {/* Arama Alanı */}
          <div className="card search-card">
            <div className="search-container" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              width: '100%'
            }}>
              <span className="material-icons" style={{ color: 'var(--gray-color)' }}>search</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Gönderilerde ara (başlık, içerik, etiket)..."
                className="input-field"
                style={{ margin: 0 }}
              />
            </div>
          </div>

          {/* Gönderiler */}
          <div className="posts">
            {filteredPosts.map(post => (
              <Post key={post.id} post={post} currentUser={currentUser} />
            ))}
          </div>
        </div>

        {/* Sağ Sidebar */}
        <div className="right-sidebar">
          <TrendingPosts />
        </div>
      </div>

      {/* Paylaşım Butonu */}
      <button 
        className="floating-action-button"
        onClick={() => setIsModalOpen(true)}
        title="Gönderi Paylaş"
      >
        <span className="material-icons">add</span>
      </button>

      {/* Paylaşım Modalı */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button 
              className="modal-close"
              onClick={() => setIsModalOpen(false)}
            >
              <span className="material-icons">close</span>
            </button>
            <h2 style={{ marginBottom: '20px' }}>Gönderi Oluştur</h2>
            <form onSubmit={handleCreatePost}>
              <input
                type="text"
                value={newPostTitle}
                onChange={(e) => setNewPostTitle(e.target.value)}
                placeholder="Başlık"
                className="input-field"
                required
              />
              <textarea
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                placeholder="Ne hakkında konuşmak istersiniz?"
                className="input-field"
                style={{ 
                  minHeight: '150px', 
                  resize: 'none'
                }}
                required
              />
              <input
                type="text"
                value={newPostTags}
                onChange={(e) => setNewPostTags(e.target.value)}
                placeholder="Etiketler (#teknoloji #yazılım gibi)"
                className="input-field"
              />
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                Paylaş
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Feed; 