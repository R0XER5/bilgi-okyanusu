import React, { useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

const AdminCreatePost = ({ currentAdmin, onPostCreated }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setIsSubmitting(true);

    const processedTags = tags
      .split(/[\s,]+/)
      .filter(tag => tag.trim())
      .map(tag => tag.startsWith('#') ? tag.slice(1) : tag.trim());

    const newPost = {
      title: title.trim(),
      content: content.trim(),
      publish_date: new Date().toISOString(),
      update_date: new Date().toISOString(),
      writer_id: currentAdmin.id,
      tags: processedTags,
    };

    try {
      const res = await fetch('http://localhost:3000/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPost),
      });

      if (!res.ok) throw new Error('Sunucu hatası');

      const savedPost = await res.json();

      setSnackbar({
        open: true,
        message: 'Makale başarılı bir şekilde eklendi',
        severity: 'success',
      });

      if (onPostCreated) onPostCreated(savedPost);

      // Formu temizle ve modalı kapat
      setTitle('');
      setContent('');
      setTags('');
      setIsModalOpen(false);
    } catch (err) {
      setSnackbar({
        open: true,
        message: 'Bir hata oluştu. Lütfen tekrar deneyin.',
        severity: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!currentAdmin) return null;

  return (
    <>
      {/* Yazı Oluştur Butonu */}
      <button
        onClick={() => setIsModalOpen(true)}
        style={{
          background: 'var(--primary-color)',
          color: 'white',
          border: 'none',
          padding: '12px 24px',
          borderRadius: '12px',
          fontSize: '1rem',
          fontWeight: '500',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
        }}
      >
        <span className="material-icons">add</span>
        Yeni Yazı Oluştur
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="modal-overlay"
          onClick={() => !isSubmitting && setIsModalOpen(false)}
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
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
            onClick={(e) => e.stopPropagation()}
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
            {/* Başlık ve Kapat */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px'
            }}>
              <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '600' }}>
                Yeni Yazı Oluştur
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                disabled={isSubmitting}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
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

            {/* Form */}
            <form onSubmit={handleSubmit}>
              {/* Başlık */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px' }}>
                  Başlık *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Yazınızın başlığını girin"
                  required
                  maxLength={100}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    fontSize: '1rem'
                  }}
                />
              </div>

              {/* İçerik */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px' }}>
                  İçerik *
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Yazınızın içeriğini girin..."
                  required
                  maxLength={5000}
                  style={{
                    width: '100%',
                    minHeight: '200px',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    fontSize: '1rem',
                    resize: 'vertical'
                  }}
                />
              </div>

              {/* Etiketler */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', marginBottom: '8px' }}>
                  Etiketler (isteğe bağlı)
                </label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="#teknoloji, #yazılım gibi"
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    fontSize: '1rem'
                  }}
                />
              </div>

              {/* Butonlar */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSubmitting}
                  style={{
                    padding: '12px 24px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    background: 'white',
                    color: 'var(--gray-color)',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer'
                  }}
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    padding: '12px 24px',
                    borderRadius: '8px',
                    border: 'none',
                    background: 'var(--primary-color)',
                    color: 'white',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <span className="material-icons" style={{ fontSize: '20px' }}>
                        refresh
                      </span>
                      Oluşturuluyor...
                    </>
                  ) : (
                    <>
                      <span className="material-icons" style={{ fontSize: '20px' }}>
                        publish
                      </span>
                      Yayınla
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default AdminCreatePost;
