import {
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from "graphql/type";
import { resolvers } from "../resolvers";

export const UserType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: { type: GraphQLID },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    email: { type: GraphQLString },
    subscribedToUserIds: { type: new GraphQLList(GraphQLID) },
  }),
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
    firstName: { type: new GraphQLNonNull(GraphQLString) },
    lastName: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve: resolvers.createUser,
};
