export interface ProductApi {
  id: number;
  title: string;
  price: number;
  category: string;
  thumbnail: string;
}

export interface ProductsApiResponse {
  products: ProductApi[];
}
