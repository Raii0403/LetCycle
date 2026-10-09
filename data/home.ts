export const collectionPoints = [
  {
    name: 'TPS Purwokerto Sejahtera',
    address: 'Jl. Jenderal Sudirman No. 45, Purwokerto',
    phone: '(0281) 635 120',
    distance: '1,2 km',
  },
  {
    name: 'Bank Sampah Hijau Banyumas',
    address: 'Jl. Gerilya Timur No. 18, Purwokerto',
    phone: '(0281) 641 208',
    distance: '2,4 km',
  },
];

export const wasteCategories = [
  {
    name: 'Kertas & Kardus',
    price: 'Rp 2.500',
    icon: 'document-text-outline',
    color: '#F5E8D4',
  },
  {
    name: 'Logam & Kaleng',
    price: 'Rp 8.000',
    icon: 'cube-outline',
    color: '#E9EDE5',
  },
  {
    name: 'Plastik',
    price: 'Rp 1.500',
    icon: 'water-outline',
    color: '#DDF0EA',
  },
  {
    name: 'Alat Elektronik',
    price: 'Rp 12.000',
    icon: 'hardware-chip-outline',
    color: '#E8E8D8',
  },
] as const;

export const articleFilters = [
  'Semua',
  'Tips Pilah Sampah',
  'Update TPS',
  'Edukasi',
] as const;

export const articles = [
  {
    category: 'Tips Pilah Sampah',
    publishedAt: '3 jam lalu',
    readTime: '4 mnt',
    title: 'Cara Memilah Plastik Agar Bernilai Jual Tinggi',
    icon: 'water-outline',
    color: ['#45C985', '#0E9B71'],
  },
  {
    category: 'Update TPS',
    publishedAt: '1 hari lalu',
    readTime: '3 mnt',
    title: 'Jadwal Penjemputan Sampah Akbar Wilayah Purwokerto Minggu Ini',
    icon: 'business-outline',
    color: ['#45C7AA', '#078E79'],
  },
  {
    category: 'Edukasi',
    publishedAt: '2 hari lalu',
    readTime: '5 mnt',
    title: 'Kenali Perbedaan Sampah Organik dan Anorganik',
    icon: 'leaf-outline',
    color: ['#9ACD63', '#3E9A53'],
  },
] as const;

export const recyclingFact =
  'Mendaur ulang satu botol plastik dapat menghemat energi yang cukup untuk menyalakan lampu selama 3 jam.';
