import type { QueryResolvers } from './../../../types.generated';

export const me: NonNullable<QueryResolvers['me']> = async (_parent, _arg, _ctx) => {
  // Return the user from context (populated by Passport via Express session)
  // If no session exists, this will be null, which is standard for a 'me' query.
  return _ctx.user;
};