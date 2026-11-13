import type { Ionicons } from "@expo/vector-icons";

export interface PostApi {
  id: number;
  title: string;
  body: string;
  tags: string[];
}

export interface PostsApiResponse {
  posts: PostApi[];
}

export interface Article {
  id: string;
  category: string;
  publishedAt: string;
  readTime: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: readonly [string, string];
}
