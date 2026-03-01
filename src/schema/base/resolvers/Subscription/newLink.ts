import type { SubscriptionResolvers } from './../../../types.generated';
export const newLink: NonNullable<SubscriptionResolvers['newLink']> = {
  subscribe: (_parent, _arg, ctx) => ctx.pubSub.subscribe("newLink"),
  resolve: (payload: any) => payload,
};
