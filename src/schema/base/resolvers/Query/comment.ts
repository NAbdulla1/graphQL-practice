import { GraphQLError } from "graphql";
import type { QueryResolvers } from "./../../../types.generated";

export const comment: NonNullable<QueryResolvers['comment']> = async (_parent, arg, ctx) => {
  if (!ctx.user) {
    throw new GraphQLError("Not authenticated");
  }

  return ctx.prisma.comment.findUnique({
    where: {
      id: parseInt(arg.id),
    },
  });
};