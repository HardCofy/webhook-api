"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.receiveWebhook = void 0;
exports.getWebhookEvent = getWebhookEvent;
const zod_1 = require("zod");
const webhook_schema_1 = require("../types/webhook.schema");
const webhook_service_1 = require("../services/webhook.service");
const EndpointIdSchema = zod_1.z.string().uuid();
const receiveWebhook = async (req, res, next) => {
    try {
        const idResult = EndpointIdSchema.safeParse(req.params.endpointId);
        if (!idResult.success) {
            return res.status(400).json({
                message: "Invalid endpoint id",
            });
        }
        const payloadResult = webhook_schema_1.webhookSchema.safeParse(req.body);
        if (!payloadResult.success) {
            return res.status(400).json({
                message: "Invalid payload",
                errors: payloadResult.error.flatten()
            });
        }
        const event = await (0, webhook_service_1.createWebhookEvent)(idResult.data, payloadResult.data);
        if (!event) {
            return res.status(404).json({
                message: "Endpoint not found",
            });
        }
        return res.status(202).json({
            message: "Webhok event received",
            eventId: event.id,
            status: event.status
        });
    }
    catch (error) {
        next(error);
    }
};
exports.receiveWebhook = receiveWebhook;
async function getWebhookEvent(req, res) {
    const { eventId } = req.params;
    if (!eventId) {
        return res.status(400).json({
            message: "Event ID is required"
        });
    }
    try {
        const event = await (0, webhook_service_1.getWebhookEventById)(eventId);
        if (!event) {
            res.status(404).json({
                message: "Webhook not found"
            });
        }
        return res.status(200).json(event);
    }
    catch (error) {
        console.error("Failed to retrieve webhook event: ", error);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
}
