import {
  Button,
  Box,
  Modal,
  ModalOverlay,
  ModalHeader,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalCloseButton,
  Input,
  useDisclosure,
  Image,
} from "@chakra-ui/react";
import { ChangeEvent, useContext, useState } from "react";
import { AuthContext } from "../../providers/AuthProvider";
import { MemeContext } from "../../providers/MemeProvider";
import useToast from "../hooks/useToast";

// the create meme modal and the button
const CreateMeme = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { state } = useContext(AuthContext);
  const { dispatch } = useContext(MemeContext);
  const [input, setInput] = useState({
    image: "",
    title: "",
  });
  const [processing, setProcessing] = useState(false);
  const [previewSource, setPreviewSource] = useState("");
  const { image, title } = input;
  const { isAuthenticated } = state;
  const toast = useToast();

  // for handling the input change of both of the inputs
  function HandleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value, files } = event.target;

    setInput((pre) => ({
      ...pre,
      [name]: name === "image" ? (files?.length ? files[0] : null) : value,
    }));

    if (name === "image" && files?.length) {
      setPreviewSource(URL.createObjectURL(files[0]));
    }
  }

  // for saving the current meme information's in the database stored in the input state
  async function uploadMeme() {
    toast({ status: "info", description: "working on it..." });
    setProcessing(true);

    try {
      const formData = new FormData();

      formData.append("title", title);
      formData.append("image", image);

      const res = await fetch("/meme/", {
        method: "POST",
        body: formData,
      });
      const body = await res.json();

      if (res.ok) {
        toast({ status: "success", description: body.message });
        dispatch({ type: "UPLOAD_MEME", payload: body.meme });
        setInput({
          image: "",
          title: "",
        });
        setPreviewSource("");
        onClose();
        setProcessing(false);
      }
    } catch (err: any) {
      setProcessing(false);
      toast({ description: err.message || err, status: "error" });
    }
  }

  // for validation information's before upload
  function Validate() {
    const validations = {
      allFields: title && image,
    };
    const { allFields } = validations;

    if (!allFields) {
      toast({ description: "Please fill all the required fields", status: "error" });
    } else if (!isAuthenticated) {
      toast({ description: "You must be logged in to post a meme", status: "error" });
    } else if (isAuthenticated && allFields) {
      uploadMeme();
    }
  }

  return (
    <Box>
      <Button onClick={onOpen} width="100%" colorScheme="teal">
        Post Meme
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay backdropFilter="blur(10px)" />
        <ModalContent>
          <ModalHeader>Post a Meme</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              onChange={HandleInputChange}
              placeholder="Enter a title"
              mb={3}
              name="title"
              value={title}
            />
            <input
              onChange={HandleInputChange}
              accept="image/*"
              name="image"
              id="file-upload-input"
              type="file"
              hidden
            />
            <label htmlFor="file-upload-input">
              <Button
                mb={3}
                w="100%"
                cursor="pointer"
                fontWeight="normal"
                colorScheme="teal"
                as="span"
              >
                Upload Image
              </Button>
            </label>

            {previewSource && (
              <Image
                rounded={5}
                src={previewSource}
                alt={title}
                w="100%"
                height="200px"
                objectFit="cover"
              />
            )}
          </ModalBody>
          <ModalFooter>
            <Button disabled={processing} onClick={Validate} colorScheme="blue" mr={3}>
              {processing ? "Processing..." : "Save"}
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default CreateMeme;
