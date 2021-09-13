import { useColorModeValue } from "@chakra-ui/color-mode";
import { Image } from "@chakra-ui/image";
import { Box } from "@chakra-ui/layout";
import { Meme } from "../../interfaces";

interface Props {
  meme: Meme | undefined;
}

const MemeImage = ({ meme }: Props) => {
  const imageContainerBackground = useColorModeValue("gray.100", "gray.700");

  return (
    <Box
      gridColumn={["1 / -1", "1 / -1", "1 / 8", "1 / 8"]}
      bg={imageContainerBackground}
      display="grid"
      placeItems="center"
    >
      <Image
        src={meme?.photoUrl}
        alt={meme?.title}
        width="100%"
        height={["300px", "300px", "500px", "500px"]}
        objectFit="contain"
      />
    </Box>
  );
};

export default MemeImage;
