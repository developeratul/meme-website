import { Avatar } from "@chakra-ui/avatar";
import { Button, IconButton } from "@chakra-ui/button";
import { useColorModeValue } from "@chakra-ui/color-mode";
import { Image } from "@chakra-ui/image";
import { Box, Container, Flex, SimpleGrid, Heading } from "@chakra-ui/layout";
import { Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/menu";
import { Tooltip } from "@chakra-ui/tooltip";
import { useContext, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import { Link } from "react-router-dom";
import useToast from "../components/hooks/useToast";
import { Meme, User } from "../interfaces";
import { AuthContext } from "../providers/AuthProvider";
import { Spinner } from "@chakra-ui/spinner";

interface Params {
  id: string;
}

// the profile page which will show up the contents of a user
const Profile = () => {
  const [user, setUser] = useState<User>({
    _id: "",
    name: "",
    email: "",
    password: "",
    portfolio: "",
    time: 0,
    memes: [],
    photoUrl: "",
    photoId: "",
  });
  const {
    state: { user: authUser, isAuthenticated },
  } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const { id } = useParams<Params>();
  const toast = useToast();
  const history = useHistory();
  const boxBackground = useColorModeValue("gray.50", "gray.700");

  // for fetching the infos of the user according to the id
  async function fetchUserData(abortController: AbortController) {
    try {
      const res = await fetch(`/get_profile/id/${id}`, {
        method: "GET",
        signal: abortController.signal,
        headers: { "Content-Type": "application/json" },
      });
      const body = await res.json();

      if (res.ok) {
        document.title = `${body.user.name}'s profile`;
        setUser(body.user);
        setLoading(false);
      } else if (res.status === 404) {
        history.push("/");
        toast({ status: "warning", description: body.message });
      }
    } catch (error: any) {
      toast({ status: "error", description: error.message || error });
    }
  }

  // for liking a meme
  async function likeMeme(memeId: string) {
    if (authUser) {
      const updatedMemes = user.memes.map((meme: Meme) => {
        if (meme._id === memeId) {
          meme.likes.push(authUser._id);
        }
        return meme;
      });
      setUser({ ...user, memes: updatedMemes });
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
      console.log(err.message || err);
    }
  }

  // for unLiking a meme
  async function unlikeMeme(memeId: string) {
    if (authUser) {
      const updatedMemes = user.memes.map((meme: Meme) => {
        if (meme._id === memeId) {
          meme.likes = meme.likes.filter((like) => like !== authUser._id);
        }
        return meme;
      });
      setUser({ ...user, memes: updatedMemes });
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
      console.log(err.message || err);
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
          setUser((pre) => ({
            ...pre,
            memes: user.memes.filter((meme: Meme) => meme._id !== memeId),
          }));
          toast({ status: "success", description: body.message });
        }
      }
    } catch (err: any) {
      toast({ description: err.message || err, status: "error" });
    }
  }

  useEffect(() => {
    const abortController = new AbortController();

    document.title = "Loading profile ...";
    fetchUserData(abortController);

    return () => {
      abortController.abort();
      setLoading(true);
    };
  }, [id]);

  if (loading) {
    return (
      <Flex w="full" h="full" align="center" justify="center" py={20}>
        <Spinner />
      </Flex>
    );
  }

  return (
    <Container maxW="container.lg" py={20}>
      {/* the header of the user's profile page containing some primary infos about the user */}
      <Flex
        borderBottom="1px"
        mb={10}
        pb={5}
        justifyContent={["center", "space-between", "space-between", "space-between"]}
        direction={["column", "unset", "unset", "unset"]}
        alignItems="center"
        gridRowGap={[5, 0, 0, 0]}
      >
        <Flex
          alignItems="center"
          justifyContent={["center", "stretch", "stretch", "stretch"]}
          direction={["column", "row", "row", "row"]}
        >
          <Avatar
            mr={[0, 5, 5, 5]}
            mb={[5, 0, 0, 0]}
            src={user.photoUrl}
            alt={user.name}
            name={user.name}
            size="2xl"
          />
          <Box textAlign={["center", "left", "left", "left"]}>
            <Heading
              as="a"
              target="_blank"
              href={user.portfolio}
              color="teal"
              fontWeight="normal"
              mb={2}
            >
              {user.name}
            </Heading>
            <Heading fontSize="md" color="gray.400" fontWeight="normal" mb={2}>
              {user.email}
            </Heading>
            <Heading fontSize="md" color="gray.400" fontWeight="normal">
              {new Date(+user.time).toDateString()}
            </Heading>
          </Box>
        </Flex>

        {user._id === authUser?._id && (
          <Button colorScheme="teal" as={Link} to="/settings">
            Edit Profile
          </Button>
        )}
      </Flex>

      <Heading mb={5} fontWeight="normal" fontSize="xl">
        Meme Posted ({user.memes.length}):
      </Heading>

      {/* the memes grid which will contain the memes posted by the user */}
      <SimpleGrid columns={[1, 1, 2, 3]} gap={3}>
        {user.memes.length > 0 ? (
          user.memes.map((meme: Meme) => {
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

                  {/* if the visiting user is the author of this profile, instead of the like button, this menu will be shown */}
                  {user._id === (authUser && authUser._id) ? (
                    <Menu>
                      <MenuButton
                        as={IconButton}
                        aria-label="menu button"
                        icon={<i className="fas fa-ellipsis-h"></i>}
                      />
                      <MenuList>
                        <MenuItem
                          onClick={() => deleteMeme(meme._id, meme.photoId)}
                          icon={<i className="fas fa-trash-alt"></i>}
                        >
                          Delete Meme
                        </MenuItem>
                        <MenuItem
                          as={Link}
                          to={`/editMeme/${meme._id}`}
                          icon={<i className="fas fa-pencil-alt"></i>}
                        >
                          Edit Meme
                        </MenuItem>
                      </MenuList>
                    </Menu>
                  ) : (
                    <Flex alignItems="center">
                      <Heading fontFamily="Josefin Sans" mr={2} fontSize="md" fontWeight="normal">
                        {meme.likes.length}
                      </Heading>
                      <IconButton
                        aria-label="react button"
                        colorScheme={
                          authUser && meme.likes.includes(authUser._id) ? "pink" : "gray"
                        }
                        onClick={() => {
                          if (!isAuthenticated) {
                            toast({ status: "warning", description: "You must be logged in" });
                          } else {
                            authUser && meme.likes.includes(authUser._id)
                              ? unlikeMeme(meme._id)
                              : likeMeme(meme._id);
                          }
                        }}
                      >
                        {authUser && meme.likes.includes(authUser._id) ? (
                          <i className="fas fa-heart"></i>
                        ) : (
                          <i className="far fa-heart"></i>
                        )}
                      </IconButton>
                    </Flex>
                  )}
                </Flex>
              </Box>
            );
          })
        ) : (
          <Heading textAlign="center" fontSize="2xl" fontWeight="md" color="gray.500">
            No Memes to show
          </Heading>
        )}
      </SimpleGrid>
    </Container>
  );
};

export default Profile;
