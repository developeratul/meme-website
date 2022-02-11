import {
  SimpleGrid,
  Container,
  Box,
  useColorModeValue,
  Image,
  Flex,
  Heading,
  Tooltip,
  IconButton,
  Avatar,
} from "@chakra-ui/react";
import { Spinner } from "@chakra-ui/spinner";
import { Button } from "@chakra-ui/button";
import { Link } from "react-router-dom";

import { useContext, useEffect, useState } from "react";
import { MemeContext } from "../../providers/MemeProvider";
import { AuthContext } from "../../providers/AuthProvider";
import { Meme } from "../../interfaces";
import useToast from "../hooks/useToast";

// this component is being used in the home page which is containing all the memes
// which were posted
const Memes = () => {
  const { state: memes, dispatch } = useContext(MemeContext);
  const {
    state: { user, isAuthenticated },
  } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [currentMemes, setCurrentMemes] = useState<any[]>([]);
  const indexOfLastMeme = currentMemes.length;
  const totalMemes = memes.length;

  const boxBackground = useColorModeValue("gray.50", "gray.700");
  const toast = useToast();

  // I will be fetching 18 memes at a time
  function loadNextMemes() {
    const memesLeft = totalMemes - currentMemes.length;
    let nextMemes: any[] = [];
    if (memesLeft < 18) {
      nextMemes = memes.slice(indexOfLastMeme, totalMemes + memesLeft);
    } else {
      nextMemes = memes.slice(indexOfLastMeme, currentMemes.length + 18);
    }
    setCurrentMemes(() => [...currentMemes, ...nextMemes]);
  }

  // for fetching the data of memes
  async function fetchMemes(abortController: AbortController) {
    try {
      const res = await fetch(`/meme`, {
        method: "GET",
        signal: abortController.signal,
        headers: { "Content-Type": "application/json" },
      });
      const body = await res.json();

      if (res.status === 200) {
        setLoading(false);
        dispatch({ type: "GET_MEMES", payload: body.memes });
        setCurrentMemes(body.memes.slice(0, body.memes.length < 18 ? body.memes.length : 18));
      }
    } catch (err: any) {
      console.log(err.message || err);
    }
  }

  // for liking a meme
  async function likeMeme(memeId: string) {
    const updatedMemes = memes.map((meme: Meme) => {
      if (meme._id === memeId) {
        if (user) {
          meme.likes.push(user._id);
        }
      }
      return meme;
    });
    dispatch({ type: "GET_MEMES", payload: updatedMemes });
    try {
      const res = await fetch("/meme/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ memeId }),
      });
      if (res.ok) {
      }
    } catch (err: any) {
      console.log(err.message || err);
    }
  }

  // for unLiking a meme
  async function unlikeMeme(memeId: string) {
    const updatedMemes = memes.map((meme: Meme) => {
      if (meme._id === memeId) {
        meme.likes = meme.likes.filter((likeId) => likeId !== (user && user._id));
      }
      return meme;
    });
    dispatch({ type: "GET_MEMES", payload: updatedMemes });
    try {
      const res = await fetch("/meme/unlike", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ memeId }),
      });
      if (res.ok) {
      }
    } catch (err: any) {
      console.log(err.message || err);
    }
  }

  useEffect(() => {
    const abortController = new AbortController();

    fetchMemes(abortController);

    return () => abortController.abort();
  }, []);

  useEffect(() => {
    if (!loading) {
      setCurrentMemes(memes.slice(0, memes.length < 18 ? memes.length : 18));
    }
  }, [memes]);

  if (loading) {
    return (
      <Flex align="center" w="full" h="full" justify="center" py={20}>
        <Spinner />
      </Flex>
    );
  }

  return (
    <Container maxW="container.lg" pb={10}>
      <SimpleGrid w="full" gap={3} columns={currentMemes.length === 0 ? 1 : [1, 1, 2, 3]}>
        {currentMemes.length > 0 ? (
          currentMemes.map((meme: Meme) => {
            const time = new Date(+meme.time).toDateString();

            return (
              <Box
                _hover={{ boxShadow: "lg" }}
                transition=".3s"
                p={3}
                rounded={5}
                boxShadow="md"
                key={meme._id}
                bg={boxBackground}
                // maxW="370px"
              >
                <Image
                  h="220px"
                  width="100%"
                  rounded={5}
                  loading="lazy"
                  objectFit="cover"
                  src={meme.photoUrl}
                  alt={meme.title}
                  mb={3}
                />

                <Tooltip label={meme.title} hasArrow>
                  <Heading
                    as={Link}
                    to={`/memeId/${meme._id}`}
                    cursor="pointer"
                    noOfLines={1}
                    fontWeight="medium"
                    fontSize="1xl"
                    mb={3}
                  >
                    {meme.title}
                  </Heading>
                </Tooltip>

                <Flex justifyContent="space-between" alignItems="center">
                  <Box>
                    <Flex alignItems="center" mb={2}>
                      <Avatar
                        src={meme.author.photoUrl}
                        size="xs"
                        name={meme.author.name}
                        alt={meme.author.name}
                        mr={2}
                      />
                      <Heading
                        to={`/profile/${meme.author._id}`}
                        as={Link}
                        noOfLines={1}
                        color="teal"
                        fontSize="medium"
                        fontWeight="medium"
                      >
                        {meme.author.name}
                      </Heading>
                    </Flex>

                    <Flex alignItems="center" color="gray.500" fontWeight="medium" fontSize="sm">
                      <Box mr={2}>
                        <i className="fas fa-globe-europe"></i>
                      </Box>{" "}
                      <Heading fontSize="xs" fontWeight="normal">
                        {time}
                      </Heading>
                    </Flex>
                  </Box>

                  <Flex alignItems="center">
                    <Heading fontFamily="Josefin Sans" mr={2} fontSize="md" fontWeight="normal">
                      {meme.likes.length}
                    </Heading>
                    <IconButton
                      aria-label="react button"
                      colorScheme={user && meme.likes.includes(user._id) ? "pink" : "gray"}
                      onClick={() => {
                        if (!isAuthenticated) {
                          toast({ status: "warning", description: "You must be logged in" });
                        } else {
                          user && meme.likes.includes(user._id)
                            ? unlikeMeme(meme._id)
                            : likeMeme(meme._id);
                        }
                      }}
                    >
                      {user && meme.likes.includes(user._id) ? (
                        <i className="fas fa-heart"></i>
                      ) : (
                        <i className="far fa-heart"></i>
                      )}
                    </IconButton>
                  </Flex>
                </Flex>
              </Box>
            );
          })
        ) : (
          <Heading w="full" textAlign="center" fontSize="2xl" fontWeight="md" color="gray.500">
            No Memes to show
          </Heading>
        )}
      </SimpleGrid>
      {totalMemes !== currentMemes.length && currentMemes.length !== 0 && (
        <Flex py={5} justify="center" align="center">
          <Button minW={200} colorScheme={"teal"} onClick={loadNextMemes}>
            Load more
          </Button>
        </Flex>
      )}
    </Container>
  );
};

export default Memes;
