import {
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from "graphql/type";
import { resolvers } from "../resolvers";

export const PostType = new GraphQLObjectType({
  name: "post",
  fields: {
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    content: { type: GraphQLString },
    userId: { type: GraphQLID },
  },
});

export const postsQuery = {
  type: new GraphQLNonNull(new GraphQLList(PostType)),
  resolve: resolvers.posts,
};

export const postQuery = {
  type: PostType,
  args: {
    id: { type: GraphQLID },
  },
  resolve: resolvers.post,
};

export const addPost = {
  type: PostType,
  args: {
    title: { type: new GraphQLNonNull(GraphQLString) },
    content: { type: new GraphQLNonNull(GraphQLString) },
    userId: { type: new GraphQLNonNull(GraphQLID) },
  },
  resolve: resolvers.createPost,
};
