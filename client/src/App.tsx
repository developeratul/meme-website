import { BrowserRouter, Switch, Route } from "react-router-dom";
import Nav from "./components/global/Nav";

// pages
import Home from "./pages/Home";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";

const App = () => {
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
