import React, { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Post from '../components/Post';
import ReportModal from '../components/ReportModal';
import analyzeReport from '../services/reportAnalyzer';
import { posts, users } from '../data/dummyData';

const Profile = ({ currentUser }) => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const profileUser = userId ? users.find(u => u.id === parseInt(userId)) : currentUser;
  
  const [activeTab, setActiveTab] = useState('posts');
  const [isEditing, setIsEditing] = useState(false);
  const [editedBio, setEditedBio] = useState(profileUser.bio || '');
  const [editedCoverImage, setEditedCoverImage] = useState(profileUser.coverImage || '');
  const [editedProfileImage, setEditedProfileImage] = useState(profileUser.profileImage || '');
  const [editedLocation, setEditedLocation] = useState(profileUser.location || '');
  const [editedWebsite, setEditedWebsite] = useState(profileUser.website || '');
  const [editedInterests, setEditedInterests] = useState(profileUser.interests || []);
  const [newInterest, setNewInterest] = useState('');
  const coverFileInputRef = useRef(null);
  const profileFileInputRef = useRef(null);
  const [showConnectionsModal, setShowConnectionsModal] = useState(false);
  const [searchUsername, setSearchUsername] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showReportModal, setShowReportModal] = useState(false);
  const [isReporting, setIsReporting] = useState(false);
  
  // Kullanıcının gönderilerini filtrele
  const userPosts = posts.filter(post => post.userId === profileUser.id);
  const likedPosts = posts.filter(post => post.likes > 0); // Örnek olarak
  const userComments = posts.flatMap(post => 
    post.comments?.filter(comment => comment.userId === profileUser.id) || []
  );

  // Kullanıcının bağlantılarını filtrele
  const userConnections = users.filter(user => 
    profileUser.connectionsList?.includes(user.id)
  );

  // Bağlantı olarak eklenebilecek kullanıcıları filtrele
  const potentialConnections = users.filter(user => 
    user.id !== profileUser.id
  );

  const stats = {
    posts: userPosts.length,
    views: userPosts.reduce((total, post) => total + (post.views || 0), 0),
    likes: userPosts.reduce((total, post) => total + (post.likes || 0), 0),
    comments: userPosts.reduce((total, post) => total + (post.comments?.length || 0), 0)
  };

  const handleCoverFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditedCoverImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditedProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = () => {
    // Normalde burada bir API çağrısı yapılır
    profileUser.bio = editedBio;
    profileUser.coverImage = editedCoverImage;
    profileUser.profileImage = editedProfileImage;
    profileUser.location = editedLocation;
    profileUser.website = editedWebsite;
    profileUser.interests = editedInterests;
    setIsEditing(false);
  };

  const handleAddInterest = () => {
    if (newInterest.trim() && !editedInterests.includes(newInterest.trim())) {
      setEditedInterests([...editedInterests, newInterest.trim()]);
      setNewInterest('');
    }
  };

  const handleRemoveInterest = (interest) => {
    setEditedInterests(editedInterests.filter(i => i !== interest));
  };

  const handleAddConnection = (userId) => {
    // Normalde burada bir API çağrısı yapılır
    profileUser.connectionsList = [...(profileUser.connectionsList || []), userId];
    profileUser.connections = profileUser.connectionsList.length;
  };

  const handleRemoveConnection = (userId) => {
    // Normalde burada bir API çağrısı yapılır
    profileUser.connectionsList = profileUser.connectionsList.filter(id => id !== userId);
    profileUser.connections = profileUser.connectionsList.length;
  };

  const handleSearchUser = (username) => {
    // Kullanıcı adına göre arama yap
    const results = users.filter(user => 
      user.id !== profileUser.id && 
      user.username.toLowerCase().includes(username.toLowerCase())
    );
    setSearchResults(results);
  };

  const handleReport = async (reportData) => {
    setIsReporting(true);
    try {
      const analysis = await analyzeReport(reportData, profileUser.bio || '');
      
      if (analysis.accepted === true && analysis.confidence > 0.8) {
        // Rapor kabul edildi ve güven skoru yüksek
        // Kullanıcıyı devre dışı bırak
        profileUser.isDisabled = true;
        alert('Raporunuz değerlendirildi ve kullanıcı devre dışı bırakıldı.');
        navigate('/feed');
      } else if (analysis.accepted === null) {
        alert('Raporunuz manuel incelemeye alındı.');
      } else {
        alert('Raporunuz değerlendirildi fakat kullanıcı politikalarımızı ihlal etmiyor.');
      }
    } catch (error) {
      console.error('Rapor işlenirken hata:', error);
      alert('Rapor işlenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
    } finally {
      setIsReporting(false);
    }
  };

  const handlePostDelete = (postId) => {
    if (window.confirm('Bu yazıyı silmek istediğinizden emin misiniz?')) {
      const postIndex = posts.findIndex(p => p.id === postId);
      if (postIndex !== -1) {
        posts.splice(postIndex, 1);
        // Sayfayı yeniden render etmek için state'i güncelle
        setActiveTab(prev => prev === 'posts' ? 'posts_refresh' : 'posts');
      }
    }
  };

  // Profil devre dışı bırakılmışsa
  if (profileUser.isDisabled) {
    return (
      <div className="container" style={{ 
        marginTop: '72px',
        padding: '48px 20px',
        textAlign: 'center'
      }}>
        <div className="card">
          <span className="material-icons" style={{ 
            fontSize: '64px',
            color: 'var(--gray-color)',
            marginBottom: '16px'
          }}>block</span>
          <h2>Bu hesap devre dışı bırakıldı</h2>
          <p style={{ color: 'var(--gray-color)' }}>
            Bu hesap topluluk kurallarını ihlal ettiği için devre dışı bırakılmıştır.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="container" style={{ 
        marginTop: '72px',
        padding: '0 20px',
        maxWidth: '1200px'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '300px 1fr',
          gap: '24px'
        }}>
          {/* Sol Sütun */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Profil Kartı */}
            <div className="card">
              <div style={{ padding: '24px' }}>
                <h2 style={{ 
                  fontSize: '1.25rem', 
                  fontWeight: '600',
                  marginBottom: '16px',
                  color: 'var(--text-color)'
                }}>Profil Bilgileri</h2>

                {isEditing ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                      <label style={{ 
                        display: 'block', 
                        marginBottom: '8px',
                        color: 'var(--gray-color)',
                        fontSize: '0.9rem'
                      }}>Konum</label>
                      <input
                        type="text"
                        value={editedLocation}
                        onChange={(e) => setEditedLocation(e.target.value)}
                        placeholder="Konumunuz"
                        style={{
                          width: '100%',
                          padding: '8px',
                          borderRadius: '4px',
                          border: '1px solid var(--border-color)'
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ 
                        display: 'block', 
                        marginBottom: '8px',
                        color: 'var(--gray-color)',
                        fontSize: '0.9rem'
                      }}>Website</label>
                      <input
                        type="url"
                        value={editedWebsite}
                        onChange={(e) => setEditedWebsite(e.target.value)}
                        placeholder="Website adresiniz"
                        style={{
                          width: '100%',
                          padding: '8px',
                          borderRadius: '4px',
                          border: '1px solid var(--border-color)'
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ 
                        display: 'block', 
                        marginBottom: '8px',
                        color: 'var(--gray-color)',
                        fontSize: '0.9rem'
                      }}>İlgi Alanları</label>
                      <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                        <input
                          type="text"
                          value={newInterest}
                          onChange={(e) => setNewInterest(e.target.value)}
                          placeholder="İlgi alanı ekle"
                          style={{
                            flex: 1,
                            padding: '8px',
                            borderRadius: '4px',
                            border: '1px solid var(--border-color)'
                          }}
                          onKeyPress={(e) => e.key === 'Enter' && handleAddInterest()}
                        />
                        <button
                          onClick={handleAddInterest}
                          style={{
                            padding: '8px',
                            borderRadius: '4px',
                            border: 'none',
                            background: 'var(--primary-color)',
                            color: 'white',
                            cursor: 'pointer'
                          }}
                        >
                          <span className="material-icons">add</span>
                        </button>
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {editedInterests.map((interest, index) => (
                          <div
                            key={index}
                            style={{
                              background: 'var(--primary-color)',
                              color: 'white',
                              padding: '4px 12px',
                              borderRadius: '16px',
                              fontSize: '0.9rem',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            {interest}
                            <span
                              className="material-icons"
                              style={{ fontSize: '16px', cursor: 'pointer' }}
                              onClick={() => handleRemoveInterest(interest)}
                            >
                              close
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {editedLocation && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className="material-icons" style={{ color: 'var(--gray-color)' }}>location_on</span>
                        <span>{editedLocation}</span>
                      </div>
                    )}
                    {editedWebsite && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className="material-icons" style={{ color: 'var(--gray-color)' }}>language</span>
                        <a href={editedWebsite} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary-color)' }}>
                          {editedWebsite}
                        </a>
                      </div>
                    )}
                    {editedInterests.length > 0 && (
                      <div>
                        <h3 style={{ 
                          fontSize: '1rem',
                          color: 'var(--gray-color)',
                          marginBottom: '8px'
                        }}>İlgi Alanları</h3>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                          {editedInterests.map((interest, index) => (
                            <div
                              key={index}
                              style={{
                                background: 'var(--primary-color)',
                                color: 'white',
                                padding: '4px 12px',
                                borderRadius: '16px',
                                fontSize: '0.9rem'
                              }}
                            >
                              {interest}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Bağlantılar */}
            <div className="card">
              <div style={{ padding: '24px' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '16px'
                }}>
                  <h2 style={{ 
                    fontSize: '1.25rem', 
                    fontWeight: '600',
                    color: 'var(--text-color)'
                  }}>Bağlantılar ({userConnections.length})</h2>
                </div>

                {isEditing && (
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ 
                      display: 'flex',
                      gap: '8px',
                      marginBottom: '12px'
                    }}>
                      <input
                        type="text"
                        value={searchUsername}
                        onChange={(e) => {
                          setSearchUsername(e.target.value);
                          handleSearchUser(e.target.value);
                        }}
                        placeholder="Kullanıcı adı ile ara..."
                        style={{
                          flex: 1,
                          padding: '8px 12px',
                          borderRadius: '4px',
                          border: '1px solid var(--border-color)',
                          fontSize: '0.9rem'
                        }}
                      />
                    </div>
                    
                    {searchUsername && searchResults.length > 0 && (
                      <div style={{
                        border: '1px solid var(--border-color)',
                        borderRadius: '4px',
                        marginBottom: '16px'
                      }}>
                        {searchResults.map(user => (
                          <div key={user.id} style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '12px',
                            borderBottom: '1px solid var(--border-color)'
                          }}>
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '12px'
                            }}>
                              <div style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                overflow: 'hidden'
                              }}>
                                {user.profileImage ? (
                                  <img
                                    src={user.profileImage}
                                    alt={user.name}
                                    style={{
                                      width: '100%',
                                      height: '100%',
                                      objectFit: 'cover'
                                    }}
                                  />
                                ) : (
                                  <div style={{
                                    width: '100%',
                                    height: '100%',
                                    background: 'var(--primary-color)',
                                    color: 'white',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                  }}>
                                    <span className="material-icons" style={{ fontSize: '16px' }}>person</span>
                                  </div>
                                )}
                              </div>
                              <div>
                                <div style={{ fontWeight: '500' }}>{user.name}</div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--gray-color)' }}>@{user.username}</div>
                              </div>
                            </div>
                            <button
                              onClick={() => {
                                handleAddConnection(user.id);
                                setSearchUsername('');
                                setSearchResults([]);
                              }}
                              style={{
                                background: profileUser.connectionsList?.includes(user.id) ? 'var(--gray-color)' : 'var(--primary-color)',
                                color: 'white',
                                border: 'none',
                                padding: '6px 12px',
                                borderRadius: '4px',
                                cursor: profileUser.connectionsList?.includes(user.id) ? 'default' : 'pointer',
                                fontSize: '0.8rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}
                              disabled={profileUser.connectionsList?.includes(user.id)}
                            >
                              <span className="material-icons" style={{ fontSize: '16px' }}>
                                {profileUser.connectionsList?.includes(user.id) ? 'check' : 'person_add'}
                              </span>
                              {profileUser.connectionsList?.includes(user.id) ? 'Bağlantı Mevcut' : 'Ekle'}
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {searchUsername && searchResults.length === 0 && (
                      <div style={{
                        padding: '12px',
                        textAlign: 'center',
                        color: 'var(--gray-color)',
                        fontSize: '0.9rem',
                        background: 'var(--background-color)',
                        borderRadius: '4px'
                      }}>
                        Kullanıcı bulunamadı
                      </div>
                    )}
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {userConnections.map(user => (
                    <div key={user.id} style={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px',
                      borderRadius: '8px',
                      background: 'var(--background-color)',
                    }}>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        gap: '12px'
                      }}>
                        <div style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          overflow: 'hidden'
                        }}>
                          {user.profileImage ? (
                            <img 
                              src={user.profileImage} 
                              alt={user.name}
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover'
                              }}
                            />
                          ) : (
                            <div style={{
                              width: '100%',
                              height: '100%',
                              background: 'var(--primary-color)',
                              color: 'white',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}>
                              <span className="material-icons">person</span>
                            </div>
                          )}
                        </div>
                        <div>
                          <div style={{ fontWeight: '500' }}>{user.name}</div>
                          <div style={{ fontSize: '0.9rem', color: 'var(--gray-color)' }}>{user.bio?.slice(0, 30)}...</div>
                        </div>
                      </div>
                      {isEditing && (
                        <button
                          onClick={() => handleRemoveConnection(user.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#dc3545',
                            cursor: 'pointer',
                            padding: '8px',
                            borderRadius: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '0.9rem'
                          }}
                        >
                          <span className="material-icons" style={{ fontSize: '20px' }}>person_remove</span>
                          Çıkar
                        </button>
                      )}
                    </div>
                  ))}
                  {userConnections.length === 0 && (
                    <div style={{ 
                      textAlign: 'center',
                      padding: '24px',
                      color: 'var(--gray-color)'
                    }}>
                      <span className="material-icons" style={{ 
                        fontSize: '48px',
                        marginBottom: '8px'
                      }}>people_outline</span>
                      <p>Henüz bağlantınız yok</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sağ Sütun */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Profil Başlığı */}
            <div className="card" style={{
              padding: '0',
              overflow: 'hidden',
              marginBottom: '24px'
            }}>
              {/* Kapak Fotoğrafı */}
              <div style={{
                height: '200px',
                background: editedCoverImage ? 
                  `url(${editedCoverImage}) center/cover` : 
                  'linear-gradient(135deg, var(--primary-color), var(--secondary-color))',
                position: 'relative'
              }}>
                {isEditing && (
                  <div style={{
                    position: 'absolute',
                    bottom: '16px',
                    right: '16px',
                    background: 'rgba(0,0,0,0.6)',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCoverFileChange}
                      ref={coverFileInputRef}
                      style={{ display: 'none' }}
                    />
                    <button
                      onClick={() => coverFileInputRef.current.click()}
                      style={{
                        background: 'var(--primary-color)',
                        color: 'white',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}
                    >
                      <span className="material-icons" style={{ fontSize: '20px' }}>upload</span>
                      Fotoğraf Yükle
                    </button>
                    {editedCoverImage && (
                      <button
                        onClick={() => setEditedCoverImage('')}
                        style={{
                          background: '#dc3545',
                          color: 'white',
                          border: 'none',
                          padding: '8px 16px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}
                      >
                        <span className="material-icons" style={{ fontSize: '20px' }}>delete</span>
                        Kaldır
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Profil Bilgileri */}
              <div style={{ 
                padding: '24px',
                position: 'relative'
              }}>
                {/* Düzenleme Butonu */}
                <div style={{
                  position: 'absolute',
                  top: '24px',
                  right: '24px',
                  display: 'flex',
                  gap: '12px'
                }}>
                  {profileUser.id === currentUser.id ? (
                    <button
                      onClick={() => {
                        if (isEditing) {
                          handleSaveProfile();
                        } else {
                          setIsEditing(true);
                        }
                      }}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '8px',
                        background: isEditing ? 'var(--primary-color)' : 'transparent',
                        color: isEditing ? 'white' : 'var(--primary-color)',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}
                    >
                      <span className="material-icons">
                        {isEditing ? 'save' : 'edit'}
                      </span>
                      {isEditing ? 'Kaydet' : 'Düzenle'}
                    </button>
                  ) : (
                    <button
                      onClick={() => setShowReportModal(true)}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '8px',
                        background: 'transparent',
                        color: '#dc3545',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}
                      disabled={isReporting}
                    >
                      <span className="material-icons">flag</span>
                      Raporla
                    </button>
                  )}
                </div>

                {/* Profil Fotoğrafı */}
                <div style={{
                  width: '120px',
                  height: '120px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--white)',
                  border: '4px solid var(--white)',
                  position: 'absolute',
                  top: '-60px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '48px',
                  color: 'var(--primary-color)',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                  overflow: 'hidden',
                  cursor: isEditing ? 'pointer' : 'default'
                }} onClick={() => isEditing && profileFileInputRef.current.click()}>
                  {editedProfileImage ? (
                    <img 
                      src={editedProfileImage} 
                      alt="Profil" 
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  ) : (
                    <span className="material-icons" style={{ fontSize: '64px' }}>person</span>
                  )}
                  {isEditing && (
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleProfileFileChange}
                      ref={profileFileInputRef}
                      style={{ display: 'none' }}
                    />
                  )}
                  {isEditing && (
                    <div style={{
                      position: 'absolute',
                      bottom: '0',
                      left: '0',
                      right: '0',
                      background: 'rgba(0,0,0,0.6)',
                      color: 'white',
                      padding: '4px',
                      fontSize: '12px',
                      textAlign: 'center'
                    }}>
                      <span className="material-icons" style={{ fontSize: '16px' }}>photo_camera</span>
                    </div>
                  )}
                </div>

                {/* Kullanıcı Bilgileri */}
                <div style={{ marginLeft: '140px', marginBottom: '24px' }}>
                  <h1 style={{ 
                    fontSize: '2rem',
                    fontWeight: '700',
                    marginBottom: '8px'
                  }}>{profileUser.name}</h1>
                  
                  {isEditing ? (
                    <textarea
                      value={editedBio}
                      onChange={(e) => setEditedBio(e.target.value)}
                      placeholder="Kendinizden bahsedin..."
                      style={{
                        width: '100%',
                        minHeight: '80px',
                        padding: '8px',
                        borderRadius: '8px',
                        border: '1px solid var(--border-color)',
                        marginBottom: '16px',
                        resize: 'vertical'
                      }}
                    />
                  ) : (
                    <p style={{
                      color: 'var(--text-color)',
                      fontSize: '1.1rem',
                      marginBottom: '16px',
                      lineHeight: '1.5'
                    }}>
                      {profileUser.bio || 'Henüz bir açıklama eklenmemiş.'}
                    </p>
                  )}
                  
                  <p style={{ 
                    color: 'var(--gray-color)',
                    fontSize: '1.1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <span className="material-icons" style={{ fontSize: '20px' }}>calendar_today</span>
                    Katılım: {new Date(profileUser.joinDate).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long' })}
                  </p>
                </div>

                {/* İstatistikler */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: '16px',
                  padding: '24px 0',
                  borderTop: '1px solid var(--border-color)'
                }}>
                  {Object.entries(stats).map(([key, value]) => (
                    <div key={key} style={{ textAlign: 'center' }}>
                      <h3 style={{ 
                        fontSize: '1.5rem',
                        fontWeight: '700',
                        color: 'var(--primary-color)',
                        marginBottom: '4px'
                      }}>{value}</h3>
                      <p style={{ 
                        color: 'var(--gray-color)',
                        fontSize: '0.9rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>
                        {key === 'posts' ? 'Gönderi' :
                         key === 'views' ? 'Görüntülenme' :
                         key === 'likes' ? 'Beğeni' : 'Yorum'}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sekmeler */}
            <div className="card" style={{ padding: '0' }}>
              <div style={{
                display: 'flex',
                borderBottom: '1px solid var(--border-color)'
              }}>
                {['posts', 'likes', 'comments'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    style={{
                      flex: 1,
                      padding: '16px',
                      border: 'none',
                      background: 'none',
                      cursor: 'pointer',
                      fontSize: '1rem',
                      fontWeight: '500',
                      color: activeTab === tab ? 'var(--primary-color)' : 'var(--gray-color)',
                      borderBottom: activeTab === tab ? '2px solid var(--primary-color)' : 'none',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{ 
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}>
                      <span className="material-icons" style={{ fontSize: '20px' }}>
                        {tab === 'posts' ? 'article' : 
                         tab === 'likes' ? 'favorite' : 'comment'}
                      </span>
                      {tab === 'posts' ? 'Gönderiler' :
                       tab === 'likes' ? 'Beğenilenler' : 'Yorumlar'}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* İçerik */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {activeTab === 'posts' || activeTab === 'posts_refresh' ? (
                userPosts.length > 0 ? (
                  userPosts.map(post => (
                    <div key={post.id} style={{ position: 'relative' }}>
                      {profileUser.id === currentUser.id && (
                        <button
                          onClick={() => handlePostDelete(post.id)}
                          style={{
                            position: 'absolute',
                            top: '12px',
                            right: '12px',
                            zIndex: 1,
                            background: 'none',
                            border: 'none',
                            color: '#dc3545',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '8px',
                            borderRadius: '4px',
                            fontSize: '0.9rem'
                          }}
                        >
                          <span className="material-icons" style={{ fontSize: '20px' }}>delete</span>
                          Sil
                        </button>
                      )}
                      <Post 
                        post={post} 
                        currentUser={currentUser}
                        onDelete={handlePostDelete}
                        isDetailView={false}
                      />
                    </div>
                  ))
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
                    }}>post_add</span>
                    <h3 style={{ 
                      fontSize: '1.25rem',
                      color: 'var(--text-color)',
                      marginBottom: '8px'
                    }}>Henüz gönderi yok</h3>
                    <p style={{ color: 'var(--gray-color)' }}>
                      İlk gönderinizi oluşturmak için yazı paylaşın
                    </p>
                  </div>
                )
              ) : activeTab === 'likes' ? (
                likedPosts.length > 0 ? (
                  likedPosts.map(post => (
                    <Post 
                      key={post.id} 
                      post={post} 
                      currentUser={currentUser}
                      onDelete={handlePostDelete}
                    />
                  ))
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
                    }}>favorite_border</span>
                    <h3 style={{ 
                      fontSize: '1.25rem',
                      color: 'var(--text-color)',
                      marginBottom: '8px'
                    }}>Henüz beğenilen gönderi yok</h3>
                    <p style={{ color: 'var(--gray-color)' }}>
                      Beğendiğiniz gönderiler burada görünecek
                    </p>
                  </div>
                )
              ) : activeTab === 'comments' && userComments.length > 0 ? (
                <div className="card">
                  <div style={{ padding: '24px' }}>
                    {userComments.map((comment, index) => (
                      <div key={index} style={{
                        padding: '16px 0',
                        borderBottom: index < userComments.length - 1 ? '1px solid var(--border-color)' : 'none'
                      }}>
                        <p style={{ marginBottom: '8px' }}>{comment.content}</p>
                        <div style={{ 
                          fontSize: '0.9rem',
                          color: 'var(--gray-color)'
                        }}>
                          {new Date(comment.timestamp).toLocaleDateString('tr-TR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
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
                  }}>
                    {activeTab === 'posts' ? 'post_add' :
                     activeTab === 'likes' ? 'favorite_border' : 'chat_bubble_outline'}
                  </span>
                  <h3 style={{ 
                    fontSize: '1.25rem',
                    color: 'var(--text-color)',
                    marginBottom: '8px'
                  }}>
                    {activeTab === 'posts' ? 'Henüz gönderi yok' :
                     activeTab === 'likes' ? 'Henüz beğenilen gönderi yok' : 'Henüz yorum yok'}
                  </h3>
                  <p style={{ color: 'var(--gray-color)' }}>
                    {activeTab === 'posts' ? 'İlk gönderinizi oluşturmak için yazı paylaşın' :
                     activeTab === 'likes' ? 'Beğendiğiniz gönderiler burada görünecek' : 'Yaptığınız yorumlar burada görünecek'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showReportModal && (
        <ReportModal
          type="user"
          onClose={() => setShowReportModal(false)}
          onSubmit={handleReport}
        />
      )}
    </>
  );
};

export default Profile; 