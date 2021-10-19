import { Box, Text, Container } from "@chakra-ui/layout";
import Image from "next/image";
import logo_black from "../../images/foodie_logo_black.png";
import logo_white from "../../images/foodie_logo_white.png";
import { useColorMode } from "@chakra-ui/color-mode";

const Welcome = () => {
    const { colorMode, toggleColorMode } = useColorMode();
  return (
    <Container>
      <Box mt="10">
        <Image src={colorMode === "light" ? logo_black : logo_white}
              alt="foodie logo" />
        <Text>Welcome to Foodie!</Text>
      </Box>
    </Container>
  );
};

export default Welcome;
