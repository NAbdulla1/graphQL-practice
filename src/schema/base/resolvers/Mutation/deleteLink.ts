import { GraphQLError } from "graphql";
import type { MutationResolvers } from "./../../../types.generated";

export const deleteLink: NonNullable<MutationResolvers['deleteLink']> = async (
  _parent,
  arg,
  ctx
) => {
  if (!ctx.user) {
    throw new GraphQLError("Not authenticated");
  }

  const link = await ctx.prisma.link.findUnique({
    where: { id: parseInt(arg.id) },
  });

  if (!link) {
    throw new GraphQLError("Link not found");
  }

  if (link.postedById !== ctx.user.id) {
    throw new GraphQLError("You can only delete your own links");
  }

  const deletedLink = await ctx.prisma.link.delete({
    where: { id: parseInt(arg.id) },
  });

  ctx.pubSub.publish("deletedLink", deletedLink);
  return deletedLink;
};
