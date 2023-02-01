import { GraphQLObjectType } from "graphql/type";
import {
  addUser,
  subscribeUser,
  unsubscribeUser,
  updateUser,
} from "../types/userTypes";
import { addPost, updatePost } from "../types/postTypes";
import { addProfile, updateProfile } from "../types/profileTypes";
import { updateMemberType } from "../types/memberTypes";

export const Mutations = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addUser: addUser,
    addPost: addPost,
    addProfile: addProfile,
    updateUser: updateUser,
    updatePost: updatePost,
    updateProfile: updateProfile,
    updateMemberType: updateMemberType,
    subscribeTo: subscribeUser,
    unsubscribeFrom: unsubscribeUser,
  },
});
