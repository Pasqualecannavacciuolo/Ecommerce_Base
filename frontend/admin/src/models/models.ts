import { JwtPayload } from "jwt-decode";

export interface IJWTPayloadExtension extends JwtPayload {
  userToSignJWT: {
    name: string;
    email: string;
  };
}

export interface SimpleProduct {
  id: number;
  product_name: string;
  description: string;
  price: number;
  status: string;
  variants: any;
}

export interface Product {
  order_id: number;
  product_id: number;
  quantity: number;
  product: {
    id: number;
    product_name: string;
    description: string;
    price: number;
  };
}

export interface Order {
  id: number;
  user_id: number;
  status: string;
  total: number;
  products: Product[];
  createdAt: Date;
}

export interface User {
  name: string;
  email: string;
}
