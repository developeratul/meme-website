import React, { createContext, useReducer } from "react";

const initialState: any[] = [];

const reducer = (state = initialState, action: any) => {
  switch (action.type) {
    case "GET_MEMES": {
      return action.payload;
    }

    case "UPLOAD_MEME": {
      return [action.payload, ...state];
    }

    case "DELETE_MEME": {
      return state.filter((i) => i._id !== action.payload._id);
    }

    default: {
      return state;
    }
  }
};

interface MemeContextInterface {
  state: any[];
  dispatch: React.Dispatch<any>;
}

export const MemeContext = createContext<MemeContextInterface>({
  state: initialState,
  dispatch: () => null,
});

export const MemeProvider: React.FC = ({ children }): React.ReactElement => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return <MemeContext.Provider value={{ state, dispatch }}>{children}</MemeContext.Provider>;
};
