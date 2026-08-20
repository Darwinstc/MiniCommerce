export interface ApiUser {
  id: number;
  name: string;
  email: string;
}

export interface AuthResponse {
  token: string;
  user: ApiUser;
}

export interface ApiProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
}

export interface ApiReview {
  id: number;
  userId: number;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface ApiOrder {
  id: number;
  total: number;
  status: string;
  createdAt: string;
}
