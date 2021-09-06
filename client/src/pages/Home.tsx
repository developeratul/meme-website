import { Grid, Container } from "@chakra-ui/react";
import CreateMeme from "../components/home/CreateMeme";
import SearchMeme from "../components/home/SearchMeme";

// the home page
const Home = () => {
  return (
    <Container maxW="container.lg" paddingY="30px">
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
  );
};

export default Home;
