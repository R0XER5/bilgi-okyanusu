import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { posts, users, admins } from '../data/dummyData';

const RecommendedPosts = ({ currentPostId, isHomePage = false }) => {
  const [showAll, setShowAll] = useState(false);

  const recommendedPosts = useMemo(() => {
    let filteredPosts = [...posts];
    
    if (!isHomePage) {
      // Detay sayfasında benzer yazıları göster
      filteredPosts = filteredPosts.filter(post => 
        post.id !== currentPostId
      );
    }

    return filteredPosts
      .map(post => {
        let score = 0;
        
        // Görüntülenme sayısına göre puan ekle (ana faktör)
        score += (post.views || 0);
        
        // Son 7 günde paylaşılan yazılara bonus puan
        const daysSincePosted = (new Date() - new Date(post.timestamp)) / (1000 * 60 * 60 * 24);
        score += Math.max(0, 7 - daysSincePosted) * 10;
        
        return { ...post, score };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
  }, [currentPostId, isHomePage]);

  // Yazar bulma fonksiyonu
  const getAuthor = (post) => {
    if (post.authorId) {
      return admins.find(admin => admin.id === post.authorId) || users.find(user => user.id === post.userId);
    }
    return users.find(user => user.id === post.userId);
  };

  // Gösterilecek yazıları belirle
  const displayedPosts = showAll ? recommendedPosts : recommendedPosts.slice(0, 3);

  return (
    <div className="card" style={{
      background: 'var(--surface-color)',
      borderRadius: 'var(--radius-xl)',
      boxShadow: 'var(--shadow-md)',
      border: '1px solid var(--border-light)',
      padding: '24px',
      position: isHomePage ? 'sticky' : 'static',
      top: isHomePage ? '92px' : 'auto'
    }}>
      <h3 style={{ 
        fontSize: '1.3rem',
        fontWeight: '700',
        marginBottom: '20px',
        color: 'var(--text-color)',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }}>
        <span className="material-icons" style={{ 
          fontSize: '24px',
          color: 'var(--primary-color)'
        }}>recommend</span>
        Önerilen Yazılar
      </h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {displayedPosts.map((post, index) => (
          <div 
            key={post.id}
            style={{
              padding: '16px',
              borderRadius: 'var(--radius-lg)',
              background: 'var(--background-color)',
              border: '1px solid var(--border-light)',
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <div style={{
              position: 'absolute',
              top: '0',
              left: '0',
              width: '4px',
              height: '100%',
              background: `linear-gradient(135deg, var(--accent-color), var(--primary-color))`,
              borderRadius: '0 var(--radius-lg) var(--radius-lg) 0'
            }} />
            
            <div style={{ paddingLeft: '12px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '8px'
              }}>
                <span style={{
                  background: 'linear-gradient(135deg, var(--accent-color), var(--primary-color))',
                  color: 'white',
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.7rem',
                  fontWeight: '600'
                }}>
                  {index + 1}
                </span>
                <span style={{
                  fontSize: '0.8rem',
                  color: 'var(--text-secondary)',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <span className="material-icons" style={{ fontSize: '14px' }}>person</span>
                  {getAuthor(post)?.name || 'Bilinmeyen Yazar'}
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
              
              <p style={{
                fontSize: '0.85rem',
                color: 'var(--text-secondary)',
                margin: '0 0 12px 0',
                lineHeight: '1.5',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}>
                {post.content.substring(0, 80)}...
              </p>
              
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
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span className="material-icons" style={{ fontSize: '14px' }}>share</span>
                  {post.shares || 0}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {recommendedPosts.length > 3 && (
        <button
          onClick={() => setShowAll(!showAll)}
          style={{
            width: '100%',
            marginTop: '16px',
            padding: '12px',
            background: 'transparent',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-lg)',
            color: 'var(--primary-color)',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = 'var(--background-color)';
            e.target.style.borderColor = 'var(--primary-color)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'transparent';
            e.target.style.borderColor = 'var(--border-color)';
          }}
        >
          <span className="material-icons" style={{ fontSize: '16px' }}>
            {showAll ? 'expand_less' : 'expand_more'}
          </span>
          {showAll ? 'Daha Az Göster' : 'Daha Fazla Göster'}
        </button>
      )}
    </div>
  );
};

export default RecommendedPosts; 