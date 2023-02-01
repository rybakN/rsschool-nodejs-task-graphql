import { FastifyPluginAsyncJsonSchemaToTs } from "@fastify/type-provider-json-schema-to-ts";
import { idParamSchema } from "../../utils/reusedSchemas";
import { changeMemberTypeBodySchema } from "./schema";
import type { MemberTypeEntity } from "../../utils/DB/entities/DBMemberTypes";
import { FastifyInstance } from "fastify";

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get("/", async function (request, reply): Promise<
    MemberTypeEntity[]
  > {
    return getMemberTypes(fastify);
  });

  fastify.get(
    "/:id",
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<MemberTypeEntity> {
      const { id } = request.params;
      const memberTypes: MemberTypeEntity | null = await getMemberType(
        fastify,
        id
      );

      if (!memberTypes) throw fastify.httpErrors.notFound();

      return memberTypes;
    }
  );

  fastify.patch(
    "/:id",
    {
      schema: {
        body: changeMemberTypeBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<MemberTypeEntity> {
      const { id } = request.params;
      const memberType: MemberTypeEntity | null = await getMemberType(
        fastify,
        id
      );
      if (!memberType) throw fastify.httpErrors.badRequest();
      return fastify.db.memberTypes.change(id, request.body);
    }
  );
};

export default plugin;

export const getMemberTypes = async (
  fastify: FastifyInstance
): Promise<MemberTypeEntity[]> => {
  return fastify.db.memberTypes.findMany();
};

export const getMemberType = async (
  fastify: FastifyInstance,
  id: string
): Promise<MemberTypeEntity | null> => {
  return fastify.db.memberTypes.findOne({ equals: id, key: "id" });
};
