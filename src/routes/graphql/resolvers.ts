import { addSubscription, delSubscription, getUser, getUsers } from "../users";
import { FastifyInstance } from "fastify";
import { UserEntity } from "../../utils/DB/entities/DBUsers";
import { createPost, getPost, getPosts } from "../posts";
import { getProfile, getProfiles } from "../profiles";
import { getMemberType, getMemberTypes } from "../member-types";
import { PostEntity } from "../../utils/DB/entities/DBPosts";
import { ProfileEntity } from "../../utils/DB/entities/DBProfiles";
import { MemberTypeEntity } from "../../utils/DB/entities/DBMemberTypes";

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
  memberType: async (
    parent: any,
    args: {
      data: {
        id: string;
      };
    },
    fastify: FastifyInstance
  ) => {
    console.log(args.data.id + "");
    const memberType: MemberTypeEntity | null = await getMemberType(
      fastify,
      args.data.id
    );
    return memberType;
  },
  createUser: async (
    parent: any,
    args: {
      data: {
        firstName: string;
        lastName: string;
        email: string;
      };
    },
    context: FastifyInstance
  ) => {
    return await context.db.users.create(args.data);
  },
  createPost: async (
    parent: any,
    args: {
      data: {
        title: string;
        content: string;
        userId: string;
      };
    },
    context: FastifyInstance
  ) => {
    const { userId } = args.data;
    const user: UserEntity | null = await getUser(context, userId);
    if (!user) throw context.httpErrors.badRequest();
    return await createPost(context, args.data);
  },
  createProfile: async (
    parent: any,
    args: {
      data: {
        avatar: string;
        sex: string;
        birthday: number;
        country: string;
        street: string;
        city: string;
        memberTypeId: string;
        userId: string;
      };
    },
    context: FastifyInstance
  ) => {
    const { userId } = args.data;
    const user: UserEntity | null = await getUser(context, userId);
    const profile: ProfileEntity | null = await context.db.profiles.findOne({
      key: "userId",
      equals: userId,
    });
    if (!user || profile) throw context.httpErrors.badRequest();
    return await context.db.profiles.create(args.data);
  },

  updateUser: async (
    parent: any,
    args: {
      data: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
      };
    },
    context: FastifyInstance
  ) => {
    const { id } = args.data;
    const userEntity: UserEntity | null = await getUser(context, id);
    if (userEntity === null) throw context.httpErrors.badRequest();
    return await context.db.users.change(id, args.data);
  },

  updatePost: async (
    parent: any,
    args: {
      data: {
        id: string;
        title: string;
        content: string;
        userId: string;
      };
    },
    context: FastifyInstance
  ) => {
    const { id } = args.data;
    const postEntity: PostEntity | null = await getPost(context, id);
    if (postEntity === null) throw context.httpErrors.badRequest();
    return await context.db.posts.change(id, args.data);
  },

  updateProfile: async (
    parent: any,
    args: {
      data: {
        id: string;
        avatar: string;
        sex: string;
        birthday: number;
        country: string;
        street: string;
        city: string;
        memberTypeId: string;
      };
    },
    context: FastifyInstance
  ) => {
    const { id } = args.data;
    const profile: ProfileEntity | null = await getProfile(context, id);
    if (profile === null) throw context.httpErrors.badRequest();
    return await context.db.profiles.change(id, args.data);
  },

  updateMemberType: async (
    parent: any,
    args: {
      data: {
        id: string;
        discount: number;
        monthPostsLimit: number;
      };
    },
    context: FastifyInstance
  ) => {
    const { id } = args.data;
    return await context.db.memberTypes.change(id, args.data);
  },

  getPostsByUserId: async (
    parent: any,
    args: any,
    context: FastifyInstance
  ) => {
    return await context.db.posts.findMany({
      key: "userId",
      equals: parent.id,
    });
  },

  getProfileByUserId: async (
    parent: any,
    args: any,
    context: FastifyInstance
  ) => {
    return await context.db.profiles.findOne({
      key: "userId",
      equals: parent.id,
    });
  },

  getMemberTypeByUserId: async (
    parent: any,
    args: any,
    context: FastifyInstance
  ) => {
    const profile: ProfileEntity | null = await context.db.profiles.findOne({
      key: "userId",
      equals: parent.id,
    });
    if (!profile) return;
    return await context.db.memberTypes.findOne({
      key: "id",
      equals: profile.memberTypeId,
    });
  },

  subscribedTo: async (
    parent: any,
    args: {
      data: {
        who: string;
        to: string;
      };
    },
    context: FastifyInstance
  ) => {
    const { who } = args.data;
    const { data } = args;
    const user: UserEntity | null = await getUser(context, data.to);
    const userTo: UserEntity | null = await getUser(context, who);

    if (!user || !userTo) throw context.httpErrors.notFound();

    return await addSubscription(context, userTo, user.id);
  },

  unsubscribedFrom: async (
    parent: any,
    args: {
      data: {
        who: string;
        from: string;
      };
    },
    context: FastifyInstance
  ) => {
    const { who } = args.data;
    const { data } = args;

    const user: UserEntity | null = await getUser(context, who);
    const userTo: UserEntity | null = await getUser(context, data.from);

    if (!user || !userTo) throw context.httpErrors.notFound();

    if (!user.subscribedToUserIds.includes(userTo.id))
      throw context.httpErrors.badRequest();

    return delSubscription(context, user, userTo.id);
  },

  userSubscribedTo: async (
    parent: any,
    args: any,
    context: FastifyInstance
  ) => {
    const { subscribedToUserIds } = parent;
    const users: UserEntity[] = [];
    for (let i = 0; i < subscribedToUserIds.length; i++) {
      users.push(
        <UserEntity>await context.db.users.findOne({
          key: "id",
          equals: subscribedToUserIds[i],
        })
      );
    }
    return users;
  },

  subscribedToUser: async (
    parent: any,
    args: any,
    context: FastifyInstance
  ) => {
    return await context.db.users.findMany({
      key: "subscribedToUserIds",
      inArray: parent.id,
    });
  },
};
