import { IconButton, Heading, useColorMode, Tooltip, Avatar, useToast } from "@chakra-ui/react";
import { Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react";
import { useContext, useRef } from "react";
import { Link, NavLink, useHistory } from "react-router-dom";
import { AuthContext } from "../../providers/AuthProvider";

// the global nav bar on the top
const Nav = () => {
  const { toggleColorMode, colorMode } = useColorMode();
  const { state, dispatch } = useContext(AuthContext);
  const toast = useToast({ position: "top", variant: "solid", isClosable: true });
  const { user } = state;
  const barsRef = useRef<HTMLDivElement>(null);
  const listNavRef = useRef<HTMLUListElement>(null);
  const history = useHistory();

  function ToggleNav() {
    const bars = barsRef.current;
    const listNav = listNavRef.current;

    if (bars && listNav) {
      listNav.classList.toggle("nav-active");
      bars.classList.toggle("toggle");
    }
  }

  async function LogoutUser() {
    try {
      const res = await fetch("/auth/logout", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const body = await res.json();

      if (res.ok) {
        dispatch({ type: "LOGOUT" });
        history.push("/");
        toast({ title: body.message, status: "success" });
      }
    } catch (err) {}
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
        {state.isAuthenticated && user ? (
          <>
            <li>
              <Menu>
                <MenuButton>
                  <Avatar size="sm" src={user.photoUrl} name={user.name} />
                </MenuButton>
                <MenuList>
                  <MenuItem as={Link} to={`/profile/${user._id}`}>
                    View Profile
                  </MenuItem>
                  <MenuItem as={Link} to={`/settings`}>
                    Profile Settings
                  </MenuItem>
                  <MenuItem onClick={LogoutUser}>Log into another account</MenuItem>
                </MenuList>
              </Menu>
            </li>
          </>
        ) : (
          <>
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
          </>
        )}
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
