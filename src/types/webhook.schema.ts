import { z } from "zod";

export const webhookSchema = z
    .record(z.string(), z.unknown())
    .refine(
        (payload) => Object.keys(payload).length > 0,
        { message: "Webhook payload cannot be empty" }
    );

export type WebhookPayload = z.infer<typeof webhookSchema>;