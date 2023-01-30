import { GraphQLID, GraphQLInt, GraphQLObjectType } from "graphql/type";

export const MemberType = new GraphQLObjectType({
  name: "memberTypes",
  fields: {
    id: { type: GraphQLID },
    discount: { type: GraphQLInt },
    monthPostsLimit: { type: GraphQLInt },
  },
});
