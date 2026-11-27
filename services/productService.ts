import { delay } from "@/utils/delay";
import { fetchJson } from "@/services/api";
import {
  deleteListing,
  fetchListings,
  insertListing,
} from "@/services/listingService";
import type { ListingRow } from "@/types/listing";
import type { Product } from "@/data/marketplace";
import type { ProductsApiResponse } from "@/types/product";
import type { SellersApiResponse } from "@/types/user";

// Kategori barang yang cocok dijual kembali / didaur ulang antar pengguna.
const CATEGORIES = ["furniture", "home-decoration", "kitchen-accessories"];

export const categoryLabels: Record<string, string> = {
  furniture: "Furnitur",
  "home-decoration": "Dekorasi",
  "kitchen-accessories": "Dapur",
};

export const CONDITIONS = ["Bekas Layak Pakai", "Seperti Baru", "Hasil Daur Ulang"];

export interface NewProductInput {
  name: string;
  price: string;
  category: string;
  condition: string;
  sellerName: string;
  city: string;
}

// Menambahkan barang baru. resolve() jika data valid, reject() jika tidak.
export function addProduct(input: NewProductInput): Promise<Product> {
  return new Promise<Product>((resolve, reject) => {
    const price = Number(input.price.replace(/\D/g, ""));
    if (!input.name.trim()) {
      reject("Nama barang wajib diisi.");
      return;
    }
    if (price <= 0) {
      reject("Harga harus berupa angka lebih dari 0.");
      return;
    }
    if (!input.sellerName.trim() || !input.city.trim()) {
      reject("Nama penjual dan kota wajib diisi.");
      return;
    }

    insertListing({
      name: input.name.trim(),
      price,
      category: input.category,
      condition: input.condition,
      seller_name: input.sellerName.trim(),
      city: input.city.trim(),
      // Belum ada fitur unggah foto, jadi memakai gambar placeholder.
      thumbnail: `https://picsum.photos/seed/${encodeURIComponent(input.name.trim())}/400`,
    })
      .then((row) => {
        const product = listingToProduct(row);
        cachedProducts = [product, ...(cachedProducts ?? [])];
        resolve(product);
      })
      .catch((err: unknown) =>
        reject(err instanceof Error ? err.message : "Gagal menambahkan barang."),
      );
  });
}
const CITIES = ["Purwokerto", "Banyumas", "Purbalingga", "Cilacap", "Sokaraja"];

let cachedProducts: Product[] | null = null;

function listingToProduct(row: ListingRow): Product {
  return {
    id: row.id,
    name: row.name,
    price: row.price,
    category: row.category,
    condition: row.condition,
    sellerName: row.seller_name,
    city: row.city,
    thumbnail: row.thumbnail,
    ownerId: row.user_id,
  };
}

// Menghapus jualan milik user dari Supabase dan dari cache lokal.
export async function removeProduct(id: string): Promise<void> {
  await deleteListing(id);
  cachedProducts = (cachedProducts ?? []).filter((p) => p.id !== id);
}

// Mengambil barang dan penjual dari API sekaligus, lalu menggabungkannya menjadi iklan.
export async function getProducts(forceRefresh = false): Promise<Product[]> {
  if (forceRefresh) cachedProducts = null;
  if (cachedProducts) {
    return Promise.resolve(cachedProducts);
  }

  const [sellers, categoryResponses, listings] = await Promise.all([
    fetchJson<SellersApiResponse>(
      "https://dummyjson.com/users?limit=30&select=firstName,lastName",
    ),
    Promise.all(
      CATEGORIES.map((category) =>
        fetchJson<ProductsApiResponse>(
          `https://dummyjson.com/products/category/${category}?limit=8`,
        ),
      ),
    ),
    // Jualan milik user dari Supabase (dibatasi RLS).
    fetchListings(),
  ]);
  if (!forceRefresh) await delay(1000);

  const items = categoryResponses.flatMap((response) => response.products);

  const products: Product[] = items.map((item, index): Product => {
    const seller = sellers.users[index % sellers.users.length];
    return {
      id: String(item.id),
      name: item.title,
      // Harga dummy dalam USD dikonversi menjadi harga barang bekas dalam rupiah.
      price: Math.round((item.price * 500) / 1000) * 1000,
      category: item.category,
      condition: CONDITIONS[index % CONDITIONS.length],
      sellerName: `${seller.firstName} ${seller.lastName}`,
      city: CITIES[index % CITIES.length],
      thumbnail: item.thumbnail,
    };
  });

  const all = [...listings.map(listingToProduct), ...products];
  cachedProducts = all;
  return all;
}
