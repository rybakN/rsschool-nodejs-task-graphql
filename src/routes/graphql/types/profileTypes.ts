import {
  GraphQLID,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from "graphql/type";
import { resolvers } from "../resolvers";
import { idMemberType } from "./memberTypes";

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
    memberTypeId: { type: idMemberType },
    userId: { type: GraphQLID },
  },
});

export const profilesQuery = {
  type: new GraphQLNonNull(new GraphQLList(ProfileType)),
  resolve: resolvers.profiles,
};

const createProfilesInputType = new GraphQLInputObjectType({
  name: "createProfiles",
  fields: {
    avatar: { type: new GraphQLNonNull(GraphQLString) },
    sex: { type: new GraphQLNonNull(GraphQLString) },
    birthday: { type: new GraphQLNonNull(GraphQLInt) },
    country: { type: new GraphQLNonNull(GraphQLString) },
    street: { type: new GraphQLNonNull(GraphQLString) },
    city: { type: new GraphQLNonNull(GraphQLString) },
    memberTypeId: { type: new GraphQLNonNull(idMemberType) },
    userId: { type: new GraphQLNonNull(GraphQLID) },
  },
});

const updateProfilesInputType = new GraphQLInputObjectType({
  name: "updateProfiles",
  fields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    avatar: { type: GraphQLString },
    sex: { type: GraphQLString },
    birthday: { type: GraphQLInt },
    country: { type: GraphQLString },
    street: { type: GraphQLString },
    city: { type: GraphQLString },
    memberTypeId: { type: idMemberType },
  },
});

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
    data: {
      name: "data",
      type: createProfilesInputType,
    },
  },
  resolve: resolvers.createProfile,
};

export const updateProfile = {
  type: ProfileType,
  args: {
    data: {
      name: "data",
      type: updateProfilesInputType,
    },
  },
  resolve: resolvers.updateProfile,
};
