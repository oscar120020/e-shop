import { OrderSummary } from "./cart";
import { IUser } from "./user";

export interface IOrder {
    _id?: string;
    user?: IUser | string;
    orderItems: IOrderItem[];
    address: AddressFormData;
    paymentResult?: string;
    orderSummary: OrderSummary;
    isPaid: boolean;
    paidAt?: string;
    transactionId?: string;
    createdAt?: string;
}

export interface AddressFormData {
    firstName: string;
    lastName: string;
    address: string;
    address2?: string;
    zipCode: string;
    city: string;
    country: string;
    phone: string;
  };

export interface IOrderItem {
    _id: string;
    title: string;
    size: string;
    quantity: number;
    slug: string;
    image: string;
    gender: string;
    price: number;
}