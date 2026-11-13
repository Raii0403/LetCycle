import { Linking } from "react-native";

// Membuka Google Maps (aplikasi atau browser) dengan rute ke koordinat tujuan.
export function openDirections(latitude: number, longitude: number) {
  return Linking.openURL(
    `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`,
  );
}

// Mencari tempat pengumpulan sampah di sekitar lokasi lewat Google Maps.
export function openCollectionSearch() {
  return Linking.openURL(
    "https://www.google.com/maps/search/?api=1&query=tempat+pengumpulan+sampah+Purwokerto",
  );
}
