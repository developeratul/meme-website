import {
  Flex,
  Heading,
  Input,
  Button,
  useColorModeValue,
  InputGroup,
  InputLeftAddon,
} from "@chakra-ui/react";

// the signin page
const Signin = () => {
  const formBackground = useColorModeValue("gray.50", "gray.700");
  const formVariant = useColorModeValue("outline", "filled");

  return (
    <div className="signup_page">
      <Flex marginY="50" marginX="5px" justifyContent="center" alignItems="center">
        <Flex width="400px" direction="column" background={formBackground} p={10} rounded={5}>
          <Heading color="teal" textAlign="center" mb={5} fontSize="xx-large">
            Sign in
          </Heading>

          <InputGroup>
            <InputLeftAddon children={<i className="far fa-envelope"></i>} />
            <Input variant={formVariant} type="email" placeholder="Enter your email" mb={3} />
          </InputGroup>
          <InputGroup>
            <InputLeftAddon children={<i className="fas fa-key"></i>} />
            <Input variant={formVariant} type="password" placeholder="Enter your password" mb={3} />
          </InputGroup>

          <Button fontWeight="normal" colorScheme="teal">
            Sign in
          </Button>
        </Flex>
      </Flex>
    </div>
  );
};

export default Signin;
