export const users = [
  {
    id: 1,
    username: 'demo',
    name: 'Demo Kullanıcı',
    password: 'password',
    connections: 245,
    connectionsList: [2, 3],
    followers: [2, 3],
    following: [],
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
    followers: [1],
    following: [1],
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
    followers: [1],
    following: [1],
    joinDate: '2024-03-01T00:00:00.000Z',
    bio: 'Web geliştirici ve UI/UX tasarımcısı.',
    coverImage: 'https://images.unsplash.com/photo-1517134191118-9d595e4c8c2b',
    profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    location: 'İzmir, Türkiye',
    website: 'https://aysedemir.com',
    interests: ['UI/UX Tasarım', 'Web Geliştirme', 'React', 'Kullanıcı Deneyimi']
  }
];

export const admins = [
  {
    id: 1,
    username: 'alitarik',
    name: 'Ali Tarık Aydın',
    password: 'atafdg12',
    email: 'alitarik@bilgiokyanusu.com',
    role: 'admin',
    joinDate: '2024-01-01T00:00:00.000Z',
    bio: 'Bilgi Okyanusu kurucusu ve baş editörü.',
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
    location: 'İstanbul, Türkiye',
    website: 'https://alitarikaydin.com',
    interests: ['Teknoloji', 'Yazılım', 'Eğitim', 'İnovasyon']
  }
];

export const posts = [
  {
    id: 1,
    userId: 1,
    authorId: 1,
    title: "Yapay Zeka ve Etik: Gelecekteki Zorluklarımız",
    content: "Yapay zeka teknolojileri her geçen gün hayatımızın daha fazla alanına giriyor. Ancak bu gelişmeler beraberinde önemli etik soruları da getiriyor. Veri gizliliği, algoritma yanlılığı ve otomasyon kaynaklı iş kayıpları gibi konular, acilen ele alınması gereken başlıca meseleler arasında. Özellikle yapay zekanın karar verme süreçlerindeki rolü ve bu kararların şeffaflığı konusu, üzerinde dikkatle durulması gereken bir alan.",
    timestamp: "2024-03-15T10:30:00Z",
    likes: 245,
    views: 1250,
    shares: 89,
    tags: ["#yapayZeka", "#etik", "#teknoloji", "#gelecek"]
  },
  {
    id: 2,
    userId: 3,
    authorId: 1,
    title: "Sürdürülebilir Yaşam İçin Pratik Öneriler",
    content: "Günlük hayatımızda yapacağımız küçük değişiklikler, gezegenimizdeki karbon ayak izimizi önemli ölçüde azaltabilir. Tek kullanımlık plastikleri reddetmek, toplu taşıma kullanmak, enerji tasarruflu cihazlar tercih etmek ve geri dönüşüme önem vermek, atabileceğimiz ilk adımlar arasında. Ayrıca yerel üreticilerden alışveriş yapmak ve gıda israfını önlemek de sürdürülebilir bir yaşam için kritik öneme sahip.",
    timestamp: "2024-03-14T15:45:00Z",
    likes: 189,
    views: 890,
    shares: 156,
    tags: ["#sürdürülebilirlik", "#çevre", "#sıfırAtık", "#yeşilYaşam"]
  },
  {
    id: 3,
    userId: 3,
    authorId: 1,
    title: 'Yazılım Öğrenme Yolculuğum',
    content: 'Yazılım dünyasında yeni şeyler öğrenmek çok keyifli.',
    tags: ['#yazılım', '#öğrenme', '#gelişim'],
    timestamp: '2024-03-07T08:45:00',
    likes: 123,
    views: 450,
    shares: 67
  },
];

export const comments = [
  {
    id: 1,
    postId: 1,
    authorName: "Dr. Mehmet Yıldız",
    authorEmail: "mehmet.yildiz@itu.edu.tr",
    authorWebsite: "https://mehmetyildiz.com",
    content: "Harika bir yazı! Yapay zeka etiği konusu gerçekten çok önemli. Özellikle algoritma yanlılığı konusunda daha fazla araştırma yapılması gerekiyor. Ben de bu konuda çalışıyorum ve şirketlerin AI sistemlerini geliştirirken etik kurallara uyması çok kritik.",
    timestamp: "2024-03-15T11:30:00Z",
    likes: 23
  },
  {
    id: 2,
    postId: 1,
    authorName: "Ayşe Kaya",
    authorEmail: "ayse.kaya@techcompany.com",
    content: "Bu konuda tamamen katılıyorum. Şirketimizde AI projeleri geliştirirken etik kurallara uymak için özel bir komite oluşturduk. Veri gizliliği ve algoritma şeffaflığı konularında çok dikkatli olmamız gerekiyor.",
    timestamp: "2024-03-15T12:15:00Z",
    likes: 18
  },
  {
    id: 3,
    postId: 1,
    authorName: "Prof. Ali Demir",
    authorEmail: "ali.demir@boun.edu.tr",
    authorWebsite: "https://alidemir.dev",
    content: "Yapay zeka etiği konusunda çok değerli bir yazı. Özellikle otomasyon kaynaklı iş kayıpları konusu, toplumsal etkileri açısından çok kritik. Bu konuda politika yapıcıların da harekete geçmesi gerekiyor.",
    timestamp: "2024-03-15T13:45:00Z",
    likes: 31
  },
  {
    id: 4,
    postId: 2,
    authorName: "Zeynep Arslan",
    authorEmail: "zeynep.arslan@greenpeace.org",
    authorWebsite: "https://zeyneparslan.com",
    content: "Sürdürülebilir yaşam için verdiğiniz öneriler çok pratik ve uygulanabilir. Ben de evde kompost yapmaya başladım ve gerçekten çok faydalı. Ayrıca yerel üreticilerden alışveriş yapmak hem çevre hem de ekonomi için çok önemli.",
    timestamp: "2024-03-14T16:20:00Z",
    likes: 25
  },
  {
    id: 5,
    postId: 2,
    authorName: "Can Yılmaz",
    authorEmail: "can.yilmaz@environmental.org",
    content: "Toplu taşıma kullanımı konusunda tamamen katılıyorum. Hem çevre hem de bütçe dostu. İstanbul'da metro kullanımını artırmak için daha fazla yatırım yapılması gerekiyor. Ayrıca bisiklet yollarının da artırılması çok önemli.",
    timestamp: "2024-03-14T17:05:00Z",
    likes: 19
  },
  {
    id: 6,
    postId: 2,
    authorName: "Elif Şahin",
    authorEmail: "elif.sahin@university.edu",
    content: "Sıfır atık konusunda çok güzel öneriler var. Ben de evde plastik kullanımını minimize etmeye çalışıyorum. Cam şişeler, bez çantalar ve metal pipetler kullanarak gerçekten fark yaratabiliyoruz.",
    timestamp: "2024-03-14T18:30:00Z",
    likes: 14
  }
];

export const siteStats = {
  totalVisits: 15420,
  totalShares: 312,
  monthlyVisits: 3240,
  weeklyVisits: 890,
  dailyVisits: 156
}; 