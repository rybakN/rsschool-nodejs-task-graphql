import {
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from "graphql/type";
import { resolvers } from "../resolvers";

export const ProfileType = new GraphQLObjectType({
  name: "profile",
  fields: {
    id: { type: GraphQLID },
    avatar: { type: GraphQLString },
    sex: { type: GraphQLString },
    birthday: { type: GraphQLInt },
    country: { type: GraphQLString },
    street: { type: GraphQLString },
    city: { type: GraphQLString },
    memberTypeId: { type: GraphQLString },
    userId: { type: GraphQLID },
  },
});

export const profilesQuery = {
  type: new GraphQLNonNull(new GraphQLList(ProfileType)),
  resolve: resolvers.profiles,
};

export const profileQuery = {
  type: ProfileType,
  args: {
    id: { type: GraphQLID },
  },
  resolve: resolvers.profile,
};

export const addProfile = {
  type: ProfileType,
  args: {
    avatar: { type: new GraphQLNonNull(GraphQLString) },
    sex: { type: new GraphQLNonNull(GraphQLString) },
    birthday: { type: new GraphQLNonNull(GraphQLInt) },
    country: { type: new GraphQLNonNull(GraphQLString) },
    street: { type: new GraphQLNonNull(GraphQLString) },
    city: { type: new GraphQLNonNull(GraphQLString) },
    memberTypeId: { type: new GraphQLNonNull(GraphQLString) },
    userId: { type: new GraphQLNonNull(GraphQLID) },
  },
  resolve: resolvers.createProfile,
};
