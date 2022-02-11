import {
  Flex,
  InputGroup,
  Input,
  useColorModeValue,
  InputRightElement,
  IconButton,
} from "@chakra-ui/react";
import { useState, FormEvent, Dispatch } from "react";
import useToast from "../../../components/hooks/useToast";
import { Meme } from "../../../interfaces";

interface Props {
  meme: Meme | undefined;
  setMeme: Dispatch<Meme>;
}

// this component is containing an input and a button with which user can write
// and post a comment
const CreateComment = ({ meme, setMeme }: Props) => {
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);

  const toast = useToast();

  const topBarBg = useColorModeValue("gray.300", "gray.900");
  const inputBackground = useColorModeValue("gray.200", "gray.800");
  const inputVariant = useColorModeValue("outline", "filled");

  const atLeastContainsOneChar = /.*[a-zA-Z0-9].*/gi;

  // for posting a comment
  async function postComment(e: FormEvent<HTMLDivElement>) {
    e.preventDefault();
    setPending(true);

    try {
      const res = await fetch("/comment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: input, memeId: meme?._id }),
      });
      const { comment, message } = await res.json();

      if (res.ok && meme) {
        setPending(false);
        setInput("");
        const updatedMeme = { ...meme, comments: [comment, ...meme.comments] };
        setMeme(updatedMeme);
      } else if (res.status === 401) {
        setPending(false);
        toast({ status: "warning", description: message });
      }
    } catch (err: any) {
      setPending(false);
      toast({ status: "error", description: err.message });
    }
  }

  return (
    <Flex as="form" onSubmit={postComment} alignItems="center" px={5} bg={topBarBg}>
      <InputGroup>
        <Input
          onChange={(event) => setInput(event.target.value)}
          value={input}
          variant={inputVariant}
          bg={inputBackground}
          placeholder="Write a comment"
        />
        <InputRightElement>
          <IconButton
            type="submit"
            disabled={!input.match(atLeastContainsOneChar) || pending}
            aria-label="comment button"
            colorScheme="teal"
            icon={<i className="fas fa-search"></i>}
          />
        </InputRightElement>
      </InputGroup>
    </Flex>
  );
};

export default CreateComment;
