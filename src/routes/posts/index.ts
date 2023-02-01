import { FastifyPluginAsyncJsonSchemaToTs } from "@fastify/type-provider-json-schema-to-ts";
import { idParamSchema } from "../../utils/reusedSchemas";
import { createPostBodySchema, changePostBodySchema } from "./schema";
import type { PostEntity } from "../../utils/DB/entities/DBPosts";
import { FastifyInstance } from "fastify";
import { UserEntity } from "../../utils/DB/entities/DBUsers";
import { getUser } from "../users";

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get("/", async function (request, reply): Promise<PostEntity[]> {
    return getPosts(fastify);
  });

  fastify.get(
    "/:id",
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<PostEntity> {
      const { id } = request.params;
      const post: PostEntity | null = await getPost(fastify, id);

      if (!post) throw fastify.httpErrors.notFound();

      return post;
    }
  );

  fastify.post(
    "/",
    {
      schema: {
        body: createPostBodySchema,
      },
    },
    async function (request, reply): Promise<PostEntity> {
      const { body } = request;
      const user: UserEntity | null = await getUser(fastify, body.userId);
      if (!user) throw fastify.httpErrors.badRequest();
      return createPost(fastify, body);
    }
  );

  fastify.delete(
    "/:id",
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<PostEntity> {
      const { id } = request.params;
      const post: PostEntity | null = await getPost(fastify, id);
      if (!post) throw fastify.httpErrors.badRequest();
      return await fastify.db.posts.delete(id);
    }
  );

  fastify.patch(
    "/:id",
    {
      schema: {
        body: changePostBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<PostEntity> {
      const { id } = request.params;
      const post: PostEntity | null = await getPost(fastify, id);
      if (!post) throw fastify.httpErrors.badRequest();
      return fastify.db.posts.change(id, request.body);
    }
  );
};

export default plugin;

export const getPosts = (fastify: FastifyInstance): Promise<PostEntity[]> => {
  return fastify.db.posts.findMany();
};

export const getPost = (
  fastify: FastifyInstance,
  id: string
): Promise<PostEntity | null> => {
  return fastify.db.posts.findOne({
    key: "id",
    equals: id,
  });
};

export const createPost = (
  fastify: FastifyInstance,
  body: any
): Promise<PostEntity> => {
  return fastify.db.posts.create(body);
};
