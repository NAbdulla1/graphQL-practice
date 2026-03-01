
import type { QueryResolvers } from './../../../types.generated';
export const link: NonNullable<QueryResolvers['link']> = async (_parent, _arg, _ctx) => {
    return _ctx.prisma.link.findUnique({
        where: {
            id: parseInt(_arg.id)
        }
    });
};