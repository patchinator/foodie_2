import { Box, Text, Container, Flex } from "@chakra-ui/layout";
import Image from "next/image";
import logo_black from "../../images/foodie_logo_black.png";
import logo_white from "../../images/foodie_logo_white.png";
import { useColorMode } from "@chakra-ui/color-mode";
import Link from 'next/link';

const Welcome = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <Container>
      <Box mt="10" p="4" bg="blackAlpha.300" borderRadius="lg">
        <Image
          src={colorMode === "light" ? logo_black : logo_white}
          alt="foodie logo"
        />
        <Flex flexDir="column">
          <Text textAlign="center" fontSize="2xl">
            Welcome to Foodie!
          </Text>
          <br />
          <Text fontSize="2xl">
            Foodie is a website where people can talk about anything...well...
            foodie!
          </Text>
          <br />
          <Text fontSize="2xl">
            Simply <Link href="/auth/log-in">create an account</Link>, log in, and off you go! Their
            are plenty of interesting recipes to discover. Or post about one of
            your own! All are welcome.
          </Text>
          <br />
          <Text textAlign="center" fontSize="2xl">Happy cooking!</Text>
        </Flex>
      </Box>
    </Container>
  );
};

export default Welcome;
