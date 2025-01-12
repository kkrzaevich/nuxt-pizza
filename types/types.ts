export type Page = {
  name: string;
  link: string;
};

export type PayMethod = "card-online" | "card-on-delivery" | "cash";

export type CartItem = {
  heading: string;
  description: string;
  price: number;
  weight: number;
  ingredients: string;
  src: string;
  amount?: number;
};

export type MenuItem = {
  created_at?: string;
  description: string | null;
  heading?: string | null;
  id?: number;
  ingredients: string | null;
  itemType?: string | null;
  name?: string | null;
  price: number | null;
  src: string | null;
  weight: number | null;
};

export type OrderItem = {
  heading: string;
  amount: number;
  price: number;
};

export type Order = {
  id?: number;
  created_at?: string;
  uuid?: string;
  contents: OrderItem[];
  status: "cooking" | "delivering" | "finished";
  address: string;
  totalPrice: number;
  payMethod: PayMethod;
  name: string;
  phone: string;
};

export type Address = {
  place: string;
  id: number;
  new: boolean;
  deleted: boolean;
  main?: boolean;
};

export interface UserData {
  id?: string;
  name?: string;
  email: string;
  phone: string;
  payMethod?: PayMethod;
  addresses?: Address[];
}

export type userCredentials = {
  email: string;
  password: string;
  username: string;
  phone: string;
  address: string;
};

export type StatusClass = "success" | "error" | "pending" | "";
