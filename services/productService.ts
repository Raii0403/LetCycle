import { delay } from "@/utils/delay";
import { fetchJson } from "@/services/api";
import type { Product } from "@/data/marketplace";
import type { ProductsApiResponse } from "@/types/product";

let cachedProducts: Product[] | null = null;

// Mengambil produk dari API, memberi jeda agar loading terlihat, lalu mengubah bentuk datanya.
export async function getProducts(): Promise<Product[]> {
  if (cachedProducts) {
    return Promise.resolve(cachedProducts);
  }

  const response = await fetchJson<ProductsApiResponse>(
    "https://dummyjson.com/products?limit=20",
  );
  await delay(1000);

  const products: Product[] = response.products.map(
    (product): Product => ({
      id: String(product.id),
      name: product.title,
      price: product.price,
      stock: product.stock,
      icon: "leaf-outline",
    }),
  );

  cachedProducts = products;
  return products;
}
