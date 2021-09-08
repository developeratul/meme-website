import { Grid, Container } from "@chakra-ui/react";

import CreateMeme from "../components/home/CreateMeme";
import SearchMeme from "../components/home/SearchMeme";
import { useEffect } from "react";
import Memes from "../components/home/Memes";

// the home page
const Home = () => {
  useEffect(() => {
    document.title = "MEME Site / Memes";
  }, []);

  return (
    <>
      {/* the top bar containing the search bar and create meme button and the modal */}
      <Container maxW="container.lg" pt={10} pb={20}>
        <Grid
          gridColumnGap={["0", "1.5", "1.5", "1.5"]}
          templateRows={["1fr 1fr", "0", "0", "0"]}
          gridRowGap="2"
          templateColumns={["1fr", "3fr 1fr", "3fr 1fr", "4fr 1fr"]}
        >
          <SearchMeme />
          <CreateMeme />
        </Grid>
      </Container>

      <Memes />
    </>
  );
};

export default Home;
