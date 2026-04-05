import { GraphQLError } from "graphql";
import type { MutationResolvers } from "./../../../types.generated";
import { Prisma } from "@prisma/client";

export const postCommentOnLink: NonNullable<MutationResolvers['postCommentOnLink']> = async (_parent, args, context) => {
  if (!context.user) {
    throw new GraphQLError("Not authenticated");
  }

  const newComment = await context.prisma.comment.create({
    data: {
      body: args.body,
      linkId: parseInt(args.linkId),
      authorId: context.user.id,
    },
  }).catch((err: unknown) => {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2003") {
      throw new GraphQLError(
        `Cannot post comment on non-existing link with id '${args.linkId}'.`
      );
    }
    throw err;
  });

  return newComment;
};
