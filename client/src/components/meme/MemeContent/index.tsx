import { useColorModeValue } from "@chakra-ui/color-mode";
import { Box, Grid, Heading } from "@chakra-ui/layout";
import { Dispatch } from "react";

// interfaces
import { Meme } from "../../../interfaces";

// components
import TopBar from "./TopBar";
import CommentSection from "./CommentSection";
import CreateComment from "./CreateComment";

interface Props {
  meme: Meme | undefined;
  setMeme: Dispatch<Meme>;
}

// this component is containing all the meme contents, like the author's profile url
// avatar like count comments etc
const MemeContent = ({ meme, setMeme }: Props) => {
  const memeTitleColor = useColorModeValue("gray.600", "gray.300");

  return (
    <Grid height="500px" templateRows="70px 1fr 70px" gridColumn={["1 / -1", "1 / -1", "8 / -1", "8 / -1"]}>
      {/* contains the like button and user related info's */}
      <TopBar meme={meme} setMeme={setMeme} />

      <Box overflowX="hidden" p={3}>
        <Heading mb={10} fontSize="1xl" fontWeight="medium" color={memeTitleColor}>
          {meme?.title}
        </Heading>

        <Heading fontSize="xl" fontWeight="medium" mb={5}>
          Comments ({meme?.comments.length})
        </Heading>

        {/* all comments will be showcased here */}
        <CommentSection meme={meme} setMeme={setMeme} />
      </Box>

      {/* user can post a comment from here */}
      <CreateComment meme={meme} setMeme={setMeme} />
    </Grid>
  );
};

export default MemeContent;
