import { Avatar } from "@chakra-ui/avatar";
import { IconButton } from "@chakra-ui/button";
import { useColorModeValue } from "@chakra-ui/color-mode";
import { Image } from "@chakra-ui/image";
import { Box, Container, Flex, Grid, Heading } from "@chakra-ui/layout";
import { Tooltip } from "@chakra-ui/tooltip";
import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import { Link } from "react-router-dom";
import useToast from "../components/hooks/useToast";
import { Meme, User } from "../interfaces";

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
  });
  const [loading, setLoading] = useState(true);
  const { id } = useParams<Params>();
  const toast = useToast();
  const history = useHistory();
  const boxBackground = useColorModeValue("gray.50", "gray.700");

  // for fetching the infos of the user according to the id
  async function fetchUserData(abortController: AbortController) {
    try {
      const res = await fetch(`/profile/id/${id}`, {
        method: "GET",
        signal: abortController.signal,
        headers: { "Content-Type": "application/json" },
      });
      const body = await res.json();

      if (res.ok) {
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
    user.memes.map((meme: Meme) => {
      if (meme._id === memeId) {
        if (user) {
          meme.likes.push(user._id);
        }
      }
      return meme;
    });

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
    user.memes.map((meme: Meme) => {
      if (meme._id === memeId) {
        meme.likes = meme.likes.filter((likeId) => likeId !== (user && user._id));
      }
      return meme;
    });

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

    fetchUserData(abortController);

    return () => {
      abortController.abort();
      setLoading(true);
    };
  }, []);

  if (loading) {
    return (
      <Flex justifyContent="center" py={20}>
        <Heading fontSize="2xl" fontWeight="normal">
          Loading ...
        </Heading>
      </Flex>
    );
  }

  return (
    <Container maxW="container.lg" py={20}>
      {/* the header of the user's profile page containing some primary infos about the user */}
      <Flex
        alignItems="center"
        justifyContent={["center", "stretch", "stretch", "stretch"]}
        direction={["column", "row", "row", "row"]}
        mb={10}
        borderBottom="1px"
        pb={5}
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

      <Heading mb={5} fontWeight="normal" fontSize="xl">
        Meme Posted ({user.memes.length}):
      </Heading>

      {/* the memes grid which will contain the memes posted by the user */}
      <Grid
        gap={5}
        templateColumns={[
          "repeat(auto-fit, minmax(200px, 1fr))",
          "repeat(auto-fit, minmax(300px, 1fr))",
        ]}
      >
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
                animation="step-start"
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
                  <Heading cursor="pointer" noOfLines={1} fontWeight="medium" fontSize="1xl" mb={3}>
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
                      onClick={() =>
                        user && meme.likes.includes(user._id)
                          ? unlikeMeme(meme._id)
                          : likeMeme(meme._id)
                      }
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
          <Heading textAlign="center" fontSize="2xl" fontWeight="md" color="gray.500">
            No Memes to show
          </Heading>
        )}
      </Grid>
    </Container>
  );
};

export default Profile;
