import { Flex, Heading } from "@chakra-ui/layout";
import { Button } from "@chakra-ui/button";
import { Input } from "@chakra-ui/input";
import { Image } from "@chakra-ui/image";
import { ChangeEvent, useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import { Meme } from "../interfaces";
import { useHistory } from "react-router-dom";
import useToast from "../components/hooks/useToast";
import { useColorModeValue } from "@chakra-ui/color-mode";
import { AuthContext } from "../providers/AuthProvider";

interface Params {
  id: string;
}

const EditMeme = () => {
  const [input, setInput] = useState({ title: "", image: "" });
  const [previewSource, setPreviewSource] = useState("");
  const [meme, setMeme] = useState<Meme>();
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState(false);
  const { id } = useParams<Params>();
  const history = useHistory();
  const toast = useToast();

  const { title, image } = input;
  const {
    state: { user },
  } = useContext(AuthContext);
  const formBackground = useColorModeValue("gray.50", "gray.700");
  const formVariant = useColorModeValue("outline", "filled");

  // fr fetching the meme data according to the id
  async function fetchMemeData(abortController: AbortController) {
    try {
      const res = await fetch(`/meme/getMemeById/${id}`, {
        method: "GET",
        signal: abortController.signal,
        headers: { "Content-Type": "application/json" },
      });
      const { meme, message } = await res.json();

      if (res.ok) {
        setMeme(meme);
        setInput((pre) => ({ ...pre, title: meme.title }));
        setLoading(false);
      } else if (res.status === 401) {
        history.push("/");
        toast({ description: message });
      } else if (res.status === 404) {
        history.push("/");
        toast({ description: message });
      }
    } catch (err: any) {
      toast({ description: err.message || err });
    }
  }

  // for handling input change
  function HandleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value, files } = event.target;

    setInput((pre) => ({ ...pre, [name]: name === "image" ? files?.length && files[0] : value }));

    if (name === "image") {
      if (files?.length) {
        setPreviewSource(URL.createObjectURL(files[0]));
      }
    }
  }

  // for saving the changes in the DB
  async function saveChanges() {
    setPending(true);
    const formData = new FormData();

    formData.append("image", image);
    formData.append("title", title || (meme ? meme.title : ""));
    formData.append("memeId", meme ? meme._id : "");
    formData.append("photoId", meme ? meme.photoId : "");

    try {
      const res = await fetch("/meme/edit_meme", {
        method: "POST",
        body: formData,
      });
      const body = await res.json();

      if (res.ok) {
        history.push(`/profile/${user?._id}`);
        toast({ description: body.message });
        setPending(false);
      }
    } catch (err: any) {
      toast({ description: err.message || err });
      setPending(false);
    }
  }

  // for validating input information's
  function Validate() {
    const validations = {
      allFields: title,
      isAuthor: user?._id === meme?.author._id,
    };
    const { allFields, isAuthor } = validations;

    if (!allFields) {
      toast({ status: "error", description: "Please fill all the fields properly" });
    } else if (!isAuthor) {
      toast({ status: "error", description: "You are not the author who can edit this" });
    } else if (allFields && isAuthor) {
      saveChanges();
    }
  }

  useEffect(() => {
    const abortController = new AbortController();

    fetchMemeData(abortController);

    return () => {
      abortController.abort();
    };
  }, []);

  if (loading) {
    return (
      <Flex paddingY={20} justifyContent="center">
        <Heading fontSize="2xl" fontWeight="normal">
          Loading ...
        </Heading>
      </Flex>
    );
  }

  return (
    <Flex py={30} marginX="5px" justifyContent="center" alignItems="center">
      <Flex
        rounded={5}
        p={[8, 10, 10, 10]}
        background={formBackground}
        width="400px"
        direction="column"
      >
        <Heading color="teal" fontSize="xx-large" fontWeight="normal" textAlign="center" mb={3}>
          Edit Meme
        </Heading>
        <Input
          name="title"
          variant={formVariant}
          placeholder="Edit Title"
          onChange={HandleInputChange}
          mb={3}
          value={title}
        />
        <Input
          hidden
          name="image"
          type="file"
          accept="image/*"
          placeholder="Edit Title"
          onChange={HandleInputChange}
          display="none"
          id="upload_file_input"
        />
        <label htmlFor="upload_file_input">
          <Button cursor="pointer" width="100%" mb={3} as="span" colorScheme="teal">
            Edit Image
          </Button>
        </label>
        {previewSource && image ? (
          <Image
            h="220px"
            objectFit="cover"
            mb={3}
            w="100%"
            rounded={5}
            src={previewSource}
            alt={title}
          />
        ) : (
          <Image
            h="220px"
            objectFit="cover"
            mb={3}
            w="100%"
            rounded={5}
            src={meme?.photoUrl}
            alt={title}
          />
        )}

        <Button
          disabled={pending || (meme?.title === title && !image)}
          onClick={Validate}
          colorScheme="teal"
        >
          Save Changes
        </Button>
      </Flex>
    </Flex>
  );
};

export default EditMeme;
