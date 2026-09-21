import { Worker, Job, PostgresConnection } from "bullmq";
import pool from "../config/database"
import redisConnection from "../config/redis";
import { webhookJobData } from "../queues/webhook.types";

const worker = new Worker<webhookJobData>(
    "webhook-delivery",
    async (job: Job<webhookJobData>) => {
        const { eventId } = job.data

        const result = await pool.query(
            `SELECT we.id, we.payload, we.status, we.endpoint_id, e.url, e.secret 
            FROM webhook_events we  
            JOIN endpoints e ON e.id = we.endpoint_id WHERE we.id = $1`,
            [eventId]
        );

        const event = result.rows[0];

        if (!event) {
            throw new Error(`Webhook event ${eventId} not found`);
        }

        await pool.query(
            `UPDATE webhook_events
            SET status = 'processing',
            attempts = attempts + 1,
            updated_at = NOW()
            WHERE id = $1`,
            [eventId]
        );

        try {
            const response = await fetch(event.url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-Webhook-Event-Id": event.id,
                },
                body: JSON.stringify(event.payload),
                signal: AbortSignal.timeout(10_000),
            });

            if (!response.ok) {
                throw new Error(
                    `Destination returned HTTP ${response.status}`
                );
            }


            await pool.query(
                `UPDATE webhook_events
                SET status = 'delivered',
                updated_at = NOW()
                WHERE id = $1`,
                [eventId]
            );


            console.log(`Webhook ${eventId} delivered successfully`);
        } catch (error) {
            const maxAttempts = Number(job.opts.attempts ?? 1);
            const isFinalAttempt = job.attemptsMade + 1 >= maxAttempts;

            if (isFinalAttempt) {
                await pool.query(
                    `UPDATE webhook_events
                     SET status = 'failed',
                updated_at = NOW()
                     WHERE id = $1`,
                    [eventId]
                )
            } else {
                await pool.query(
                    `UPDATE webhook_events
                     SET status = 'pending',
                updated_at = NOW()
                     WHERE id = $1`,
                    [eventId]
                );
            }

            throw error;
        }
    },
    {
        connection: redisConnection,
        concurrency: 5,
    }
);

worker.on("completed", (job) => {
    console.log(`Job ${job.id} completed`)
});

worker.on("failed", (job, error) => {
    console.error(`Job ${job?.id} failed: `, error.message);
});

worker.on("error", (error) => {
    console.error("Worker error:", error);
});

console.log("Webhook worker started");

export default worker;