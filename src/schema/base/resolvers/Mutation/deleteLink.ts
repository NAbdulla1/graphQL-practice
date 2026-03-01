import type { MutationResolvers } from './../../../types.generated';
export const deleteLink: NonNullable<MutationResolvers['deleteLink']> = async (_parent, arg, ctx) => {
    return ctx.prisma.link.delete({
        where: { id: parseInt(arg.id) }
    });
};
