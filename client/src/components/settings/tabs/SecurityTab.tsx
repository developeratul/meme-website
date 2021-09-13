import { Button } from "@chakra-ui/button";
import { useColorModeValue } from "@chakra-ui/color-mode";
import { Input } from "@chakra-ui/input";
import { Flex } from "@chakra-ui/layout";
import { ChangeEvent, useContext, useState } from "react";
import bcrypt from "bcryptjs";
import { AuthContext } from "../../../providers/AuthProvider";
import useToast from "../../hooks/useToast";
import { useHistory } from "react-router";

const SecurityTab = () => {
  const [input, setInput] = useState({ oldPass: "", newPass: "", conPass: "" });
  const [pending, setPending] = useState(false);

  const {
    state: { user },
    dispatch,
  } = useContext(AuthContext);

  const inputVariant = useColorModeValue("outline", "filled");
  const toast = useToast();
  const history = useHistory();

  const { oldPass, newPass, conPass } = input;

  // for handling input change
  function HandleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setInput((pre) => ({ ...pre, [name]: value }));
  }

  async function saveChanges() {
    setPending(true);

    try {
      const res = await fetch("/get_settings/update_security_settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: newPass }),
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

  // for validating the input information's
  async function Validate() {
    const validations = {
      allFields: oldPass && newPass && conPass,
      oldPassMatched: user && (await bcrypt.compare(oldPass, user?.password)),
      passwordLength: newPass.length >= 8,
      passwordMatched: newPass === conPass,
    };
    const { allFields, oldPassMatched, passwordLength, passwordMatched } = validations;

    if (!allFields) {
      toast({ status: "error", description: "Please fill all the fields properly" });
    } else if (!oldPassMatched) {
      toast({ status: "error", description: "Your old password is incorrect" });
    } else if (!passwordLength) {
      toast({ status: "error", description: "Password must have 8 chars" });
    } else if (!passwordMatched) {
      toast({ status: "error", description: "Password's doesn't matched" });
    } else if (allFields && oldPassMatched && passwordLength && passwordMatched) {
      saveChanges();
    }
  }

  return (
    <Flex direction="column" wrap="wrap">
      <Input
        variant={inputVariant}
        placeholder="Enter old password"
        onChange={HandleInputChange}
        name="oldPass"
        value={oldPass}
        mb={3}
      />
      <Input
        variant={inputVariant}
        placeholder="Enter new password"
        onChange={HandleInputChange}
        name="newPass"
        value={newPass}
        mb={3}
      />
      <Input
        variant={inputVariant}
        placeholder="Confirm password"
        onChange={HandleInputChange}
        name="conPass"
        value={conPass}
        mb={3}
      />
      <Button disabled={pending} onClick={Validate} colorScheme="teal">
        Save Changes
      </Button>
    </Flex>
  );
};

export default SecurityTab;
