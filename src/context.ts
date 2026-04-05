import { PrismaClient, Link, User } from "@prisma/client";
import { createPubSub, PubSub, YogaInitialContext } from "graphql-yoga";

export type PubSubChannels = {
  newLink: [Link];
  deletedLink: [Link];
};

export type GraphQLContext = YogaInitialContext & {
  prisma: PrismaClient;
  pubSub: PubSub<PubSubChannels>;
  user: User | null;
};

const prisma = new PrismaClient();
const pubSub = createPubSub<PubSubChannels>();

export async function createContext(initialContext: YogaInitialContext & { req: any }): Promise<GraphQLContext> {
  return {
    ...initialContext,
    prisma,
    pubSub,
    user: initialContext.req?.user || null,
  };
}
