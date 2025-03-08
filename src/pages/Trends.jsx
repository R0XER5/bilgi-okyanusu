import React, { useState, useMemo } from 'react';
import { posts } from '../data/dummyData';
import Post from '../components/Post';

const Trends = ({ currentUser }) => {
  const [selectedTag, setSelectedTag] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Tüm etiketleri ve kullanım sayılarını hesapla
  const tagStats = useMemo(() => {
    const stats = {};
    posts.forEach(post => {
      post.tags.forEach(tag => {
        if (!stats[tag]) {
          stats[tag] = {
            count: 1,
            posts: [post]
          };
        } else {
          stats[tag].count++;
          stats[tag].posts.push(post);
        }
      });
    });
    return stats;
  }, []);

  // Etiketleri popülerliğe göre sırala
  const sortedTags = useMemo(() => {
    return Object.entries(tagStats)
      .sort((a, b) => b[1].count - a[1].count)
      .filter(([tag]) => 
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );
  }, [tagStats, searchQuery]);

  return (
    <div className="container" style={{ 
      marginTop: '72px',
      padding: '0 20px',
      maxWidth: '1200px'
    }}>
      {/* Header Bölümü */}
      <div style={{
        marginBottom: '32px',
        textAlign: 'center'
      }}>
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: '700',
          marginBottom: '16px',
          background: 'linear-gradient(45deg, var(--primary-color), var(--secondary-color))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Gündemdeki Konular
        </h1>
        <p style={{
          fontSize: '1.1rem',
          color: 'var(--gray-color)',
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          En çok konuşulan konuları keşfedin ve tartışmalara katılın
        </p>
      </div>

      {/* Arama Bölümü */}
      <div className="card" style={{ 
        marginBottom: '32px',
        padding: '24px',
        background: 'linear-gradient(to right, var(--white), #f8f9fa)'
      }}>
        <div style={{ 
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          <span className="material-icons" style={{ 
            fontSize: '24px',
            color: 'var(--primary-color)'
          }}>search</span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Etiketlerde ara..."
            className="input-field"
            style={{ 
              margin: 0,
              fontSize: '1.1rem',
              border: 'none',
              borderBottom: '2px solid var(--border-color)',
              borderRadius: '0',
              padding: '12px 0',
              backgroundColor: 'transparent',
              transition: 'all 0.3s ease'
            }}
          />
        </div>
      </div>

      {/* Ana İçerik */}
      <div style={{ 
        display: 'grid',
        gridTemplateColumns: '320px 1fr',
        gap: '32px'
      }}>
        {/* Etiketler Listesi */}
        <div className="card" style={{ 
          padding: '24px',
          height: 'fit-content',
          position: 'sticky',
          top: '92px'
        }}>
          <h2 style={{ 
            fontSize: '1.25rem',
            fontWeight: '600',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span className="material-icons" style={{ color: 'var(--primary-color)' }}>
              local_fire_department
            </span>
            Popüler Etiketler
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {sortedTags.map(([tag, { count }]) => (
              <div
                key={tag}
                onClick={() => setSelectedTag(tag)}
                style={{
                  padding: '12px 16px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  backgroundColor: selectedTag === tag ? 'var(--primary-color)' : 'transparent',
                  color: selectedTag === tag ? 'var(--white)' : 'var(--text-color)',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  border: selectedTag === tag ? 'none' : '1px solid var(--border-color)'
                }}
              >
                <div style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <span className="material-icons" style={{ 
                    fontSize: '18px',
                    color: selectedTag === tag ? 'var(--white)' : 'var(--primary-color)'
                  }}>tag</span>
                  <span style={{ fontWeight: '500' }}>{tag}</span>
                </div>
                <span style={{ 
                  fontSize: '0.9rem',
                  opacity: 0.8
                }}>{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Gönderiler */}
        <div>
          {selectedTag ? (
            <>
              <div style={{ 
                marginBottom: '24px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <h2 style={{ 
                  fontSize: '1.5rem',
                  fontWeight: '600',
                  color: 'var(--primary-color)'
                }}>{selectedTag}</h2>
                <span style={{ 
                  color: 'var(--gray-color)',
                  fontSize: '1.1rem'
                }}>etiketli gönderiler</span>
                <span style={{ 
                  backgroundColor: 'var(--primary-color)',
                  color: 'var(--white)',
                  padding: '4px 12px',
                  borderRadius: '16px',
                  fontSize: '0.9rem'
                }}>{tagStats[selectedTag].posts.length} gönderi</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {tagStats[selectedTag].posts.map(post => (
                  <Post key={post.id} post={post} currentUser={currentUser} />
                ))}
              </div>
            </>
          ) : (
            <div className="card" style={{ 
              padding: '48px',
              textAlign: 'center',
              backgroundColor: '#f8f9fa'
            }}>
              <span className="material-icons" style={{ 
                fontSize: '48px',
                color: 'var(--gray-color)',
                marginBottom: '16px'
              }}>playlist_add</span>
              <h3 style={{ 
                fontSize: '1.25rem',
                color: 'var(--text-color)',
                marginBottom: '8px'
              }}>Gönderi görüntülemek için bir etiket seçin</h3>
              <p style={{ color: 'var(--gray-color)' }}>
                Sol taraftaki listeden bir etiket seçerek ilgili gönderileri görüntüleyebilirsiniz
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Trends; 