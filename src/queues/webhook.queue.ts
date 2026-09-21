import { Queue } from "bullmq";
import redisConnection from "../config/redis";
import { webhookJobData } from "./webhook.types";

export const webhookQueue = new Queue<webhookJobData>("webhook-delivery", {
    connection: redisConnection,
    defaultJobOptions: {
        attempts: 5,
        backoff: {
            type: "exponential",
            delay: 1000
        },
        removeOnComplete: 1000,
        removeOnFail: false,
    },
}
);

