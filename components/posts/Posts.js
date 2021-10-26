import PostCard from "./PostCard";
import { Flex } from "@chakra-ui/layout";
import Background from "../../styles/Background";

const Posts = (props) => {
  return (
    <Background>
      <Flex flexDir="column">
        {props.posts.map((post) => (
          <PostCard
            id={post["id"]}
            key={post["id"]}
            user={post["user"]}
            post={post["post"]}
            email={post["email"]}
            date={post["date"]}
            image={post["image"]}
            link={post["link"]}
            onRefresh={props.onRefresh}
          ></PostCard>
        ))}
      </Flex>
    </Background>
  );
};

export default Posts;
