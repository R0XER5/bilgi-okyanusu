import React from 'react';
import { useParams } from 'react-router-dom';
import { posts, users } from '../data/dummyData';
import Post from '../components/Post';
import RecommendedPosts from '../components/RecommendedPosts';

const PostDetail = ({ currentUser }) => {
  const { postId } = useParams();
  const post = posts.find(p => p.id === parseInt(postId));
  
  if (!post) {
    return (
      <div className="container" style={{ marginTop: '72px', maxWidth: '1100px' }}>
        <div className="card">
          <h2>Gönderi bulunamadı</h2>
          <p>Aradığınız gönderi mevcut değil veya silinmiş olabilir.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ 
      marginTop: '74px',
      maxWidth: '1100px',
      margin: '74px auto 0'
    }}>
      <Post post={post} currentUser={currentUser} isDetailView={true} />
      <RecommendedPosts currentUser={currentUser} currentPostId={post.id} />
    </div>
  );
};

export default PostDetail; 