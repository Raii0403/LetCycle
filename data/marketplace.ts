import { Ionicons } from "@expo/vector-icons";

export interface Product {
  readonly id: string;
  name: string;
  price: number; // per kg
  stock?: number;
  icon: keyof typeof Ionicons.glyphMap;
}

export const products: Product[] = [
  {
    id: "1",
    name: "Kertas & Kardus",
    price: 2500,
    stock: 120,
    icon: "document-text-outline",
  },
  {
    id: "2",
    name: "Logam & Kaleng",
    price: 8000,
    stock: 45,
    icon: "cube-outline",
  },
  {
    id: "3",
    name: "Plastik PET",
    price: 1500,
    stock: 300,
    icon: "water-outline",
  },
  {
    id: "4",
    name: "Alat Elektronik",
    price: 12000,
    icon: "hardware-chip-outline",
  },
  {
    id: "5",
    name: "Kaca & Botol",
    price: 500,
    stock: 80,
    icon: "wine-outline",
  },
];

export function formatRupiah(angka: number): string {
  return "Rp " + angka.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}
