import { Avatar } from "@chakra-ui/avatar";
import { IconButton } from "@chakra-ui/button";
import { useColorModeValue } from "@chakra-ui/color-mode";
import { Image } from "@chakra-ui/image";
import { Box, Container, Flex, Grid, Heading } from "@chakra-ui/layout";
import { Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/menu";
import { useContext, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import { Link } from "react-router-dom";
import useToast from "../components/hooks/useToast";
import { Meme } from "../interfaces";
import { AuthContext } from "../providers/AuthProvider";

interface Params {
  id: string;
}

// the single meme page which will show the meme information according to the id
const SingleMemePage = () => {
  const [meme, setMeme] = useState<Meme>();
  const [loading, setLoading] = useState<boolean>(true);
  const {
    state: { user, isAuthenticated },
  } = useContext(AuthContext);
  const imageContainerBackground = useColorModeValue("gray.100", "gray.700");
  const topBarBg = useColorModeValue("gray.300", "gray.900");
  const memeTitleColor = useColorModeValue("gray.600", "gray.300");
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

  // for liking a meme
  async function likeMeme(memeId: string) {
    if (user && meme) {
      const updatedMeme: Meme = { ...meme, likes: [...meme.likes, user._id.toString()] };
      setMeme(updatedMeme);
    }
    try {
      const res = await fetch("/meme/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ memeId }),
      });
      if (res.ok) {
      }
    } catch (err: any) {
      toast({ description: err.message || err, status: "error" });
    }
  }

  // for unLiking a meme
  async function unlikeMeme(memeId: string) {
    if (user && meme) {
      const updatedMeme: Meme = { ...meme, likes: meme.likes.filter((i) => i !== user._id) };
      setMeme(updatedMeme);
    }
    try {
      const res = await fetch("/meme/unlike", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ memeId }),
      });
      if (res.ok) {
      }
    } catch (err: any) {
      toast({ description: err.message || err, status: "error" });
    }
  }

  // for deleting a meme
  async function deleteMeme(memeId: string, memeImageId: string) {
    const confirmed = window.confirm("Are you sure you want to delete this meme permanently?");

    try {
      if (confirmed) {
        const res = await fetch("/meme/delete_meme", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ memeId, memeImageId }),
        });
        const body = await res.json();

        if (res.ok) {
          history.push(`/profile/${user?._id}`);
          toast({ description: body.message, status: "success" });
        }
      }
    } catch (err: any) {
      toast({ description: err.message || err, status: "error" });
    }
  }

  useEffect(() => {
    const abortController = new AbortController();

    fetchMemeData(abortController);

    return () => {
      abortController.abort();
      setLoading(true);
    };
  }, [id]);

  if (loading) {
    return (
      <Flex py={20} justifyContent="center">
        <Heading fontWeight="normal" fontSize="2xl">
          Loading ...
        </Heading>
      </Flex>
    );
  }

  return (
    <Container maxW="container.lg" py={[5, 5, 10, 10]}>
      <Grid boxShadow="lg" rounded={5} overflow="hidden" templateColumns="repeat(12, 1fr)">
        <Box
          gridColumn={["1 / -1", "1 / -1", "1 / 8", "1 / 8"]}
          bg={imageContainerBackground}
          display="grid"
          placeItems="center"
        >
          <Image
            src={meme?.photoUrl}
            alt={meme?.title}
            width="100%"
            height={["300px", "300px", "500px", "500px"]}
            objectFit="contain"
          />
        </Box>

        <Grid
          height="500px"
          templateRows="70px 1fr"
          gridColumn={["1 / -1", "1 / -1", "8 / -1", "8 / -1"]}
        >
          <Flex
            bg={topBarBg}
            justifyContent="space-between"
            overflow="hidden"
            py={2}
            alignItems="center"
            px={5}
          >
            <Flex alignItems="center">
              <Avatar
                src={meme?.author.photoUrl}
                size="sm"
                name={meme?.author.name}
                alt={meme?.author.name}
                mr={2}
              />
              <Box>
                <Heading
                  color="teal"
                  as={Link}
                  fontWeight="normal"
                  fontSize="xl"
                  to={`/profile/${meme?.author._id}`}
                >
                  {meme?.author.name}
                </Heading>
                <Heading fontSize="xs" fontWeight="normal">
                  {meme && new Date(+meme.time).toDateString()}
                </Heading>
              </Box>
            </Flex>

            <Flex alignItems="center">
              {user?._id === meme?.author._id ? (
                <Menu>
                  <MenuButton
                    as={IconButton}
                    aria-label="menu button"
                    icon={<i className="fas fa-ellipsis-h"></i>}
                  />
                  <MenuList>
                    <MenuItem
                      onClick={() => {
                        meme && deleteMeme(meme._id, meme.photoId);
                      }}
                      icon={<i className="fas fa-trash-alt"></i>}
                    >
                      Delete Meme
                    </MenuItem>
                    <MenuItem
                      as={Link}
                      to={`/editMeme/${meme?._id}`}
                      icon={<i className="fas fa-pencil-alt"></i>}
                    >
                      Edit Meme
                    </MenuItem>
                  </MenuList>
                </Menu>
              ) : (
                <>
                  <Heading fontSize="xl" fontWeight="normal" mr={2}>
                    {meme?.likes.length}
                  </Heading>
                  <IconButton
                    onClick={() => {
                      if (!isAuthenticated && !user) {
                        toast({ status: "warning", description: "You must be authenticated" });
                      }
                      user && meme && meme.likes.includes(user._id)
                        ? unlikeMeme(meme._id)
                        : likeMeme(meme?._id || "");
                    }}
                    colorScheme={user && meme && meme.likes.includes(user._id) ? "pink" : "gray"}
                    icon={
                      user && meme && meme.likes.includes(user._id) ? (
                        <i className="fas fa-heart"></i>
                      ) : (
                        <i className="far fa-heart"></i>
                      )
                    }
                    aria-label="Like button"
                  />
                </>
              )}
            </Flex>
          </Flex>

          {/* Add comment adding feature and also fetch the comments here */}
          <Box overflowX="hidden" p={3}>
            <Heading mb={5} fontSize="1xl" fontWeight="medium" color={memeTitleColor}>
              {meme?.title}
            </Heading>
            <Heading fontSize="2xl" mb={10} fontWeight="medium">
              Comments (0)
            </Heading>
            <Heading fontFamily="Josefin Sans" textAlign="center" fontSize="2xl" color="gray.500">
              No Comments
            </Heading>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default SingleMemePage;
