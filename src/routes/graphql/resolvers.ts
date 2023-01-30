import { getUser, getUsers } from "../users";
import { FastifyInstance } from "fastify";
import { UserEntity } from "../../utils/DB/entities/DBUsers";
import { getPost, getPosts } from "../posts";
import { getProfile, getProfiles } from "../profiles";
import { getMemberTypes } from "../member-types";
import { PostEntity } from "../../utils/DB/entities/DBPosts";
import { ProfileEntity } from "../../utils/DB/entities/DBProfiles";

export const resolvers = {
  users: async (parent: any, args: any, fastify: FastifyInstance) => {
    return await getUsers(fastify);
  },
  posts: async (parent: any, args: any, fastify: FastifyInstance) => {
    return await getPosts(fastify);
  },
  profiles: async (parent: any, args: any, fastify: FastifyInstance) => {
    return await getProfiles(fastify);
  },
  memberTypes: async (parent: any, args: any, fastify: FastifyInstance) => {
    return await getMemberTypes(fastify);
  },
  user: async (parent: any, args: { id: string }, fastify: FastifyInstance) => {
    const user: UserEntity | null = await getUser(fastify, args.id);
    if (!user) throw fastify.httpErrors.notFound();
    return user;
  },
  post: async (parent: any, args: { id: string }, fastify: FastifyInstance) => {
    const post: PostEntity | null = await getPost(fastify, args.id);
    if (!post) throw fastify.httpErrors.notFound();
    return post;
  },
  profile: async (
    parent: any,
    args: { id: string },
    fastify: FastifyInstance
  ) => {
    const profile: ProfileEntity | null = await getProfile(fastify, args.id);
    if (!profile) throw fastify.httpErrors.notFound();
    return profile;
  },
  createUser: async (
    parent: any,
    args: { firstName: string; lastName: string; email: string },
    context: FastifyInstance
  ) => {
    return await context.db.users.create(args);
  },
  createPost: async (
    parent: any,
    args: { title: string; content: string; userId: string },
    context: FastifyInstance
  ) => {
    return await context.db.posts.create(args);
  },
  createProfile: async (
    parent: any,
    args: {
      avatar: string;
      sex: string;
      birthday: number;
      country: string;
      street: string;
      city: string;
      memberTypeId: string;
      userId: string;
    },
    context: FastifyInstance
  ) => {
    return await context.db.profiles.create(args);
  },
};
