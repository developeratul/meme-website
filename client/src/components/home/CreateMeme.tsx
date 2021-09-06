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
  useToast,
} from "@chakra-ui/react";
import { ChangeEvent, useContext, useState } from "react";
import { AuthContext } from "../../providers/AuthProvider";

const CreateMeme = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { state } = useContext(AuthContext);
  const [input, setInput] = useState({
    image: "",
    title: "",
  });
  const [previewSource, setPreviewSource] = useState("");
  const { image, title } = input;
  const { isAuthenticated } = state;
  const toast = useToast({ position: "top", status: "error", variant: "solid" });

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
        setInput({
          title: "",
          image: "",
        });
        onClose();
      }
    } catch (err: any) {
      toast({ description: err.message || err });
    }
  }

  // for validation information's before upload
  function Validate() {
    const validations = {
      allFields: title && image,
    };
    const { allFields } = validations;

    if (!allFields) {
      toast({ description: "Please fill all the required fields" });
    } else if (!isAuthenticated) {
      toast({ description: "You must be logged in to post a meme" });
    } else if (isAuthenticated && allFields) {
      uploadMeme();
    }
  }

  return (
    <Box>
      <Button onClick={onOpen} width="100%" colorScheme="green">
        Post Meme
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
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
              hidden
              name="image"
              id="file-upload-input"
              type="file"
            />
            <label htmlFor="file-upload-input">
              <span
                style={{
                  display: "block",
                  textAlign: "center",
                  background: "#718096",
                  padding: "7px 0",
                  borderRadius: "5px",
                  cursor: "pointer",
                  marginBottom: "20px",
                }}
              >
                Upload Image
              </span>
            </label>

            {previewSource && (
              <Image
                rounded={5}
                src={previewSource}
                alt={title}
                w="100%"
                height="300px"
                objectFit="cover"
              />
            )}
          </ModalBody>
          <ModalFooter>
            <Button onClick={Validate} colorScheme="blue" mr={3}>
              Save
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default CreateMeme;
