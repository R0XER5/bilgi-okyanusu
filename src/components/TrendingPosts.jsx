import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { posts, users } from '../data/dummyData';

const TrendingPosts = () => {
  const trendingPosts = useMemo(() => {
    return [...posts]
      .sort((a, b) => b.likes - a.likes)
      .slice(0, 7);
  }, []);

  return (
    <div className="card">
      <h3 style={{ marginBottom: '16px', fontSize: '16px' }}>
        <span className="material-icons" style={{ verticalAlign: 'middle', marginRight: '8px', fontSize: '20px' }}>
          trending_up
        </span>
        Popüler Gönderiler
      </h3>
      <div className="trending-posts">
        {trendingPosts.map(post => {
          const author = users.find(user => user.id === post.userId);
          return (
            <Link 
              to={`/post/${post.id}`} 
              key={post.id} 
              className="trending-post-item"
              style={{ textDecoration: 'none' }}
            >
              <h4>{post.title}</h4>
              <p className="post-preview">{post.content.substring(0, 100)}...</p>
              <div className="post-meta">
                <span>{author.name}</span>
                <span>•</span>
                <span>{post.likes} beğeni</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default TrendingPosts; 