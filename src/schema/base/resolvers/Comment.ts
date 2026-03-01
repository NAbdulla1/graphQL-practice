import type { CommentResolvers } from './../../types.generated';

export const Comment: CommentResolvers = {
    createdAt: ({ createdAt }, _arg, _ctx) => {
        return createdAt.toISOString()
    },
    link: async (_parent, _arg, _ctx) => {
        const link = await _ctx.prisma.link.findUnique({
            where: {
                id: _parent.linkId
            }
        })

        return link!
    }
};