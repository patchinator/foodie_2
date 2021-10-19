import { useContext, useRef, useState, useEffect } from "react";

import {
  Box,
  Text,
  Flex,
  Divider,
  List,
  ListItem,
  Link,
} from "@chakra-ui/layout";
import { Button, IconButton } from "@chakra-ui/button";
import { useColorModeValue } from "@chakra-ui/color-mode";
import { FormControl } from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { ChevronDownIcon, DeleteIcon, StarIcon, ChatIcon } from "@chakra-ui/icons";
import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
} from "@chakra-ui/accordion";
import { useToast } from "@chakra-ui/toast";
import AuthContext from "../../store/auth-context";
import { Avatar, AvatarBadge } from "@chakra-ui/avatar";

const PostCard = (props) => {
  const toast = useToast();

  const authCtx = useContext(AuthContext);

  const [comments, setComments] = useState([]);
  const [likes, setLikes] = useState([]);
  const [liked, setLiked] = useState(false);
  const [likedPost, setLikedPost] = useState(false);
  const [refreshComments, setRefreshComments] = useState(0);

  const enteredCommentRef = useRef("");
  const FIREBASE_COMMENTS = process.env.NEXT_PUBLIC_FIREBASE_CM;
  const FIREBASE_LIKES = process.env.NEXT_PUBLIC_FIREBASE_LIKES;
  const FIREBASE_POSTS = process.env.NEXT_PUBLIC_FIREBASE_POSTS;

  const maxChars = 500;
  const themeColor = useColorModeValue("white", "gray.800");
  const inputColor = useColorModeValue("gray.100", "whiteAlpha.900");
  const commentLength = comments.filter(
    (post) => post.postId === props.id
  ).length;
  const likeLength = likes.filter((like) => like.postId === props.id).length;

  // calculate Date

  const calculateDate = (date) => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const days = ["Mon", "Tues", "Weds", "Thurs", "Fri", "Sat", "Sun"];
    const newDate = new Date(date);
    const minutes = newDate.getMinutes();
    const hour = newDate.getHours();
    const day = newDate.getDate();
    const weekDay = newDate.getDay();
    const month = newDate.getMonth();
    const year = newDate.getFullYear();

    return `${hour}:${
      minutes.toString().split("").length !== 1 ? minutes : "0" + minutes
    } ${days[weekDay]} ${day}-${months[month]} ${year}`;
  };

  const refreshCommentsHandler = () => {
    setRefreshComments(Math.random());
  };

  // delete comment from DB

  const deleteCommentHandler = () => {
    comments.find((comment) => {
      if (comment.postId === props.id)
        fetch(`${FIREBASE_COMMENTS}/${comment.id}.json?auth=${authCtx.token}`, {
          method: "DELETE",
        }).then((res) => {
          if (res.ok) {
            refreshCommentsHandler();
            toast({
              description: "Comment succesfully removed",
              position: "top",
              status: "success",
              duration: 4000,
              isClosable: true,
            });
          } else {
            toast({
              description: "Unable to remove comment",
              position: "top",
              status: "error",
              duration: 4000,
              isClosable: true,
            });
          }
        });
    });
  };

  // delete posts from DB

  const deletePostHandler = () => {
    fetch(
      `${FIREBASE_POSTS}/${props.id}.json?auth=${authCtx.token}`,
      {
        method: "DELETE",
      }
    ).then((res) => {
      if (res.ok) {
        // remove all comments associated with that post

        comments.map((comment) =>
          comment.postId === props.id
            ? fetch(
                `${FIREBASE_COMMENTS}/${comment.id}.json?auth=${authCtx.token}`,
                { method: "DELETE" }
              )
            : ""
        );
        // remove all likes associated with that post

        likes.map((like) =>
          like.postId === props.id
            ? fetch(`${FIREBASE_LIKES}/${like.id}.json?auth=${authCtx.token}`, {
                method: "DELETE",
              })
            : ""
        );

        props.onRefresh();
        refreshCommentsHandler();
        toast({
          description: "Post succesfully removed",
          position: "top",
          status: "success",
          duration: 4000,
          isClosable: true,
        });
      } else {
        toast({
          description: "Unable to remove post",
          position: "top",
          status: "error",
          duration: 4000,
          isClosable: true,
        });
      }
    });
  };

  // post comments to DB

  const submitCommentHandler = (event) => {
    event.preventDefault();

    const enteredComment = enteredCommentRef.current.value;
    const currentUser = authCtx.displayName;
    const currentUserEmail = authCtx.email;

    if (enteredComment.trim().length >= 1) {
      if (enteredComment.trim().length <= maxChars) {
        fetch(`${FIREBASE_COMMENTS}.json?auth=${authCtx.token}`, {
          method: "POST",
          body: JSON.stringify({
            comment: enteredComment,
            commentUser: currentUser,
            commentEmail: currentUserEmail,
            commentDate: new Date(),
            postId: props.id,
          }),
          headers: { "Content-Tpye": "application/json" },
        }).then(refreshCommentsHandler);
      } else {
        toast({
          description: "Max characters exceeded.",
          position: "top",
          status: "error",
          duration: 4000,
          isClosable: true,
        });
      }
    } else {
      toast({
        description: "Comments must have at least 1 character.",
        position: "top",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  // fetch all comments from DB

  useEffect(() => {
    fetch(
      `${FIREBASE_COMMENTS}.json?auth=${authCtx.token}`
    )
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        throw new Error();
      })
      .then((data) => {
        const loadedComments = [];
        for (const key in data) {
          loadedComments.push({
            commentUser: data[key].commentUser,
            commentEmail: data[key].commentEmail,
            comment: data[key].comment,
            commentDate: data[key].commentDate,
            postId: data[key].postId,
            id: key,
          });
        }
        setComments(loadedComments);
      });

    // fetch likes from DB

    fetch(`${FIREBASE_LIKES}.json?auth=${authCtx.token}`)
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        throw new Error();
      })
      .then((data) => {
        const loadedLikes = [];
        for (const key in data) {
          loadedLikes.push({
            id: key,
            postId: data[key].postId,
            likedBy: data[key].likedBy,
          });
        }

        // check if user has liked a post

        if (authCtx.isLoggedIn) {
          const likedState = loadedLikes.some(
            (like) => like.likedBy === authCtx.displayName
          );
          setLiked(likedState);
        }

        // check if the like is on the post

        if (authCtx.isLoggedIn) {
          const currentPost = loadedLikes.some(
            (like) => like.postId === props.id
          );
          setLikedPost(currentPost);
        }

        setLikes(loadedLikes);
      });
  }, [
    refreshComments,
    authCtx.isLoggedIn,
    authCtx.displayName,
    authCtx.token,
    props.id,
    FIREBASE_LIKES,
    FIREBASE_COMMENTS,
  ]);

  const likePostHandler = () => {
    fetch(`${FIREBASE_LIKES}.json?auth=${authCtx.token}`, {
      method: "POST",
      body: JSON.stringify({
        likedBy: authCtx.displayName,
        postId: props.id,
      }),
    }).then(refreshCommentsHandler);
  };

  const unlikePostHandler = () => {
    likes.find((like) => {
      if (like.likedBy === props.user)
        fetch(`${FIREBASE_LIKES}/${like.id}.json?auth=${authCtx.token}`, {
          method: "DELETE",
        }).then(refreshCommentsHandler);
    });
  };

  return (
    <Flex justify="center">
      <Box
        bg={themeColor}
        mb="4"
        borderRadius="lg"
        width={{ base: "100%", sm: "80%", md: "70%", lg: "40%" }}
        boxShadow="lg"
      >
        <Flex m="2" justify="space-between" align="center">
          <Box>
            <Flex align="center">
              <Avatar name={props.user} size="xs" mr="3">
                <AvatarBadge
                  borderColor="black"
                  bg={
                    authCtx.displayName === props.user ? "green.300" : "red.400"
                  }
                  boxSize="1.25em"
                />
              </Avatar>
              <Text
                fontWeight="bold"
                fontSize={{ base: "11px", sm: "12px", md: "16px", lg: "18px" }}
              >
                {props.user + " " + calculateDate(props.date)}
              </Text>
            </Flex>
          </Box>
          <Text fontSize={{ base: "11px", sm: "12px", md: "16px", lg: "18px" }}>
            {props.email}
          </Text>
        </Flex>
        <Flex justify="center">
          {props.image && <img src={props.image} alt={props.image} />}
        </Flex>
        <Box bg={inputColor}>
          <Text mb="2" color="black" p="2" flexGrow="1" whiteSpace="pre-wrap">
            {props.post}
          </Text>
        </Box>
        {props.link && (
          <Box m="2">
            <Link href={props.link}>{props.link}</Link>
          </Box>
        )}
        <Box m="2">
          <Flex justify="space-between">
            <Box>
              {/* liked = like.likedBy === authCtx.displayName */}
              {/* likedPost = like.postId === props.id */}

              {!liked && likedPost && (
                <Button size="sm" onClick={likePostHandler}>
                  like
                </Button>
              )}
              {!likedPost && (
                <Button size="sm" onClick={likePostHandler}>
                  like
                </Button>
              )}
              {liked && likedPost && (
                <Button size="sm" onClick={unlikePostHandler}>
                  unlike
                </Button>
              )}
              <Button ml="2" size="sm">
                share
              </Button>
            </Box>
            <Box>
              <Flex align="center">
                {likeLength >= 1 && (
                  <Flex align="center">
                    <Text mr="1">
                      {likeLength} {likeLength === 1 ? "like" : "likes"}
                    </Text>
                    <StarIcon w="4" height="4" color="yellow.400" mr="2" />
                  </Flex>
                )}
                {authCtx.displayName === props.user && (
                  <IconButton
                    onClick={deletePostHandler}
                    size="sm"
                    colorScheme="red"
                    icon={<DeleteIcon />}
                  />
                )}
              </Flex>
            </Box>
          </Flex>
          <Flex>
            <Divider mb="2" mt="2" />
          </Flex>
          <form onSubmit={submitCommentHandler}>
            <FormControl id="text">
              <Flex align="center" justify="space-between">
                <Avatar
                  name={authCtx.displayName}
                  size="sm"
                  position="relative"
                >
                  <AvatarBadge
                    borderWidth="thin"
                    borderColor="black"
                    bg="green.300"
                    boxSize="1.1em"
                  />
                </Avatar>

                <Input
                  ml="1"
                  mr="1"
                  height="8"
                  type="text"
                  ref={enteredCommentRef}
                  focusBorderColor={useColorModeValue("green.500", "gray.500")}
                  color="black"
                  _placeholder={{
                    color: useColorModeValue("gray.400", "gray.200"),
                  }}
                  placeholder="Write a comment..."
                  borderRadius="3xl"
                  width="80%"
                  bg={useColorModeValue("white", "gray.400")}
                ></Input>
                <Button type="submit" height="9" borderRadius="3xl">
                  Comment
                </Button>
              </Flex>
            </FormControl>
          </form>
          <Accordion mt="2" allowToggle>
            <AccordionItem>
              <AccordionButton>
                <Box flex="1" textAlign="left">
                  {commentLength}{" "}
                  {commentLength !== 1 ? "comments " : "comment "}
                  <ChevronDownIcon />
                </Box>
              </AccordionButton>
              <AccordionPanel>
                <List>
                  {comments
                    .filter((post) => post.postId === props.id)
                    .map((comment) => (
                      <ListItem key={comment.id}>
                        <Box>
                          <Flex justify="space-between">
                            <Flex>
                              <Avatar
                                name={comment.commentUser}
                                size="xs"
                                mr="1"
                              ></Avatar>
                              <Text>{comment.commentUser}</Text>
                            </Flex>
                            <Box>
                              <Flex>
                                <Text mb="1">
                                  {calculateDate(comment.commentDate)}
                                </Text>
                                {authCtx.displayName ===
                                  comment.commentUser && (
                                  <IconButton
                                    ml="2"
                                    onClick={deleteCommentHandler}
                                    size="xs"
                                    colorScheme="red"
                                    icon={<DeleteIcon />}
                                  />
                                )}
                              </Flex>
                            </Box>
                          </Flex>
                        </Box>
                        <Box
                          p="1"
                          pl="2"
                          pr="2"
                          bg={inputColor}
                          borderRadius="2xl"
                        >
                          <Text color="black">{comment.comment}</Text>
                        </Box>
                        <Divider m="2" />
                      </ListItem>
                    ))}
                </List>
              </AccordionPanel>
              {commentLength === 0 && (
                <AccordionPanel>
                  <Text textAlign="center">
                    No comments. Be the first to comment!
                  </Text>
                </AccordionPanel>
              )}
            </AccordionItem>
          </Accordion>
        </Box>
      </Box>
    </Flex>
  );
};

export default PostCard;
