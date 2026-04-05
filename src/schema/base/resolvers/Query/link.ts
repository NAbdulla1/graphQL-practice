import { GraphQLError } from "graphql";
import type { QueryResolvers } from "./../../../types.generated";

export const link: NonNullable<QueryResolvers['link']> = async (_parent, _arg, _ctx) => {
  if (!_ctx.user) {
    throw new GraphQLError("Not authenticated");
  }

  return _ctx.prisma.link.findUnique({
    where: {
      id: parseInt(_arg.id)
    }
  });
};