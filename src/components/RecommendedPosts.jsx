import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { posts, users } from '../data/dummyData';

const RecommendedPosts = ({ currentUser, currentPostId, isHomePage = false }) => {
  const recommendedPosts = useMemo(() => {
    let filteredPosts = [...posts];
    
    if (!isHomePage) {
      // Detay sayfasında benzer yazıları göster
      filteredPosts = filteredPosts.filter(post => 
        post.id !== currentPostId && post.userId !== currentUser.id
      );
    } else {
      // Ana sayfada popüler ve yeni yazıları göster
      filteredPosts = filteredPosts.filter(post => 
        post.userId !== currentUser.id
      );
    }

    return filteredPosts
      .map(post => {
        let score = 0;
        score += post.likes * 2; // Beğenilere daha fazla ağırlık ver
        
        // Son 7 günde paylaşılan yazılara bonus puan
        const daysSincePosted = (new Date() - new Date(post.timestamp)) / (1000 * 60 * 60 * 24);
        score += Math.max(0, 7 - daysSincePosted) * 3;
        
        // Yorum sayısına göre puan ekle
        score += (post.comments?.length || 0) * 1.5;
        
        return { ...post, score };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 6);
  }, [currentUser.id, currentPostId, isHomePage]);

  return (
    <div className="card" style={{ marginTop: '0px' }}>
      <h3 style={{ 
        marginBottom: '24px', 
        fontSize: '1.25rem',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <span className="material-icons" style={{ fontSize: '24px' }}>
          {isHomePage ? 'recommend' : 'auto_stories'}
        </span>
        {isHomePage ? 'Önerilen Yazılar' : 'Benzer Yazılar'}
      </h3>
      <div style={{ 
        display: 'grid',
        gridTemplateColumns: isHomePage ? '1fr' : 'repeat(3, 1fr)',
        gap: isHomePage ? '16px' : '24px'
      }}>
        {recommendedPosts.map(post => {
          const author = users.find(user => user.id === post.userId);
          return (
            <Link 
              to={`/post/${post.id}`} 
              key={post.id}
              style={{ 
                textDecoration: 'none',
                color: 'inherit'
              }}
            >
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                padding: '16px',
                borderRadius: '8px',
                backgroundColor: 'var(--background-color)',
                height: isHomePage ? 'auto' : '100%',
                transition: 'transform 0.2s ease',
                cursor: 'pointer',
                ':hover': {
                  transform: 'translateY(-4px)'
                }
              }}>
                <h4 style={{
                  fontSize: isHomePage ? '1.1rem' : '1rem',
                  fontWeight: '600',
                  margin: 0,
                  display: '-webkit-box',
                  WebkitLineClamp: '2',
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>{post.title}</h4>
                
                <p style={{
                  margin: 0,
                  fontSize: '0.9rem',
                  color: 'var(--gray-color)',
                  display: '-webkit-box',
                  WebkitLineClamp: isHomePage ? '2' : '3',
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  flex: isHomePage ? 'none' : '1'
                }}>
                  {post.content}
                </p>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '0.9rem',
                  color: 'var(--gray-color)',
                  marginTop: isHomePage ? '0' : 'auto'
                }}>
                  <span style={{ fontWeight: '500' }}>{author.name}</span>
                  <span>•</span>
                  <span>{post.likes} beğeni</span>
                  <span>•</span>
                  <span>{post.comments?.length || 0} yorum</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default RecommendedPosts; 