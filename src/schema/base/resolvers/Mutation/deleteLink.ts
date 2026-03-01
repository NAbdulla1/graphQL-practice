import type { MutationResolvers } from './../../../types.generated';
export const deleteLink: NonNullable<MutationResolvers['deleteLink']> = async (_parent, arg, ctx) => {
    const deletedLink = await ctx.prisma.link.delete({
        where: { id: parseInt(arg.id) }
    });
    ctx.pubSub.publish("deletedLink", deletedLink);
    return deletedLink;
};
