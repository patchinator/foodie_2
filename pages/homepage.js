import { Fragment, useContext, useState, useEffect } from "react";
import { useToast } from "@chakra-ui/react";
import AuthContext from "../store/auth-context";

import PostForm from "../components/posts/PostForm";
import Posts from "../components/posts/Posts";

export default function PostsPage() {
  const authCtx = useContext(AuthContext);
  const isLoggedIn = authCtx.isLoggedIn;
  const FIREBASE_DB_POSTS = process.env.NEXT_PUBLIC_FIREBASE;
  const [refresh, setRefresh] = useState(0);
  const [posts, setPosts] = useState([]);
  const toast = useToast();

  const refreshPostsHandler = () => {
    setRefresh(Math.random());
  };

  useEffect(() => {
    fetch(`${FIREBASE_DB_POSTS}${authCtx.token}`)
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        throw new Error();
      })
      .then((data) => {
        const loadedPosts = [];
        for (const key in data) {
          loadedPosts.push({
            user: data[key].user,
            email: data[key].email,
            post: data[key].post,
            date: data[key].date,
            image: data[key].image,
            link: data[key].link,
            id: key,
          });
        }
        setPosts(loadedPosts.reverse());
      })
      .catch((err) => {
        toast({
          description: `You have to sign in to see posts!`,
          position: "top",
          status: "info",
          duration: 4000,
          isClosable: true,
        });
      });
  }, [refresh]);

  return (
    <Fragment>
      {isLoggedIn && <PostForm onRefresh={refreshPostsHandler} />}
      {isLoggedIn && <Posts onRefresh={refreshPostsHandler} posts={posts} />}
    </Fragment>
  );
}
