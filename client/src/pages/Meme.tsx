import { Container, Flex, Grid, Heading } from "@chakra-ui/layout";
import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import useToast from "../components/hooks/useToast";
import { Spinner } from "@chakra-ui/spinner";

// interfaces
import { Meme } from "../interfaces";

// components
import MemeImage from "../components/meme/MemeImage";
import MemeContent from "../components/meme/MemeContent/index";

interface Params {
  id: string;
}

// the single meme page which will show the meme information according to the id
const SingleMemePage = () => {
  const [meme, setMeme] = useState<Meme>();
  const [loading, setLoading] = useState<boolean>(true);

  const { id } = useParams<Params>();
  const history = useHistory();
  const toast = useToast();

  async function fetchMemeData(abortController: AbortController) {
    try {
      const res = await fetch(`/meme/getMemeById/${id}`, {
        method: "GET",
        signal: abortController.signal,
        headers: { "Content-Type": "application/json" },
      });
      const body = await res.json();

      if (res.ok) {
        document.title = `MEME-Site: ${body.meme.author.name} / ${body.meme.title}`;
        setMeme(body.meme);
        setLoading(false);
      } else if (res.status === 404) {
        history.push("/");
        toast({ description: body.message });
      }
    } catch (err: any) {
      history.push("/");
      toast({ description: err.message, status: "error" });
    }
  }

  useEffect(() => {
    const abortController = new AbortController();

    document.title = "Loading meme ...";
    fetchMemeData(abortController);

    return () => {
      abortController.abort();
      setLoading(true);
    };
  }, [id]);

  if (loading && !meme) {
    return (
      <Flex w="full" py={50} h="full" justify="center" align={"center"}>
        <Spinner />
      </Flex>
    );
  }

  return (
    <Container maxW="container.lg" py={[5, 5, 10, 10]}>
      <Grid boxShadow="lg" rounded={5} overflow="hidden" templateColumns="repeat(12, 1fr)">
        <MemeImage meme={meme} />
        <MemeContent meme={meme} setMeme={setMeme} />
      </Grid>
    </Container>
  );
};

export default SingleMemePage;
