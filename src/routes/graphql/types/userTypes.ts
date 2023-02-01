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

const subscribeUserInputType = new GraphQLInputObjectType({
  name: "subscribeUserData",
  fields: {
    who: { type: new GraphQLNonNull(GraphQLID) },
    to: { type: new GraphQLNonNull(GraphQLID) },
  },
});

const unsubscribeUserInputType = new GraphQLInputObjectType({
  name: "unsubscribeUserData",
  fields: {
    who: { type: new GraphQLNonNull(GraphQLID) },
    from: { type: new GraphQLNonNull(GraphQLID) },
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

export const subscribeUser = {
  type: UserType,
  args: {
    data: {
      name: "subscribeUser",
      type: subscribeUserInputType,
    },
  },
  resolve: resolvers.subscribedTo,
};

export const unsubscribeUser = {
  type: UserType,
  args: {
    data: {
      name: "unsubscribeUser",
      type: unsubscribeUserInputType,
    },
  },
  resolve: resolvers.unsubscribedFrom,
};
