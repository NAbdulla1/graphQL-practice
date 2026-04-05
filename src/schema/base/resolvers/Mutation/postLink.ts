import { GraphQLError } from "graphql";
import type { MutationResolvers } from "./../../../types.generated";

export const postLink: NonNullable<MutationResolvers['postLink']> = async (_parent, args, context) => {
  if (!context.user) {
    throw new GraphQLError("Not authenticated");
  }

  const newLink = await context.prisma.link.create({
    data: {
      url: args.url,
      description: args.description,
      postedById: context.user.id,
    },
  });

  context.pubSub.publish("newLink", newLink);
  return newLink;
};
