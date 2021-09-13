import { Avatar } from "@chakra-ui/avatar";
import { IconButton } from "@chakra-ui/button";
import { Box, Flex, Heading } from "@chakra-ui/layout";
import { Dispatch, useContext } from "react";
import { Link } from "react-router-dom";
import { Meme } from "../../../interfaces";
import useToast from "../../../components/hooks/useToast";
import { AuthContext } from "../../../providers/AuthProvider";

interface Props {
  meme: Meme | undefined;
  setMeme: Dispatch<Meme>;
}

const CommentSection = ({ meme, setMeme }: Props) => {
  const {
    state: { user, isAuthenticated },
  } = useContext(AuthContext);
  const toast = useToast();

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

  return (
    <>
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
    </>
  );
};

export default CommentSection;
