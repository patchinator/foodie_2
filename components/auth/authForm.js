import {
  FormControl,
  FormLabel,
  Input,
  FormHelperText,
  Button,
  Box,
  Container,
  Heading,
  Flex,
  useToast,
  Spinner,
} from "@chakra-ui/react";

import { useState, useRef, useContext } from "react";
import { useRouter } from "next/dist/client/router";
import AuthContext from "../../store/auth-context";
import { useColorModeValue } from "@chakra-ui/color-mode";

const AuthForm = () => {
  const enteredEmailRef = useRef();
  const enteredPasswordRef = useRef();
  const enteredDisplayNameRef = useRef();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const authCtx = useContext(AuthContext);
  const toast = useToast();
  const blackWhite = useColorModeValue("black", "white");

  const FIREBASE_API = process.env.NEXT_PUBLIC_FIREBASEDB;

  const authModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  const submitHandler = (event) => {
    event.preventDefault();

    const enteredEmail = enteredEmailRef.current.value;
    const enteredPassword = enteredPasswordRef.current.value;

    setIsLoading(true);
    let url;
    if (isLogin) {
      url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_API}`;
      fetch(url, {
        method: "POST",
        body: JSON.stringify({
          email: enteredEmail,
          password: enteredPassword,
          returnSecureToken: true,
        }),
        headers: { "Content-Type": "application/json" },
      })
        .then((res) => {
          setIsLoading(false);
          if (res.ok) {
            return res.json();
          } else {
            return res.json().then((data) => {
              let errorMessage = "Authentication Failed";
              if (data && data.error && data.error.message) {
                errorMessage = data.error.message;
                throw new Error(errorMessage);
              }
            });
          }
        })
        .then((data) => {
          const expirationTime = new Date(
            new Date().getTime() + +data.expiresIn * 1000
          );
          authCtx.login(
            data.idToken,
            data.email,
            data.displayName,
            expirationTime.toISOString()
          );
          router.push("/");
        })
        .catch((error) => {
          toast({
            description: `${error.message.split("_").join(" ").toLowerCase()}`,
            status: "error",
            duration: 4000,
            isClosable: true,
          });
        });
    } else {
      const enteredDisplayName = enteredDisplayNameRef.current.value;
      url = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${FIREBASE_API}`;
      fetch(url, {
        method: "POST",
        body: JSON.stringify({
          email: enteredEmail,
          password: enteredPassword,
          displayName: enteredDisplayName,
          returnSecureToken: true,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          setIsLoading(false);
          if (res.ok) {
            return res.json();
          } else {
            return res.json().then((data) => {
              let errorMessage = "Authentication Failed";
              if (data && data.error && data.error.message) {
                errorMessage = data.error.message;
                throw new Error(errorMessage);
              }
            });
          }
        })
        .then((data) => {
          setIsLogin(true);
          toast({
            description: `Welcome ${data.displayName}. Time to login!`,
            status: "success",
            duration: 4000,
            isClosable: true,
          });
        })
        .catch((error) => {
          toast({
            description: `${error.message.split("_").join(" ")}`,
            status: "error",
            duration: 4000,
            isClosable: true,
          });
        });
    }
  };

  // ----------------------------------------------------------------------------

  return (
    <Container mt="10">
      <form onSubmit={submitHandler}>
        <Box>
          <Heading textAlign="center">
            {isLogin ? "Login" : "Create Account"}
          </Heading>
        </Box>

        {!isLogin && (
          <FormControl id="username">
            <FormLabel mt="2">Create Username</FormLabel>
            <Input
              bg="whiteAlpha.200"
              type="text"
              placeholder="John"
              ref={enteredDisplayNameRef}
            ></Input>
            <FormHelperText>Create a username for your account.</FormHelperText>
          </FormControl>
        )}

        <FormControl id="email">
          <FormLabel>
            {isLogin ? "Email Address" : "New Email address"}
          </FormLabel>
          <Input
            bg="whiteAlpha.200"
            type="email"
            placeholder="johnDoe@gmail.com"
            ref={enteredEmailRef}
          ></Input>
          <FormHelperText>We will never share your details.</FormHelperText>
        </FormControl>

        <FormControl id="password">
          <FormLabel mt="2">{isLogin ? "Password" : "New Password"}</FormLabel>
          <Input
            bg="whiteAlpha.200"
            type="password"
            placeholder="*******"
            ref={enteredPasswordRef}
          ></Input>
          <FormHelperText>Enter your password.</FormHelperText>
        </FormControl>

        <Flex justifyContent="center">
          <Box mt="2">
            <Flex
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
            >
              {isLoading && (
                <Button
                  mb="1"
                  onClick={(e) => e.stopPropagation()}
                  color={blackWhite}
                  is
                >
                  Sending... <Spinner />
                </Button>
              )}
              {!isLoading && (
                <Button mb="1" type="submit" color={blackWhite}>
                  {isLogin ? "Login" : "Create Account"}
                </Button>
              )}
              <Button
                mt="1"
                type="button"
                color={blackWhite}
                onClick={authModeHandler}
              >
                {isLogin
                  ? "Create new Account"
                  : "Log in with Existing Account"}
              </Button>
            </Flex>
          </Box>
        </Flex>
      </form>
    </Container>
  );
};

export default AuthForm;
