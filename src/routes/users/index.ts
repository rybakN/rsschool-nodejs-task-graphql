import { FastifyPluginAsyncJsonSchemaToTs } from "@fastify/type-provider-json-schema-to-ts";
import { idParamSchema } from "../../utils/reusedSchemas";
import {
  changeUserBodySchema,
  createUserBodySchema,
  subscribeBodySchema,
} from "./schemas";
import type { UserEntity } from "../../utils/DB/entities/DBUsers";
import { FastifyInstance } from "fastify";
import { ProfileEntity } from "../../utils/DB/entities/DBProfiles";
import { PostEntity } from "../../utils/DB/entities/DBPosts";

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get("/", async function (request, reply): Promise<UserEntity[]> {
    return getUsers(fastify);
  });

  fastify.get(
    "/:id",
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const { id } = request.params;
      const user: UserEntity | null = await getUser(fastify, id);
      if (user === null) throw fastify.httpErrors.notFound();

      return user;
    }
  );

  fastify.post(
    "/",
    {
      schema: {
        body: createUserBodySchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const { body } = request;
      return fastify.db.users.create(body);
    }
  );

  fastify.delete(
    "/:id",
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const { id } = request.params;
      const user: UserEntity | null = await getUser(fastify, id);

      if (user === null) throw fastify.httpErrors.badRequest();

      const allSubscriptionUser: UserEntity[] = await fastify.db.users.findMany(
        { key: "subscribedToUserIds", inArray: id }
      );
      if (allSubscriptionUser.length)
        for (const item of allSubscriptionUser) {
          await delSubscription(fastify, item, id);
        }

      const profile: ProfileEntity | null = await fastify.db.profiles.findOne({
        key: "userId",
        equals: id,
      });
      if (profile) await fastify.db.profiles.delete(profile.id);

      const allPosts: PostEntity[] = await fastify.db.posts.findMany({
        equals: id,
        key: "userId",
      });
      if (allPosts.length)
        for (const item of allPosts) {
          await fastify.db.posts.delete(item.id);
        }

      return fastify.db.users.delete(id);
    }
  );

  fastify.post(
    "/:id/subscribeTo",
    {
      schema: {
        body: subscribeBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const { id } = request.params;
      const { body } = request;
      const user: UserEntity | null = await getUser(fastify, id);
      const userTo: UserEntity | null = await getUser(fastify, body.userId);

      if (!user || !userTo) throw fastify.httpErrors.notFound();

      return await addSubscription(fastify, userTo, id);
    }
  );

  fastify.post(
    "/:id/unsubscribeFrom",
    {
      schema: {
        body: subscribeBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const { id } = request.params;
      const { body } = request;

      const user: UserEntity | null = await getUser(fastify, id);
      const userTo: UserEntity | null = await getUser(fastify, body.userId);

      if (!user || !userTo) throw fastify.httpErrors.notFound();

      if (!userTo.subscribedToUserIds.includes(user.id))
        throw fastify.httpErrors.badRequest();

      return delSubscription(fastify, userTo, user.id);
    }
  );

  fastify.patch(
    "/:id",
    {
      schema: {
        body: changeUserBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const { id } = request.params;
      const userEntity: UserEntity | null = await getUser(fastify, id);
      if (userEntity === null) throw fastify.httpErrors.badRequest();
      return fastify.db.users.change(id, request.body);
    }
  );
};

export default plugin;

export const getUsers = async (
  fastify: FastifyInstance
): Promise<UserEntity[]> => {
  return fastify.db.users.findMany();
};

export const getUser = async (
  fastify: FastifyInstance,
  id: string
): Promise<UserEntity | null> => {
  return fastify.db.users.findOne({
    key: "id",
    equals: id,
  });
};

export const delSubscription = async (
  fastify: FastifyInstance,
  user: UserEntity,
  id: string
): Promise<UserEntity> => {
  return await fastify.db.users.change(user.id, {
    subscribedToUserIds: [
      ...user.subscribedToUserIds.filter((item: string) => {
        if (item !== id) return item;
      }),
    ],
  });
};

export const addSubscription = async (
  fastify: FastifyInstance,
  user: UserEntity,
  id: string
): Promise<UserEntity> => {
  return await fastify.db.users.change(user.id, {
    subscribedToUserIds: [...user.subscribedToUserIds, id],
  });
};
