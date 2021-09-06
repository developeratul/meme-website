import { Input, InputGroup, InputRightElement, IconButton, Box } from "@chakra-ui/react";

const SearchMeme = () => {
  return (
    <Box>
      <InputGroup>
        <Input placeholder="Search memes..." variant="filled" />
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
