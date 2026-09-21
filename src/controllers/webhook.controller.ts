import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { webhookSchema } from '../types/webhook.schema';
import { createWebhookEvent } from '../services/webhook.service';

const EndpointIdSchema = z.string().uuid();

export const receiveWebhook = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const idResult = EndpointIdSchema.safeParse(
            req.params.endpointId
        );

        if (!idResult.success) {
            return res.status(400).json({
                message: "Invalid endpoint id",
            })
        }

        const payloadResult = webhookSchema.safeParse(req.body);

        if (!payloadResult.success) {
            return res.status(400).json({
                message: "Invalid payload",
                errors: payloadResult.error.flatten()
            })
        }

        const event = await createWebhookEvent(
            idResult.data,
            payloadResult.data
        );

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
    } catch (error) {
        next(error);
    }
}
