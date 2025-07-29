import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useEffect, useReducer } from "react";
import { tesloApi } from "../../baseApi";
import { IUser } from "../../interfaces";
import { AuthContext, authReducer } from "./";

export interface AuthState {
  isLoggedIn: boolean;
  user?: IUser;
}

const INITIAL_STATE: AuthState = {
  isLoggedIn: false,
  user: undefined,
};

interface Props {
  children: JSX.Element | JSX.Element[];
}
export const AuthProvider = ({ children }: Props) => {
  const router = useRouter();
  const [state, dispatch] = useReducer(authReducer, INITIAL_STATE);
  const { data, status } = useSession();

  // useEffect(() => {
  //   checkToken()
  // }, [])

  useEffect(() => {
    if(status === "authenticated"){
      dispatch({type: "Save User", payload: data.user as IUser})
    }
  }, [status, data])

  const checkToken = async() => {
    if(!Cookies.get('token')) return;

    try {
      const { data } = await tesloApi.get('/user/renew');
      const {token, user} = data;

      Cookies.set('token', token);
      dispatch({type: 'Save User', payload: user});
      
    } catch (error) {
      Cookies.remove('token')
    }
  }

  const loginUser = async (
    email: string,
    password: string
  ): Promise<boolean> => {
    try {
      const { data } = await tesloApi.post("/user/login", { email, password });

      const { token, user } = data;
      Cookies.set("token", token);

      dispatch({
        type: "Save User",
        payload: user,
      });
      return true;
    } catch (error) {
      return false;
    }
  };

  const registerUser = async (
    name: string,
    email: string,
    password: string
  ): Promise<{ hasError: boolean; message?: string }> => {
    try {
      const { data } = await tesloApi.post("/user/register", {
        name,
        email,
        password,
      });

      const { token, user } = data;
      Cookies.set("token", token);
      dispatch({ type: "Save User", payload: user });
      return {
        hasError: false,
      };
    } catch (error) {
      if (axios.isAxiosError(error) && error instanceof AxiosError) {
        return {
          hasError: true,
          message: error.response?.data.message,
        };
      }
      return {
        hasError: true,
        message: "No se pudo crear el usuario - intente de nuevo",
      };
    }
  };

  const logoutUser = () => {
    Cookies.remove('cart');
    Cookies.remove('address-data');
    
    signOut();
  }

  return (
    <AuthContext.Provider
      value={{
        ...state,

        logoutUser,
        loginUser,
        registerUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
