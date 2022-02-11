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

// the signin page
const Signin = () => {
  const [input, setInput] = useState({ email: "", password: "" });
  const [pending, setPending] = useState(false);
  const { dispatch } = useContext(AuthContext);
  const { email, password } = input;
  const toast = useToast();
  const history = useHistory();

  const formBackground = useColorModeValue("gray.50", "gray.700");
  const formVariant = useColorModeValue("outline", "filled");
  const formHeadingColor = useColorModeValue("teal.500", "teal.200");

  // Handling the input change
  function HandleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setInput((pre) => ({ ...pre, [name]: value }));
  }

  // for signing in the user with current information's stored in the input state
  async function signinUser() {
    toast({ status: "info", description: "Working on it..." });
    setPending(true);

    try {
      const res = await fetch("/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const body = await res.json();

      if (res.ok) {
        setPending(false);
        dispatch({ type: "LOGIN", payload: body.user });
        history.push("/");
        toast({ status: "success", description: body.message });
      } else if (res.status === 400) {
        setPending(false);
        toast({ description: body.message, status: "error" });
      }
    } catch (err: any) {
      setPending(false);
      toast({ status: "error", description: err.message });
    }
  }

  // for validating the input information's when user clicks on the signin button
  function ValidateInputInfos() {
    const validations = {
      allFields: email && password,
      emailValid: validator.isEmail(email),
    };
    const { allFields, emailValid } = validations;

    if (!allFields) {
      toast({ status: "error", description: "Please fill all the field properly" });
    } else if (!emailValid) {
      toast({ status: "error", description: "Your email is invalid" });
    } else if (allFields && emailValid) {
      signinUser();
    }
  }

  useEffect(() => {
    document.title = "MEME Site / Signin";
  }, []);

  return (
    <div className="signup_page">
      <Container
        maxW="450px"
        display="flex"
        marginY="50"
        alignSelf="center"
        justifySelf="center"
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
            Sign in
          </Heading>

          <InputGroup>
            <InputLeftAddon children={<i className="far fa-envelope"></i>} />
            <Input
              name="email"
              value={email}
              onChange={HandleInputChange}
              variant={formVariant}
              type="email"
              placeholder="Enter your email"
              mb={3}
            />
          </InputGroup>
          <InputGroup>
            <InputLeftAddon children={<i className="fas fa-key"></i>} />
            <Input
              name="password"
              onChange={HandleInputChange}
              value={password}
              variant={formVariant}
              type="password"
              placeholder="Enter your password"
              mb={3}
            />
          </InputGroup>

          <Button
            disabled={pending}
            onClick={ValidateInputInfos}
            fontWeight="normal"
            colorScheme="teal"
          >
            Sign in
          </Button>
        </Flex>
      </Container>
    </div>
  );
};

export default Signin;
