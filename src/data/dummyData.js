export const users = [
  {
    id: 1,
    username: 'demo',
    name: 'Demo Kullanıcı',
    password: 'password',
    connections: 245,
    connectionsList: [2, 3],
    joinDate: '2024-01-01T00:00:00.000Z',
    bio: 'Teknoloji ve yazılım konularında sürekli öğrenmeye çalışan bir meraklı.',
    coverImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa',
    profileImage: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde',
    location: 'İstanbul, Türkiye',
    website: 'https://example.com',
    interests: ['Yazılım Geliştirme', 'Yapay Zeka', 'Web Teknolojileri', 'Veri Bilimi']
  },
  {
    id: 2,
    username: 'ahmet',
    name: 'Ahmet Yılmaz',
    password: '123456',
    connections: 178,
    connectionsList: [1],
    joinDate: '2024-02-15T00:00:00.000Z',
    bio: 'Yapay zeka ve veri bilimi üzerine çalışıyorum.',
    coverImage: 'https://images.unsplash.com/photo-1484417894907-623942c8ee29',
    profileImage: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36',
    location: 'Ankara, Türkiye',
    website: 'https://ahmetyilmaz.dev',
    interests: ['Yapay Zeka', 'Makine Öğrenmesi', 'Python', 'Derin Öğrenme']
  },
  {
    id: 3,
    username: 'ayse',
    name: 'Ayşe Demir',
    password: '123456',
    connections: 312,
    connectionsList: [1],
    joinDate: '2024-03-01T00:00:00.000Z',
    bio: 'Web geliştirici ve UI/UX tasarımcısı.',
    coverImage: 'https://images.unsplash.com/photo-1517134191118-9d595e4c8c2b',
    profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    location: 'İzmir, Türkiye',
    website: 'https://aysedemir.com',
    interests: ['UI/UX Tasarım', 'Web Geliştirme', 'React', 'Kullanıcı Deneyimi']
  }
];

export const posts = [
  {
    id: 1,
    userId: 1,
    title: "Yapay Zeka ve Etik: Gelecekteki Zorluklarımız",
    content: "Yapay zeka teknolojileri her geçen gün hayatımızın daha fazla alanına giriyor. Ancak bu gelişmeler beraberinde önemli etik soruları da getiriyor. Veri gizliliği, algoritma yanlılığı ve otomasyon kaynaklı iş kayıpları gibi konular, acilen ele alınması gereken başlıca meseleler arasında. Özellikle yapay zekanın karar verme süreçlerindeki rolü ve bu kararların şeffaflığı konusu, üzerinde dikkatle durulması gereken bir alan.",
    timestamp: "2024-03-15T10:30:00Z",
    likes: 245,
    comments: [
      {
        id: 1,
        userId: 2,
        content: "Çok önemli bir konuya değinmişsiniz. Özellikle algoritma yanlılığı konusu kritik.",
        timestamp: "2024-03-15T11:00:00Z"
      }
    ],
    tags: ["#yapayZeka", "#etik", "#teknoloji", "#gelecek"]
  },
  {
    id: 2,
    userId: 3,
    title: "Sürdürülebilir Yaşam İçin Pratik Öneriler",
    content: "Günlük hayatımızda yapacağımız küçük değişiklikler, gezegenimizdeki karbon ayak izimizi önemli ölçüde azaltabilir. Tek kullanımlık plastikleri reddetmek, toplu taşıma kullanmak, enerji tasarruflu cihazlar tercih etmek ve geri dönüşüme önem vermek, atabileceğimiz ilk adımlar arasında. Ayrıca yerel üreticilerden alışveriş yapmak ve gıda israfını önlemek de sürdürülebilir bir yaşam için kritik öneme sahip.",
    timestamp: "2024-03-14T15:45:00Z",
    likes: 189,
    comments: [
      {
        id: 2,
        userId: 4,
        content: "Harika öneriler! Ben de son zamanlarda sıfır atık yaşam tarzına geçmeye çalışıyorum.",
        timestamp: "2024-03-14T16:20:00Z"
      }
    ],
    tags: ["#sürdürülebilirlik", "#çevre", "#sıfırAtık", "#yeşilYaşam"]
  },
  {
    id: 3,
    userId: 3,
    title: 'Yazılım Öğrenme Yolculuğum',
    content: 'Yazılım dünyasında yeni şeyler öğrenmek çok keyifli.',
    tags: ['#yazılım', '#öğrenme', '#gelişim'],
    timestamp: '2024-03-07T08:45:00',
    likes: 123,
    comments: []
  },
];

export const comments = [
  {
    id: 1,
    postId: 1,
    userId: 2,
    content: 'Harika bir teknoloji stack! Biz de benzer bir yapı kullanıyoruz.',
    timestamp: '2024-03-07T11:00:00',
  },
  {
    id: 2,
    postId: 2,
    userId: 3,
    content: 'Makaleyi merakla bekliyorum!',
    timestamp: '2024-03-07T09:30:00',
  },
  {
    id: 3,
    postId: 3,
    userId: 1,
    content: 'Çevik metodolojiler konusunda tecrübelerinizi paylaşırsanız çok memnun olurum.',
    timestamp: '2024-03-07T09:00:00',
  },
]; 