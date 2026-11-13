export interface ProductApi {
  id: number;
  title: string;
  price: number;
  stock: number;
}

export interface ProductsApiResponse {
  products: ProductApi[];
}
