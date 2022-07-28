import { createContext } from 'react'
import { AddressFormData, ICartProduct, OrderSummary } from '../../interfaces';

interface ContextProps {
    cart: ICartProduct[];
    isLoaded: boolean;
    orderSummary: OrderSummary;
    address: AddressFormData;
    addProductToCart: (product: ICartProduct) => void;
    updateQuantity: (product: ICartProduct) => void;
    removeProduct: (product: ICartProduct) => void;
    saveCookieAddress: (value: AddressFormData) => void;
    createOrder: () => Promise<{
        hasError: boolean;
        message: string;
    }>
}

export const CartContext = createContext({} as ContextProps)