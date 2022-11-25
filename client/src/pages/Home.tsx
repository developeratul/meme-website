import { Container, Grid } from "@chakra-ui/react";
import { useEffect } from "react";

// components
import CreateMeme from "../components/home/CreateMeme";
import Memes from "../components/home/Memes";
import SearchMeme from "../components/home/SearchMeme";

// the home page which will showup a search bar and all the memes which were posted
const Home = () => {
  useEffect(() => {
    document.title = "MEME Site / Memes";
  }, []);

  return (
    <>
      {/* the top bar containing the search bar and create meme button and the modal */}
      <Container maxW="container.xl" pt={10} pb={20}>
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

      {/* showcasing all the memes which were posted */}
      <Memes />
    </>
  );
};

export default Home;
