import { GraphQLObjectType } from "graphql/type";
import { userQuery, usersQuery } from "../types/userTypes";
import { postQuery, postsQuery } from "../types/postTypes";
import { profileQuery, profilesQuery } from "../types/profileTypes";
import { memberTypeQuery, memberTypesQuery } from "../types/memberTypes";

export const Query = new GraphQLObjectType({
  name: "Query",
  fields: {
    users: usersQuery,
    posts: postsQuery,
    profiles: profilesQuery,
    memberTypes: memberTypesQuery,
    user: userQuery,
    post: postQuery,
    profile: profileQuery,
    memberType: memberTypeQuery,
  },
});
