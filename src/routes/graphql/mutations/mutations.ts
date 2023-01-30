import { GraphQLObjectType } from "graphql/type";
import { addUser } from "../types/userTypes";
import { addPost } from "../types/postTypes";
import { addProfile } from "../types/profileTypes";

export const Mutations = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addUser: addUser,
    addPost: addPost,
    addProfile: addProfile,
  },
});
