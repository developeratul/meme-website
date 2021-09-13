import { Container, Heading } from "@chakra-ui/layout";
import { Tab, TabList, TabPanels, Tabs } from "@chakra-ui/tabs";
import { useContext, useEffect } from "react";
import { useHistory } from "react-router";
import useToast from "../components/hooks/useToast";
import { AuthContext } from "../providers/AuthProvider";
import { TabPanel } from "@chakra-ui/react";
import { useColorModeValue } from "@chakra-ui/system";

// tabs
import AccountTab from "../components/settings/tabs/AccountTab";
import SecurityTab from "../components/settings/tabs/SecurityTab";
import UpdateAvatarTab from "../components/settings/tabs/UpdateAvatarTab";

const Settings = () => {
  const {
    state: { user },
  } = useContext(AuthContext);
  const history = useHistory();
  const toast = useToast();

  const panelBackground = useColorModeValue("gray.50", "gray.700");

  useEffect(() => {
    if (!user) {
      history.push("/");
      toast({ status: "warning", description: "You don't have access to this page" });
    }

    document.title = "Settings ⚙";
  }, []);

  return (
    <Container maxW="container.sm" py={10}>
      <Heading textAlign="center" fontWeight="normal" mb={10} color="teal">
        Settings
      </Heading>

      {/* tabpanel */}
      <Tabs colorScheme="teal" variant="solid-rounded" isFitted>
        <TabList fontWeight="normal">
          <Tab>Account</Tab>
          <Tab>Avatar</Tab>
          <Tab>Security</Tab>
        </TabList>

        <TabPanels boxShadow="lg" bg={panelBackground} my={5} rounded={5}>
          <TabPanel>
            <AccountTab />
          </TabPanel>
          <TabPanel>
            <UpdateAvatarTab />
          </TabPanel>
          <TabPanel>
            <SecurityTab />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Container>
  );
};

export default Settings;
