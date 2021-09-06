import "./styles/global/global.css";
import ReactDOM from "react-dom";
import React from "react";
import App from "./App";
import { extendTheme } from "@chakra-ui/react";
import { createBreakpoints } from "@chakra-ui/theme-tools";

// providers
import { AuthProvider } from "./providers/AuthProvider";
import { ChakraProvider } from "@chakra-ui/react";

const config = {
  initialColorMode: localStorage.getItem("chakra-ui-color-mode")?.replaceAll('"', "") || "dark",
  useSystemColorMode: false,
  breakPoints: createBreakpoints({
    sm: "414px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
  }),
};
const theme = extendTheme({ config });

ReactDOM.render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ChakraProvider>
  </React.StrictMode>,
  document.querySelector("#root")
);
