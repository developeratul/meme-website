import React, { createContext, useReducer } from "react";
import { User } from "../interfaces";

// interface for the initial state which will be used in the reducer
interface initialStateInterface {
  isAuthenticated: boolean;
  user: User | null;
}

// the initialState for the reducer
const initialState: initialStateInterface = {
  isAuthenticated: false,
  user: null,
};

// the reducer
const reducer = (state: initialStateInterface = initialState, action: any) => {
  switch (action.type) {
    case "LOGIN": {
      return {
        isAuthenticated: true,
        user: action.payload,
      };
    }

    case "LOGOUT": {
      return {
        isAuthenticated: false,
        user: null,
      };
    }

    default:
      return state;
  }
};

// interface for the authContext
interface AuthContextInterface {
  state: initialStateInterface;
  dispatch: React.Dispatch<any>;
}

export const AuthContext = createContext<AuthContextInterface>({
  state: initialState,
  dispatch: () => null,
});

export const AuthProvider: React.FC = ({ children }): React.ReactElement => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return <AuthContext.Provider value={{ state, dispatch }}>{children}</AuthContext.Provider>;
};
