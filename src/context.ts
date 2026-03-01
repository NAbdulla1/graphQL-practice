import { PrismaClient, Link } from "@prisma/client";
import { createPubSub, PubSub } from "graphql-yoga";

export type PubSubChannels = {
    newLink: [Link];
    deletedLink: [Link];
};

export type GraphQLContext = {
    prisma: PrismaClient;
    pubSub: PubSub<PubSubChannels>;
};

const prisma = new PrismaClient();
const pubSub = createPubSub<PubSubChannels>();

export async function createContext(): Promise<GraphQLContext> {
    return { prisma, pubSub };
}
