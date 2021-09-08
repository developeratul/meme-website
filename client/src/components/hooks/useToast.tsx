import { useToast as toaster } from "@chakra-ui/react";

function useToast() {
  const toast = toaster({ position: "top", isClosable: true, variant: "solid" });

  return toast;
}

export default useToast;
