import { FastifyPluginAsyncJsonSchemaToTs } from "@fastify/type-provider-json-schema-to-ts";
import { graphqlBodySchema } from "./schema";
import { graphql } from "graphql/graphql";
import { GraphQLSchema } from "graphql/type";
import { resolvers } from "./resolvers";
import { Query } from "./query/query";
import { Mutations } from "./mutations/mutations";

const schemaGQL = new GraphQLSchema({
  query: Query,
  mutation: Mutations,
});

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.post(
    "/",
    {
      schema: {
        body: graphqlBodySchema,
      },
    },
    async function (request, reply) {
      const source: string = String(request.body.query);
      const variableValues = request.body.variables;

      return await graphql({
        schema: schemaGQL,
        source,
        rootValue: resolvers,
        variableValues,
        contextValue: fastify,
      });
    }
  );
};

export default plugin;
