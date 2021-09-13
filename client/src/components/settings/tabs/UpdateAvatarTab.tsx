import { Avatar } from "@chakra-ui/avatar";
import { Button } from "@chakra-ui/button";
import { Input } from "@chakra-ui/input";
import { Flex } from "@chakra-ui/layout";
import { ChangeEvent, useContext, useState } from "react";
import { useHistory } from "react-router";
import { AuthContext } from "../../../providers/AuthProvider";
import useToast from "../../hooks/useToast";

const UpdateAvatarTab = () => {
  const [previewSource, setPreviewSource] = useState("");
  const [file, setFile] = useState<Blob>();
  const [pending, setPending] = useState(false);

  const toast = useToast();
  const history = useHistory();

  const {
    state: { user },
    dispatch,
  } = useContext(AuthContext);

  function HandleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const { files } = event.target;
    if (files?.length) {
      setFile(files[0]);
      setPreviewSource(URL.createObjectURL(files[0]));
    }
  }

  async function SaveChanges() {
    setPending(true);
    const formData = new FormData();

    if (file && user) {
      formData.append("image", file);
      formData.append("photoId", user.photoId);
    }

    try {
      const res = await fetch("/get_settings/update_profile_avatar", {
        method: "POST",
        body: formData,
      });
      const body = await res.json();

      if (res.ok) {
        setPending(false);
        dispatch({ type: "LOGIN", payload: body.user });
        history.push(`/profile/${user?._id}`);
        toast({ status: "success", description: body.message });
      }
    } catch (err: any) {
      setPending(false);
      toast({ status: "error", description: err.message || err });
    }
  }

  return (
    <Flex direction="column">
      <Avatar
        src={previewSource || user?.photoUrl}
        margin="auto"
        mb={5}
        name={user?.name}
        alt={user?.name}
        size="2xl"
      />
      <Input hidden type="file" onChange={HandleInputChange} id="file_upload_button" />
      <label htmlFor="file_upload_button">
        <Button cursor="pointer" mb={2} w="100%" as="span" colorScheme="blue">
          Upload Image
        </Button>
      </label>
      <Button
        onClick={SaveChanges}
        disabled={!previewSource || !file || pending}
        colorScheme="teal"
      >
        Save Changes
      </Button>
    </Flex>
  );
};

export default UpdateAvatarTab;
