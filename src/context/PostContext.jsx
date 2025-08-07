import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchArticles } from '../services/api';

const PostContext = createContext();

export const usePosts = () => {
  const context = useContext(PostContext);
  if (!context) {
    throw new Error('usePosts must be used within a PostProvider');
  }
  return context;
};

export const PostProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Backend'den yazıları yükle
  useEffect(() => {
    const loadPosts = async () => {
      try {
        setLoading(true);
        const fetchedPosts = await fetchArticles();
        setPosts(fetchedPosts);
        setError(null);
      } catch (err) {
        setError('Yazılar yüklenirken hata oluştu');
        console.error('PostContext loading error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  // ID'ye göre post bulma
  const getPostById = (id) => {
    return posts.find(post => post.id === parseInt(id));
  };

  // Yeni post ekleme
  const addPost = (newPost) => {
    setPosts(prevPosts => [newPost, ...prevPosts]);
  };

  // Post güncelleme
  const updatePost = (id, updatedPost) => {
    setPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === parseInt(id) ? { ...post, ...updatedPost } : post
      )
    );
  };

  // Post silme
  const deletePost = (id) => {
    setPosts(prevPosts => prevPosts.filter(post => post.id !== parseInt(id)));
  };

  const value = {
    posts,
    loading,
    error,
    getPostById,
    addPost,
    updatePost,
    deletePost
  };

  return (
    <PostContext.Provider value={value}>
      {children}
    </PostContext.Provider>
  );
}; 