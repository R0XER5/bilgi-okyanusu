import React, { useMemo } from 'react';
import { posts } from '../data/dummyData';

const TrendingTags = () => {
  // Tüm etiketleri ve kullanım sayılarını hesapla
  const tagStats = useMemo(() => {
    const stats = {};
    posts.forEach(post => {
      post.tags.forEach(tag => {
        if (!stats[tag]) {
          stats[tag] = 1;
        } else {
          stats[tag]++;
        }
      });
    });
    return stats;
  }, []);

  // Etiketleri popülerliğe göre sırala ve ilk 7'sini al
  const topTags = useMemo(() => {
    return Object.entries(tagStats)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 7);
  }, [tagStats]);

  return (
    <div className="card">
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '8px',
        marginBottom: '16px'
      }}>
        <span className="material-icons" style={{ color: 'var(--primary-color)' }}>
          trending_up
        </span>
        <h3 style={{ fontSize: '1.1rem' }}>Gündemdeki Konular</h3>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {topTags.map(([tag, count], index) => (
          <div 
            key={tag}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '8px',
              borderRadius: '4px',
              cursor: 'pointer',
              ':hover': {
                backgroundColor: 'var(--background-color)'
              }
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ 
                color: 'var(--gray-color)',
                fontSize: '0.9rem',
                minWidth: '20px'
              }}>
                {index + 1}
              </span>
              <span style={{ 
                color: 'var(--primary-color)',
                fontWeight: '500'
              }}>
                {tag}
              </span>
            </div>
            <span style={{ 
              color: 'var(--gray-color)',
              fontSize: '0.9rem'
            }}>
              {count} gönderi
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrendingTags; 