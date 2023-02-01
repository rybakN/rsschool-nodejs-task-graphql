import {
  GraphQLID,
  GraphQLInputObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from "graphql/type";
import { resolvers } from "../resolvers";
import { PostType } from "./postTypes";
import { ProfileType } from "./profileTypes";
import { MemberType } from "./memberTypes";

export const UserType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: { type: GraphQLID },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    email: { type: GraphQLString },
    subscribedToUserIds: { type: new GraphQLList(GraphQLID) },
    posts: {
      type: new GraphQLList(PostType),
      resolve: resolvers.getPostsByUserId,
    },
    profile: {
      type: ProfileType,
      resolve: resolvers.getProfileByUserId,
    },
    memberType: {
      type: MemberType,
      resolve: resolvers.getMemberTypeByUserId,
    },
  }),
});

const createUserInputType = new GraphQLInputObjectType({
  name: "createUser",
  fields: {
    firstName: { type: new GraphQLNonNull(GraphQLString) },
    lastName: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
  },
});

const updateUserInputType = new GraphQLInputObjectType({
  name: "updateUser",
  fields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    email: { type: GraphQLString },
  },
});

export const usersQuery = {
  type: new GraphQLNonNull(new GraphQLList(UserType)),
  resolve: resolvers.users,
};

export const userQuery = {
  type: UserType,
  args: {
    id: { type: GraphQLID },
  },
  resolve: resolvers.user,
};

export const addUser = {
  type: UserType,
  args: {
    data: {
      name: "createData",
      type: createUserInputType,
    },
  },
  resolve: resolvers.createUser,
};

export const updateUser = {
  type: UserType,
  args: {
    data: {
      name: "updateData",
      type: updateUserInputType,
    },
  },
  resolve: resolvers.updateUser,
};
