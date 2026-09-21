import { webhookQueue } from "./webhook.queue";

const testQueue = async () => {
    const job = await webhookQueue.add("test-job", {
        eventId: "test-event-124"
    });

    console.log("Job added: ", job.id);

    await webhookQueue.close();
};

testQueue().catch(console.error);