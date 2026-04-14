import { createClient } from "redis";
import { config } from "./config";

export const redis = createClient({
  url: config.REDIS_URL,
});

redis.on("error", (err) => console.error("Redis Client Error", err));

const connectRedis = async () => {
  if (!redis.isOpen) {
    await redis.connect();
    console.log("Connected to Redis");
  }
};

connectRedis();
