import React, { useEffect, useReducer } from "react";
import { AddressFormData, ICartProduct, IOrder, OrderSummary } from "../../interfaces";
import { CartContext, cartReducer } from "./";
import Cookie from "js-cookie";
import Cookies from "js-cookie";
import { tesloApi } from "../../api";
import axios, { AxiosError } from "axios";

export interface CartState {
  cart: ICartProduct[];
  isLoaded: boolean;
  orderSummary: OrderSummary;
  address: AddressFormData;
}

const INITIAL_STATE: CartState  = {
  cart: [],
  isLoaded: false,
  orderSummary: {
    numberOfItems: 0,
    subTotal: 0,
    tax: 0,
    total: 0
  },
  address: {
    firstName: '',
    lastName: '',
    address: '',
    address2: '',
    zipCode: '',
    city: '',
    country: '',
    phone: ''
  }
};

interface Props {
  children: JSX.Element | JSX.Element[];
}
export const CartProvider = ({ children }: Props) => {
  const [state, dispatch] = useReducer(cartReducer, INITIAL_STATE);

  useEffect(() => {
    try {
      const cookieProducts: ICartProduct[] = Cookie.get("cart")
        ? JSON.parse(Cookie.get("cart")!)
        : [];
      dispatch({ type: "Load Cart", payload: cookieProducts });
    } catch (error) {
      dispatch({ type: "Load Cart", payload: [] });
    }
  }, []);

  useEffect(() => {
    const savedAddressData: AddressFormData = JSON.parse(Cookies.get('address-data') || JSON.stringify(INITIAL_STATE.address));
    dispatch({type: "Save Address Data", payload: savedAddressData})
  }, []);

  useEffect(() => {
    if (state.cart.length > 0) {
      Cookie.set("cart", JSON.stringify(state.cart));
    }
  }, [state.cart]);

  useEffect(() => {

    const numberOfItems = state.cart.reduce((prev, current) => current.quantity + prev, 0);
    const subTotal = state.cart.reduce((prev, current) => (current.price * current.quantity) + prev, 0);
    const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE || 0);
    const total = subTotal * (taxRate + 1);
    
    const orderSummary: OrderSummary = {
      numberOfItems,
      subTotal,
      tax: subTotal * taxRate,
      total
    }

    dispatch({type: "Update Order Summary", payload: orderSummary})
    
  }, [state.cart]);

  const saveCookieAddress = (value: AddressFormData) => {
    dispatch({type: "Save Address Data", payload: value})
  }

  const addProductToCart = (product: ICartProduct) => {
    const productExist = state.cart.some((p) => p._id === product._id);
    if (!productExist)
      return dispatch({
        type: "Update Products",
        payload: [...state.cart, product],
      });

    const hasSameSize = state.cart.some(
      (p) => p._id === product._id && p.size === product.size
    );
    if (!hasSameSize)
      return dispatch({
        type: "Update Products",
        payload: [...state.cart, product],
      });

    const newProducts = state.cart.map((p) => {
      if (p._id !== product._id) return p;
      if (p.size !== product.size) return p;

      p.quantity += product.quantity;
      return p;
    });
    dispatch({ type: "Update Products", payload: newProducts });
  };

  const updateQuantity = (product: ICartProduct) => {
    dispatch({ type: "Update Product Quantity", payload: product });
  };

  const removeProduct = (product: ICartProduct) => {
    dispatch({type: "Remove Product", payload: product})
  };

  const createOrder = async(): Promise<{ hasError: boolean, message: string }> => {
    if(!state.address){
      throw new Error("No hay direccion")
    }

    const body: IOrder = {
      orderItems: state.cart.map(({inStock, ...p}) => ({...p, size: p.size!})),
      address: state.address,
      orderSummary: state.orderSummary,
      isPaid: false,

    }

    try {
      const { data } = await tesloApi.post('/orders', body)
      
      dispatch({type: "Complete Order"})
      Cookie.remove("cart");

      return {
        hasError: false,
        message: data._id
      }

    } catch (error) {
      console.log(error);
      if (axios.isAxiosError(error) && error instanceof AxiosError) {
        return {
          hasError: true,
          message: error.response?.data.message,
        };
      }
      return {
        hasError: true,
        message: "No se pudo crear la orden",
      };
    }
  }

  return (
    <CartContext.Provider
      value={{
        ...state,
        addProductToCart,
        updateQuantity,
        removeProduct,
        saveCookieAddress,
        createOrder
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
