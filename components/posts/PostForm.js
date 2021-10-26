import { Fragment, useRef, useContext, useState } from "react";
import AuthContext from "../../store/auth-context";
import Background from "../../styles/Background";

import { useColorModeValue } from "@chakra-ui/color-mode";
import {
  Box,
  Button,
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  FormControl,
  FormLabel,
  FormHelperText,
  Textarea,
  useToast,
  Accordion,
  AccordionPanel,
  AccordionItem,
  AccordionButton,
  Input,
  IconButton,
} from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/hooks";
import { ChatIcon, PlusSquareIcon, LinkIcon } from "@chakra-ui/icons";

const PostForm = (props) => {
  const authCtx = useContext(AuthContext);
  const currentUser = authCtx.displayName;
  const currentUserEmail = authCtx.email;
  const toast = useToast();

  const FIREBASE_DB = process.env.NEXT_PUBLIC_FIREBASE;

  const { isOpen, onOpen, onClose } = useDisclosure();
  const enteredInputRef = useRef();
  const enteredImageRef = useRef();
  const enteredLinkRef = useRef();
  const maxChars = 500;

  const submitPostHandler = (event) => {
    event.preventDefault();

    const enteredPost = enteredInputRef.current.value;
    const enteredImage = enteredImageRef.current.value;
    const enteredLink = enteredLinkRef.current.value;

    if (enteredPost.trim().length !== 0) {
      if (enteredPost.trim().length <= maxChars) {
        fetch(`${FIREBASE_DB}${authCtx.token}`, {
          method: "POST",
          body: JSON.stringify({
            user: currentUser,
            email: currentUserEmail,
            post: enteredPost,
            date: new Date(),
            image: enteredImage,
            link: enteredLink,
          }),
        })
          .then(props.onRefresh)
          .then(onClose);
      } else {
        toast({
          description: "Max characters exceeded",
          status: "error",
          duration: 4000,
          isClosable: true,
        });
      }
    } else {
      toast({
        description: "Post must have at least 1 character",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  return (
    <Background>
      <Flex
        justify="center"
        align="center"
        pt={{ base: "4", sm: "4", md: "6", lg: "8" }}
        pb={{ base: "4", sm: "4", md: "6", lg: "8" }}
      >
        <Box>
          <Button onClick={onOpen} rightIcon={<ChatIcon />}>
            Post
          </Button>
        </Box>
      </Flex>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg={useColorModeValue("green.200", "gray.600")}>
          <ModalHeader textAlign="center">
            What are you cooking, {currentUser}?
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={submitPostHandler}>
              <FormControl id="text">
                <Textarea
                  id="text"
                  bg={useColorModeValue("white", "gray.500")}
                  ref={enteredInputRef}
                  placeholder="I am cooking..."
                ></Textarea>
                <FormHelperText>500 chars max</FormHelperText>
              </FormControl>
              <Flex flexDir="row-reverse">
                <IconButton type="submit" icon={<ChatIcon />}>
                  Post
                </IconButton>
              </Flex>
            </form>
          </ModalBody>
          <Accordion allowToggle>
            <AccordionItem>
              <AccordionButton>
                <Box textAlign="left" flex="1">
                  Attach an image
                </Box>
                <PlusSquareIcon />
              </AccordionButton>
              <AccordionPanel>
                <FormControl>
                  <Input
                    ref={enteredImageRef}
                    cursor="grab"
                    placeholder="https://something.com"
                    bg="gray.500"
                    borderRadius="2xl"
                    textColor="black"
                  ></Input>
                  <FormHelperText>Paste your image here.</FormHelperText>
                </FormControl>
              </AccordionPanel>
            </AccordionItem>
            <AccordionItem>
              <AccordionButton>
                <Box textAlign="left" flex="1">
                  Attach a link
                </Box>
                <LinkIcon />
              </AccordionButton>
              <AccordionPanel>
                <FormControl>
                  <Input
                    ref={enteredLinkRef}
                    cursor="grab"
                    placeholder="https://something.com"
                    bg="gray.500"
                    borderRadius="2xl"
                    textColor="black"
                  ></Input>
                  <FormHelperText>Paste your link here.</FormHelperText>
                </FormControl>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </Background>
  );
};

export default PostForm;
