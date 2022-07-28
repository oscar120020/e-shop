import { IUser } from "../../interfaces";
import { AuthState } from "./AuthProvider";

type actionType = { type: "Save User"; payload: IUser } | { type: "Logout" };

export const authReducer = (
  state: AuthState,
  action: actionType
): AuthState => {
  switch (action.type) {
    case "Save User":
      return {
        ...state,
        isLoggedIn: true,
        user: action.payload,
      };

    case "Logout":
      return {
          ...state,
          isLoggedIn: false,
          user: undefined
      };

    default:
      return state;
  }
};
