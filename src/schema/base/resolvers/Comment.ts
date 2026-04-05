import type { CommentResolvers } from "./../../types.generated";

export const Comment: CommentResolvers = {
  createdAt: ({ createdAt }, _arg, _ctx) => {
    return createdAt.toISOString();
  },
  link: async (parent, _arg, context) => {
    const link = await context.prisma.link.findUnique({
      where: {
        id: parent.linkId,
      },
    });

    return link!;
  },
  author: async (parent, _arg, context) => {
    if (!parent.authorId) return null;
    return context.prisma.user.findUnique({
      where: { id: parent.authorId },
    });
  },
};