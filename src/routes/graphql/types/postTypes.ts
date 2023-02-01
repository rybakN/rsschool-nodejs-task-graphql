import {
  GraphQLID,
  GraphQLInputObjectType,
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

const createPostInputType = new GraphQLInputObjectType({
  name: "createPost",
  fields: {
    title: { type: new GraphQLNonNull(GraphQLString) },
    content: { type: new GraphQLNonNull(GraphQLString) },
    userId: { type: new GraphQLNonNull(GraphQLID) },
  },
});

const updatePostInputType = new GraphQLInputObjectType({
  name: "updatePost",
  fields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    title: { type: GraphQLString },
    content: { type: GraphQLString },
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
    data: {
      name: "createPost",
      type: createPostInputType,
    },
  },
  resolve: resolvers.createPost,
};

export const updatePost = {
  type: PostType,
  args: {
    data: {
      name: "updatePost",
      type: updatePostInputType,
    },
  },
  resolve: resolvers.updatePost,
};
