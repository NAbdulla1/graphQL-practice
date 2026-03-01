
import { GraphQLError } from 'graphql';
import type { MutationResolvers } from './../../../types.generated';
import { Prisma } from '@prisma/client';
export const postCommentOnLink: NonNullable<MutationResolvers['postCommentOnLink']> = async (_parent, args, context) => {
    const newComment = await context.prisma.comment.create({
        data: {
            body: args.body,
            linkId: parseInt(args.linkId)
        }
    }).catch((err: unknown) => {
        if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2003') {
            return Promise.reject(
                new GraphQLError(`Cannot post comment on non-existing link with id '${args.linkId}'.`)
            )
        }
        return Promise.reject(err)
    })
    return newComment
};
