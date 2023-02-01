import {
  GraphQLEnumType,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
} from "graphql/type";
import { resolvers } from "../resolvers";

export const idMemberType = new GraphQLEnumType({
  name: "idMemberType",
  values: {
    basic: { value: "basic" },
    business: { value: "business" },
  },
});

const idMemberTypeInputType = new GraphQLInputObjectType({
  name: "idInputMemberType",
  fields: {
    id: {
      type: new GraphQLNonNull(idMemberType),
    },
  },
});

export const MemberType = new GraphQLObjectType({
  name: "memberTypes",
  fields: {
    id: { type: idMemberType },
    discount: { type: GraphQLInt },
    monthPostsLimit: { type: GraphQLInt },
  },
});

const updateMemberTypeInputType = new GraphQLInputObjectType({
  name: "updateMemberType",
  fields: {
    id: { type: new GraphQLNonNull(idMemberType) },
    discount: { type: GraphQLInt },
    monthPostsLimit: { type: GraphQLInt },
  },
});

export const memberTypesQuery = {
  type: new GraphQLNonNull(new GraphQLList(MemberType)),
  resolve: resolvers.memberTypes,
};

export const memberTypeQuery = {
  type: MemberType,
  args: {
    data: {
      name: "data",
      type: idMemberTypeInputType,
    },
  },
  resolve: resolvers.memberType,
};

export const updateMemberType = {
  type: MemberType,
  args: {
    data: {
      name: "data",
      type: updateMemberTypeInputType,
    },
  },
  resolve: resolvers.updateMemberType,
};
