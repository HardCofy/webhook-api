"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createWebhookEvent = void 0;
exports.getWebhookEventById = getWebhookEventById;
const database_1 = __importDefault(require("../config/database"));
const webhook_queue_1 = require("../queues/webhook.queue");
const createWebhookEvent = async (enpointId, payload) => {
    const endpointResult = await database_1.default.query("SELECT id from endpoints WHERE id = $1", [enpointId]);
    if (endpointResult.rowCount === 0) {
        return undefined;
    }
    const eventResult = await database_1.default.query(`INSERT INTO webhook_events (endpoint_id, payload) VALUES ($1, $2)
        RETURNING id, endpoint_id, status, created_at`, [enpointId, JSON.stringify(payload)]);
    const event = eventResult.rows[0];
    if (!event) {
        throw new Error("Failed to create webhook event");
    }
    await webhook_queue_1.webhookQueue.add("deliver-webhook", {
        eventId: event.id,
    }, {
        jobId: event.id,
    });
    return event;
};
exports.createWebhookEvent = createWebhookEvent;
async function getWebhookEventById(eventId) {
    const result = await database_1.default.query(`
        SELECT id,
        endpoint_id,
        payload, status,
        attempts,
        created_at,
        updated_at
        FROM webhook_events WHERE id = $1`, [eventId]);
    return result.rows[0] ?? null;
}
