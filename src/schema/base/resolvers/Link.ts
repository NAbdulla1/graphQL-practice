import type { LinkResolvers } from './../../types.generated';

export const Link: LinkResolvers = {
    comments: (parent, _args, context) => {
          return context.prisma.comment.findMany({
            orderBy: { createdAt: 'desc' },
            where: {
              linkId: parent.id
            }
          })
        },
    createdAt: ({ createdAt }, _arg, _ctx) => {
        return createdAt.toISOString()
    }
};
