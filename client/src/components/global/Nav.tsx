import { IconButton, Heading, useColorMode, Tooltip } from "@chakra-ui/react";
import { useRef } from "react";
import { Link, NavLink } from "react-router-dom";

// the global nav bar
const Nav = () => {
  const { toggleColorMode, colorMode } = useColorMode();
  const barsRef = useRef<HTMLDivElement>(null);
  const listNavRef = useRef<HTMLUListElement>(null);

  function ToggleNav() {
    const bars = barsRef.current;
    const listNav = listNavRef.current;

    if (bars && listNav) {
      listNav.classList.toggle("nav-active");
      bars.classList.toggle("toggle");
    }
  }

  return (
    <nav className={colorMode}>
      <Heading fontSize="x-large" className="nav_title">
        <Link to="/">MEME</Link>
      </Heading>

      <ul className="nav_links" ref={listNavRef}>
        <li>
          <NavLink exact activeClassName="nav_link_active" to="/">
            Home
          </NavLink>
        </li>
        <li>
          <NavLink activeClassName="nav_link_active" to="/signup">
            Sign up
          </NavLink>
        </li>
        <li>
          <NavLink activeClassName="nav_link_active" to="/signin">
            Sign in
          </NavLink>
        </li>
        <li>
          <Tooltip
            hasArrow
            label={colorMode === "dark" ? "Light mode" : "Dark Mode"}
            bg="gray.300"
            color="black"
          >
            <IconButton
              colorScheme="teal"
              onClick={toggleColorMode}
              aria-label="Change theme"
              icon={
                colorMode === "dark" ? (
                  <i className="fas fa-sun"></i>
                ) : (
                  <i className="fas fa-moon"></i>
                )
              }
            />
          </Tooltip>
        </li>
      </ul>

      <div onClick={ToggleNav} className="bars" ref={barsRef}>
        <div className="line1 line"></div>
        <div className="line2 line"></div>
        <div className="line3 line"></div>
      </div>
    </nav>
  );
};

export default Nav;
