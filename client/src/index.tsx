import "./styles/global/global.css";
import ReactDOM from "react-dom";
import React from "react";
import App from "./App";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";

const config = {
  initialColorMode: localStorage.getItem("chakra-ui-color-mode")?.replaceAll('"', "") || "dark",
  useSystemColorMode: false,
};
const theme = extendTheme({ config });

ReactDOM.render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <App />
    </ChakraProvider>
  </React.StrictMode>,
  document.querySelector("#root")
);
