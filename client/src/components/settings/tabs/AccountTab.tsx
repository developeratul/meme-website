import { Button } from "@chakra-ui/button";
import { Input } from "@chakra-ui/input";
import { Flex } from "@chakra-ui/layout";
import { useColorModeValue } from "@chakra-ui/system";
import { ChangeEvent, useContext, useState } from "react";
import { useHistory } from "react-router";
import { AuthContext } from "../../../providers/AuthProvider";
import useToast from "../../hooks/useToast";

// the account tab
const AccountTab = () => {
  const {
    state: { user },
    dispatch,
  } = useContext(AuthContext);

  const [input, setInput] = useState({
    name: user?.name,
    email: user?.email,
    portfolio: user?.portfolio,
  });
  const [pending, setPending] = useState(false);

  const { name, email, portfolio } = input;

  const toast = useToast();
  const history = useHistory();

  const inputVariant = useColorModeValue("outline", "filled");

  const validation = !name || !portfolio || !email || pending;

  // for handling input change
  function HandleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    setInput((pre) => ({ ...pre, [name]: value }));
  }

  // for saving the changes in the database
  async function SaveInfo() {
    setPending(true);

    try {
      const res = await fetch("/get_settings/update_account_settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, portfolio }),
      });
      const body = await res.json();

      if (res.ok) {
        dispatch({ type: "LOGIN", payload: body.user });
        setPending(false);
        history.push(`/profile/${user?._id}`);
        toast({ status: "success", description: body.message });
      }
    } catch (err: any) {
      setPending(false);
      toast({ status: "error", description: err.message || err });
    }
  }

  return (
    <Flex direction="column" wrap="wrap">
      <Input
        mb={3}
        onChange={HandleInputChange}
        name="name"
        placeholder="Update name"
        variant={inputVariant}
        value={name}
      />
      <Input
        mb={3}
        onChange={HandleInputChange}
        name="email"
        placeholder="Update email"
        variant={inputVariant}
        value={email}
      />
      <Input
        mb={3}
        onChange={HandleInputChange}
        name="portfolio"
        placeholder="Update portfolio"
        variant={inputVariant}
        value={portfolio}
      />
      <Button disabled={validation} onClick={SaveInfo} colorScheme="teal">
        Save Changes
      </Button>
    </Flex>
  );
};

export default AccountTab;
