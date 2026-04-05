import type { UserResolvers } from "./../../types.generated";

export const User: UserResolvers = {
  links: async (parent, _args, context) => {
    const links = await context.prisma.user
      .findUnique({ where: { id: parent.id } })
      .links();
    return links ?? [];
  },
  comments: async (parent, _args, context) => {
    const comments = await context.prisma.user
      .findUnique({ where: { id: parent.id } })
      .comments();
    return comments ?? [];
  },
};
