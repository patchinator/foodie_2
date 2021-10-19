import { Box } from "@chakra-ui/layout";
import { useColorModeValue } from "@chakra-ui/color-mode";

const Background = (props) => {
  return (
    <Box
      bgGradient={useColorModeValue(
        "linear(to-r,green.100,white,green.100)",
        "linear(to-r,gray.800,gray.600,gray.800)"
      )}
      minH="100%"
      width="100%"
      height="100%"
    >
      {props.children}
    </Box>
  );
};

export default Background;
