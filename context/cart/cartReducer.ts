import { AddressFormData, ICartProduct, OrderSummary } from "../../interfaces";
import { CartState } from "./CartProvider";

type actionType =
  | { type: "Load Cart"; payload: ICartProduct[] }
  | { type: "Update Products"; payload: ICartProduct[] }
  | { type: "Update Product Quantity"; payload: ICartProduct }
  | { type: "Remove Product"; payload: ICartProduct }
  | { type: "Update Order Summary"; payload: OrderSummary }
  | { type: "Save Address Data"; payload: AddressFormData }
  | { type: "Complete Order"}

export const cartReducer = (
  state: CartState,
  action: actionType
): CartState => {
  switch (action.type) {
    case "Load Cart":
      return {
        ...state,
        cart: [...action.payload],
        isLoaded: true
      };
    case "Update Products":
      return {
        ...state,
        cart: [...action.payload],
      };

    case "Update Product Quantity":
      return {
        ...state,
        cart: state.cart.map((product) => {
          if (product._id !== action.payload._id) return product;
          if (product.size !== action.payload.size) return product;

          return action.payload;
        }),
      };

    case "Remove Product":
      return {
        ...state,
        cart: state.cart.filter(
          (product) =>
            product._id !== action.payload._id ||
            product.size !== action.payload.size
        ),
      };

    case "Update Order Summary":
      return {
        ...state,
        orderSummary: action.payload
      }
    
    case "Save Address Data":
      return {
        ...state,
        address: action.payload
      }

    case "Complete Order":
      return {
        ...state,
        cart: [],
        orderSummary: {
          numberOfItems: 0,
          subTotal: 0,
          tax: 0,
          total: 0
        }
      }

    default:
      return state;
  }
};
