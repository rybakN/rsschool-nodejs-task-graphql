import { GraphQLObjectType } from "graphql/type";
import { userQuery, usersQuery } from "../types/userTypes";
import { postQuery, postsQuery } from "../types/postTypes";
import { profileQuery, profilesQuery } from "../types/profileTypes";

export const Query = new GraphQLObjectType({
  name: "Query",
  fields: {
    users: usersQuery,
    posts: postsQuery,
    profiles: profilesQuery,
    user: userQuery,
    post: postQuery,
    profile: profileQuery,
  },
});
