import pool from '../config/database';

import { WebhookPayload } from '../types/webhook.schema';
import { webhookQueue } from '../queues/webhook.queue';

export const createWebhookEvent = async (
    enpointId: string,
    payload: WebhookPayload
) => {
    const endpointResult = await pool.query(
        "SELECT id from endpoints WHERE id = $1",
        [enpointId]
    );

    if (endpointResult.rowCount === 0) {
        return undefined;
    }

    const eventResult = await pool.query(
        `INSERT INTO webhook_events (endpoint_id, payload) VALUES ($1, $2)
        RETURNING id, endpoint_id, status, created_at`,
        [enpointId, JSON.stringify(payload)]
    );

    const event = eventResult.rows[0];

    if (!event) {
        throw new Error("Failed to create webhook event");
    }

    await webhookQueue.add(
        "deliver-webhook", {
        eventId: event.id,
    },
        {
            jobId: event.id,
        }
    );

    return event
}

export async function getWebhookEventById(eventId: string) {
    const result = await pool.query(`
        SELECT id,
        endpoint_id,
        payload, status,
        attempts,
        created_at,
        updated_at
        FROM webhook_events WHERE id = $1`,
        [eventId]
    );

    return result.rows[0] ?? null;
}

export async function retryWebhookEvent(eventId: string) {
    const result = await pool.query(`
        SELECT id, status FROM webhook_events WHERE id = $1`, [eventId]);

    const event = result.rows[0];

    if (!event) {
        return {
            error: "not found"
        }
    }

    if (event.status === "processing") {
        return {
            error: "already processing"
        }
    }

    if (event.status === "delivered") {
        return {
            error: "already delivered"
        }
    }

    await webhookQueue.add(
        "deliver-webhook", { eventId: event.id }, { jobId: `${event.id}-manual-retry-${Date.now()}` }
    );

    await pool.query(
        `UPDATE webhook_events
     SET status = 'pending',
         updated_at = NOW()
     WHERE id = $1`,
        [eventId]
    );

    return {
        error: null,
        eventId: event.id,
        status: "pending",
    };

}