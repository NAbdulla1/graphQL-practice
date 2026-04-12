import { PrismaClient, Link, User } from "@prisma/client";
import { createPubSub, PubSub, YogaInitialContext } from "graphql-yoga";
import { Request } from "express";
import "express-session";

declare module 'express-session' {
  interface SessionData {
    mfaVerified?: boolean;
  }
}

export type PubSubChannels = {
  newLink: [Link];
  deletedLink: [Link];
};

export interface GraphQLRequest extends Request {
  user?: User;
}

export type GraphQLContext = YogaInitialContext & {
  prisma: PrismaClient;
  pubSub: PubSub<PubSubChannels>;
  user: User | null;
  req: GraphQLRequest;
};

const prisma = new PrismaClient();
const pubSub = createPubSub<PubSubChannels>();

export async function createContext(initialContext: YogaInitialContext & { req: GraphQLRequest }): Promise<GraphQLContext> {
  return {
    ...initialContext,
    prisma,
    pubSub,
    user: initialContext.req?.user || null,
    req: initialContext.req,
  };
}
