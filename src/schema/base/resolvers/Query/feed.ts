import { GraphQLError } from "graphql";
import type { QueryResolvers } from "./../../../types.generated";

export const feed: NonNullable<QueryResolvers['feed']> = async (_parent, args, context) => {
  if (!context.user) {
    throw new GraphQLError("Not authenticated");
  }

  const where = args.filterNeedle
    ? {
      OR: [
        { description: { contains: args.filterNeedle } },
        { url: { contains: args.filterNeedle } },
      ],
    }
    : {};

  return context.prisma.link.findMany({ where });
};
