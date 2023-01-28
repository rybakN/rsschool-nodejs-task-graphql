import { FastifyPluginAsyncJsonSchemaToTs } from "@fastify/type-provider-json-schema-to-ts";
import { idParamSchema } from "../../utils/reusedSchemas";
import { createProfileBodySchema, changeProfileBodySchema } from "./schema";
import type { ProfileEntity } from "../../utils/DB/entities/DBProfiles";
import { FastifyInstance } from "fastify";
import { getMemberType } from "../member-types";
import { MemberTypeEntity } from "../../utils/DB/entities/DBMemberTypes";

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get("/", async function (request, reply): Promise<ProfileEntity[]> {
    return getProfiles(fastify);
  });

  fastify.get(
    "/:id",
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity> {
      const { id } = request.params;
      const profile: ProfileEntity | null = await getProfile(fastify, id);

      if (!profile) throw fastify.httpErrors.notFound();

      return profile;
    }
  );

  fastify.post(
    "/",
    {
      schema: {
        body: createProfileBodySchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity> {
      const { body } = request;
      const memberType: MemberTypeEntity | null = await getMemberType(
        fastify,
        body.memberTypeId
      );
      if (!memberType) throw fastify.httpErrors.badRequest();

      const duplicate: boolean = await isDuplicate(fastify, body.userId);
      if (duplicate) throw fastify.httpErrors.badRequest();

      return fastify.db.profiles.create(body);
    }
  );

  fastify.delete(
    "/:id",
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity> {
      const { id } = request.params;
      const profile: ProfileEntity | null = await getProfile(fastify, id);

      if (!profile) throw fastify.httpErrors.badRequest();

      return fastify.db.profiles.delete(id);
    }
  );

  fastify.patch(
    "/:id",
    {
      schema: {
        body: changeProfileBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity> {
      const { id } = request.params;
      const profile: ProfileEntity | null = await getProfile(fastify, id);

      if (!profile) throw fastify.httpErrors.badRequest();
      return fastify.db.profiles.change(id, request.body);
    }
  );
};

export default plugin;

export const getProfiles = async (
  fastify: FastifyInstance
): Promise<ProfileEntity[]> => {
  return fastify.db.profiles.findMany();
};

export const getProfile = async (
  fastify: FastifyInstance,
  id: string
): Promise<ProfileEntity | null> => {
  return fastify.db.profiles.findOne({ equals: id, key: "id" });
};

const isDuplicate = async (
  fastify: FastifyInstance,
  id: string
): Promise<boolean> => {
  const allProfiles: ProfileEntity | null = await fastify.db.profiles.findOne({
    equals: id,
    key: "userId",
  });
  return !!allProfiles;
};
