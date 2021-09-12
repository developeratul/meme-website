import { Avatar } from "@chakra-ui/avatar";
import { IconButton } from "@chakra-ui/button";
import { useColorModeValue } from "@chakra-ui/color-mode";
import { Image } from "@chakra-ui/image";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { Box, Container, Flex, Grid, Heading } from "@chakra-ui/layout";
import { Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/menu";
import { FormEvent, useContext, useEffect, useState } from "react";
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
  const [input, setInput] = useState<string>("");
  const [pending, setPending] = useState(false);

  const {
    state: { user, isAuthenticated },
  } = useContext(AuthContext);

  const imageContainerBackground = useColorModeValue("gray.100", "gray.700");
  const topBarBg = useColorModeValue("gray.300", "gray.900");
  const memeTitleColor = useColorModeValue("gray.600", "gray.300");
  const inputBackground = useColorModeValue("gray.100", "gray.800");
  const inputVariant = useColorModeValue("outline", "filled");

  const { id } = useParams<Params>();
  const history = useHistory();
  const toast = useToast();

  const atLeastContainsOneChar = /[a-z]/gi;

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

      if (res.ok) {
        setPending(false);
        setInput("");
        const updatedMeme = meme && { ...meme, comments: [...meme.comments, comment] };
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

  // for deleting a comment
  async function deleteComment(commentId: string, memeId: string) {
    try {
      const res = await fetch("/comment", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ commentId, memeId }),
      });

      if (res.ok && meme) {
        const updatedMeme = {
          ...meme,
          comments: meme.comments.filter((comment) => comment._id !== commentId),
        };
        setMeme(updatedMeme);
      }
    } catch (err: any) {
      toast({ status: "error", description: err.message || err });
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
          templateRows="70px 1fr 70px"
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
                  noOfLines={1}
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

          <Box overflowX="hidden" p={3}>
            <Heading mb={10} fontSize="1xl" fontWeight="medium" color={memeTitleColor}>
              {meme?.title}
            </Heading>

            <Heading fontSize="xl" fontWeight="medium" mb={5}>
              Comments ({meme?.comments.length})
            </Heading>
            {meme?.comments.length ? (
              meme.comments.map((comment) => {
                const { user: commentUser } = comment;

                return (
                  <Flex
                    mb={10}
                    css={{ "&:last-child": { marginBottom: 0 } }}
                    key={comment._id}
                    justifyContent="space-between"
                    alignItems="flex-start"
                  >
                    <Box>
                      <Flex alignItems="center" mb={3}>
                        <Avatar
                          mr={2}
                          size="sm"
                          src={commentUser.photoUrl}
                          alt={commentUser.name}
                          name={commentUser.name}
                        />
                        <Box>
                          <Heading
                            color="teal"
                            fontWeight="normal"
                            fontSize="medium"
                            as={Link}
                            to={`/profile/${commentUser._id}`}
                          >
                            {commentUser.name}
                          </Heading>
                          <Heading color="gray.600" fontWeight="normal" fontSize="xs">
                            {new Date(+comment.time).toDateString()}
                          </Heading>
                        </Box>
                      </Flex>

                      <Heading fontSize="md" fontWeight="normal">
                        {comment.text}
                      </Heading>
                    </Box>

                    {user && user._id === commentUser._id && isAuthenticated && (
                      <IconButton
                        onClick={() => deleteComment(comment._id, meme._id)}
                        icon={<i className="fas fa-trash-alt"></i>}
                        aria-label="delete comment button"
                      />
                    )}
                  </Flex>
                );
              })
            ) : (
              <Heading
                fontFamily="Josefin Sans"
                py={20}
                textAlign="center"
                fontSize="2xl"
                color="gray.500"
              >
                No Comments
              </Heading>
            )}
          </Box>

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
        </Grid>
      </Grid>
    </Container>
  );
};

export default SingleMemePage;
