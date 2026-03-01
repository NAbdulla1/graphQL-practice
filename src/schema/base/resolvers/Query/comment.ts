
import type { QueryResolvers } from './../../../types.generated';
export const comment: NonNullable<QueryResolvers['comment']> = async (_parent, _arg, _ctx) => {
    return _ctx.prisma.comment.findUnique({
        where: {
            id: parseInt(_arg.id)
        }
    });
};