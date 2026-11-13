export interface User {
  id: number;
  firstName: string;
  lastName: string;
}

// Data ringkas pengguna yang dipakai sebagai penjual di marketplace.
export interface SellerApi {
  id: number;
  firstName: string;
  lastName: string;
}

export interface SellersApiResponse {
  users: SellerApi[];
}
