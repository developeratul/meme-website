import { Flex } from "@chakra-ui/layout";
import { Spinner } from "@chakra-ui/spinner";
import { useContext, useEffect, useState } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Nav from "./components/global/Nav";

// pages
import Home from "./pages/Home";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import { AuthContext } from "./providers/AuthProvider";

const App = () => {
  const [pending, setPending] = useState(true);
  const { dispatch, state } = useContext(AuthContext);

  // for verifying if the user is authenticated
  async function checkAuth(abortController: AbortController) {
    try {
      const res = await fetch("/auth/", {
        method: "GET",
        signal: abortController.signal,
        headers: { "Content-Type": "application/json" },
      });
      const body = await res.json();

      if (typeof res.status === "number") {
        setPending(false);
      }

      if (res.ok) {
        dispatch({ type: "LOGIN", payload: body.user });
      } else if (res.status === 401) {
        dispatch({ type: "LOGOUT" });
      }
    } catch (err) {
      dispatch({ type: "LOGOUT" });
    }
  }

  useEffect(() => {
    const abortController = new AbortController();

    checkAuth(abortController);

    return () => abortController.abort();
  }, [state.user]);

  // the loader which will be shown till the response end's
  if (pending) {
    return (
      <Flex height="100vh" justifyContent="center" alignItems="center">
        <Spinner size="lg" colorScheme="teal" />
      </Flex>
    );
  }

  return (
    <BrowserRouter>
      <Nav />
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/signin" component={Signin} />
        <Route path="/signup" component={Signup} />
      </Switch>
    </BrowserRouter>
  );
};

export default App;
