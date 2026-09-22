import { Router } from "express";
import { receiveWebhook, getWebhookEvent } from "../controllers/webhook.controller";

const router = Router();

router.post("/:endpointId", receiveWebhook);
router.get("/:eventId", getWebhookEvent)

export default router;