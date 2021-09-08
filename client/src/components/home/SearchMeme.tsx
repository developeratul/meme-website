import {
  Input,
  InputGroup,
  InputRightElement,
  IconButton,
  Box,
  useColorModeValue,
} from "@chakra-ui/react";

const SearchMeme = () => {
  const inputVariant = useColorModeValue("outline", "filled");

  return (
    <Box>
      <InputGroup>
        <Input placeholder="Search memes..." variant={inputVariant} />
        <InputRightElement>
          <IconButton
            aria-label="search button"
            colorScheme="teal"
            icon={<i className="fas fa-search"></i>}
          />
        </InputRightElement>
      </InputGroup>
    </Box>
  );
};

export default SearchMeme;
