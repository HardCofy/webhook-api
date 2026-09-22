"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const webhook_queue_1 = require("./webhook.queue");
const testQueue = async () => {
    const job = await webhook_queue_1.webhookQueue.add("test-job", {
        eventId: "test-event-124"
    });
    console.log("Job added: ", job.id);
    await webhook_queue_1.webhookQueue.close();
};
testQueue().catch(console.error);
