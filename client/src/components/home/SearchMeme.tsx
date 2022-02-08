import {
  Input,
  InputGroup,
  InputRightElement,
  IconButton,
  Box,
  useColorModeValue,
} from "@chakra-ui/react";
import { useContext, useState } from "react";
import { MemeContext } from "../../providers/MemeProvider";

const SearchMeme = () => {
  const { dispatch } = useContext(MemeContext);
  const [input, setInput] = useState("");
  const inputVariant = useColorModeValue("outline", "filled");

  async function searchMeme() {
    try {
      const res = await fetch(`/meme?search=${input}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const body = await res.json();

      if (res.ok) {
        dispatch({ type: "GET_MEMES", payload: body.memes || [] });
      }
    } catch (err: any) {
      console.log(err.message || err);
    }
  }

  return (
    <Box>
      <InputGroup>
        <Input
          placeholder="Search memes..."
          type="search"
          onChange={(event) => setInput(event.target.value)}
          value={input}
          variant={inputVariant}
        />
        <InputRightElement>
          <IconButton
            onClick={searchMeme}
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
