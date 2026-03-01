import type { SubscriptionResolvers } from './../../../types.generated';
export const deletedLink: NonNullable<SubscriptionResolvers['deletedLink']> = {
  subscribe: (_parent, _arg, ctx) => ctx.pubSub.subscribe("deletedLink"),
  resolve: (payload: any) => payload,
};
