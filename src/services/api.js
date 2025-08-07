const API_BASE_URL = 'http://localhost:3000';

// Backend'den gelen veriyi frontend formatına dönüştürme
const transformBackendPost = (backendPost) => {
  return {
    id: backendPost.id,
    userId: backendPost.writer_id,
    authorId: backendPost.writer_id,
    title: backendPost.title,
    content: backendPost.content,
    timestamp: backendPost.publish_date,
    updateDate: backendPost.update_date,
    likes: backendPost.like_count,
    views: backendPost.view_count,
    shares: backendPost.share_count,
    tags: [], // Backend'den tags gelmiyorsa boş array
    // Yazar bilgileri
    writerFirstName: backendPost.writer_first_name,
    writerLastName: backendPost.writer_last_name
  };
};

// Tüm yazıları getir
export const fetchArticles = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/articles`);
    if (!response.ok) {
      throw new Error('Yazılar yüklenirken hata oluştu');
    }
    const backendPosts = await response.json();
    return backendPosts.map(transformBackendPost);
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Tek bir yazıyı getir
export const fetchArticle = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/articles/${id}`);
    if (!response.ok) {
      throw new Error('Yazı yüklenirken hata oluştu');
    }
    const backendPost = await response.json();
    return transformBackendPost(backendPost);
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}; 