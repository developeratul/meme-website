import { Avatar } from "@chakra-ui/avatar";
import { IconButton } from "@chakra-ui/button";
import { Box, Flex, Heading } from "@chakra-ui/layout";
import { Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/menu";
import { useColorModeValue } from "@chakra-ui/system";
import { Dispatch, useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import { Meme } from "../../../interfaces";
import { AuthContext } from "../../../providers/AuthProvider";
import useToast from "../../hooks/useToast";

interface Props {
  meme: Meme | undefined;
  setMeme: Dispatch<Meme>;
}

// this is the top bar which is containing the like button and user related info's
const TopBar = ({ meme, setMeme }: Props) => {
  const topBarBg = useColorModeValue("gray.300", "gray.900");
  const history = useHistory();
  const toast = useToast();
  const {
    state: { user, isAuthenticated },
  } = useContext(AuthContext);

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

  return (
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
  );
};

export default TopBar;
