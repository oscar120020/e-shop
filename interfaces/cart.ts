import { ValidSizes, ValidTypes } from "./";

export interface ICartProduct {
  _id: string;
  image: string;
  price: number;
  size?: ValidSizes;
  inStock: number;
  slug: string;
  title: string;
  gender: "men" | "women" | "kid" | "unisex";
  quantity: number;
}

export interface OrderSummary {
  numberOfItems: number;
  subTotal: number;
  tax: number;
  total: number;
}
