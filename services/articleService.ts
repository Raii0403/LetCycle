import { fetchJson } from "@/services/api";
import type { Article, PostApi, PostsApiResponse } from "@/types/article";

// Mengubah satu kiriman API menjadi artikel untuk ditampilkan di aplikasi.
function mapPostToArticle(post: PostApi): Article {
  const wordCount = post.body.trim().split(/\s+/).filter(Boolean).length;
  const readMinutes = Math.max(1, Math.ceil(wordCount / 200));

  return {
    id: String(post.id),
    category: post.tags[0] || "Edukasi",
    publishedAt: "Terbaru",
    readTime: `${readMinutes} mnt`,
    title: post.title,
    icon: "newspaper-outline",
    color: ["#45C985", "#0E9B71"],
  };
}

// Mengambil daftar artikel dan mengembalikan pesan error yang mudah dipahami.
export function getArticles(): Promise<Article[]> {
  return fetchJson<PostsApiResponse>("https://dummyjson.com/posts?limit=10")
    .then((response) => response.posts)
    .then((posts) => posts.map(mapPostToArticle))
    .catch((error: unknown) => {
      if (typeof error === "string") {
        return Promise.reject(error);
      }
      if (error instanceof Error) {
        return Promise.reject(`Gagal memuat artikel: ${error.message}`);
      }
      return Promise.reject("Gagal memuat artikel.");
    });
}
