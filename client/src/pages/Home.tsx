import { Grid } from "@chakra-ui/react";
import CreateMeme from "../components/home/CreateMeme";
import SearchMeme from "../components/home/SearchMeme";

// the home page
const Home = () => {
  return (
    <Grid>
      <SearchMeme />
      <CreateMeme />
    </Grid>
  );
};

export default Home;
