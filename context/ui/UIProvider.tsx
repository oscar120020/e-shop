import React, { useReducer } from "react";
import { UIContext, uiReducer } from "./";

export interface UIState {
  isMenuOpen: boolean;
}

const INITIAL_STATE = {
  isMenuOpen: false,
};

interface Props {
  children: JSX.Element | JSX.Element[];
}
export const UIProvider = ({ children }: Props) => {
  const [state, dispatch] = useReducer(uiReducer, INITIAL_STATE);

  const toggleSideMenu = () => {
    dispatch({ type: "ToggleMenu" });
  };

  return (
    <UIContext.Provider
      value={{
        ...state,

        // methods
        toggleSideMenu,
      }}
    >
      {children}
    </UIContext.Provider>
  );
};
