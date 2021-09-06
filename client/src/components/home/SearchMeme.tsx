import { Input, InputGroup, InputRightElement, Button } from "@chakra-ui/react";

const SearchMeme = () => {
  return (
    <div className="search_meme">
      <InputGroup>
        <Input placeholder="Search memes..." variant="filled" />
        <InputRightElement>
          <Button colorScheme="teal">
            <i className="fas fa-search"></i>
          </Button>
        </InputRightElement>
      </InputGroup>
    </div>
  );
};

export default SearchMeme;
