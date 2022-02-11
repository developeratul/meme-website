import {
  Flex,
  Heading,
  Input,
  Button,
  useColorModeValue,
  InputGroup,
  InputLeftAddon,
  Container,
} from "@chakra-ui/react";
import { ChangeEvent, useContext, useEffect, useState } from "react";
import { useHistory } from "react-router";
import validator from "validator";
import useToast from "../components/hooks/useToast";
import { AuthContext } from "../providers/AuthProvider";

// the signup page
const Signup = () => {
  const [input, setInput] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    portfolio: "",
  });
  const [pending, setPending] = useState(false);
  const { dispatch } = useContext(AuthContext);
  const { name, email, password, confirmPassword, portfolio } = input;
  const toast = useToast();
  const history = useHistory();

  const formBackground = useColorModeValue("gray.50", "gray.700");
  const formVariant = useColorModeValue("outline", "filled");
  const formHeadingColor = useColorModeValue("teal.500", "teal.200");

  // for handling input change
  function HandleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setInput((pre) => ({ ...pre, [name]: value }));
  }

  // for signing up a new user with current information's in the input state
  async function signupUser() {
    toast({ title: "info", description: "working on it", status: "info" });
    setPending(true);

    try {
      const res = await fetch("/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name, email, password, portfolio }),
      });
      const body = await res.json();

      if (res.ok) {
        history.push("/");
        dispatch({ type: "LOGIN", payload: body.user });
        setPending(false);
        toast({ description: body.message, status: "success" });
      } else if (res.status === 400) {
        setPending(false);
        toast({ description: body.message, status: "error" });
      }
    } catch (err: any) {
      setPending(false);
      toast({ description: err.message || err });
    }
  }

  // for validating the input information's
  function ValidateInputInfos() {
    const validations = {
      allFields: name && email && password && confirmPassword && portfolio,
      emailOk: validator.isEmail(email),
      passwordLength: password.length >= 8,
      passwordMatched: password === confirmPassword,
    };
    const { allFields, emailOk, passwordLength, passwordMatched } = validations;

    if (!allFields) {
      toast({ status: "error", description: "please fill all the field's properly" });
    } else if (!emailOk) {
      toast({ status: "error", description: "Your email is invalid" });
    } else if (!passwordLength) {
      toast({ status: "error", description: "password must have 8 chars" });
    } else if (!passwordMatched) {
      toast({ status: "error", description: "make sure password's are matching" });
    } else if (allFields && passwordMatched) {
      signupUser();
    }
  }

  useEffect(() => {
    document.title = "MEME Site / Signup";
  }, []);

  return (
    <div className="signup_page">
      <Container
        maxW="450px"
        marginY="50"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Flex
          w="100%"
          boxShadow="lg"
          direction="column"
          background={formBackground}
          p={[7, 10, 10, 10]}
          rounded={5}
        >
          <Heading color={formHeadingColor} textAlign="center" mb={5} fontSize="xx-large">
            Sign up
          </Heading>

          <InputGroup>
            <InputLeftAddon children={<i className="far fa-user"></i>} />
            <Input
              onChange={HandleInputChange}
              value={name}
              name="name"
              variant={formVariant}
              type="text"
              placeholder="Enter your name"
              mb={3}
            />
          </InputGroup>
          <InputGroup>
            <InputLeftAddon children={<i className="far fa-envelope"></i>} />
            <Input
              onChange={HandleInputChange}
              value={email}
              name="email"
              variant={formVariant}
              type="email"
              placeholder="Enter your email"
              mb={3}
            />
          </InputGroup>
          <InputGroup>
            <InputLeftAddon children={<i className="fas fa-key"></i>} />
            <Input
              onChange={HandleInputChange}
              value={password}
              name="password"
              variant={formVariant}
              type="password"
              placeholder="Enter password"
              mb={3}
            />
          </InputGroup>
          <InputGroup>
            <InputLeftAddon children={<i className="fas fa-key"></i>} />
            <Input
              onChange={HandleInputChange}
              value={confirmPassword}
              name="confirmPassword"
              variant={formVariant}
              type="password"
              placeholder="Confirm password"
              mb={3}
            />
          </InputGroup>
          <InputGroup>
            <InputLeftAddon children={<i className="fas fa-blog"></i>} />
            <Input
              onChange={HandleInputChange}
              value={portfolio}
              name="portfolio"
              variant={formVariant}
              type="text"
              placeholder="Link to your portfolio"
              mb={3}
            />
          </InputGroup>

          <Button
            disabled={pending}
            onClick={ValidateInputInfos}
            fontWeight="normal"
            colorScheme="teal"
          >
            Sign up
          </Button>
        </Flex>
      </Container>
    </div>
  );
};

export default Signup;
