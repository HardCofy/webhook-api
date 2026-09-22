"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.webhookSchema = void 0;
const zod_1 = require("zod");
exports.webhookSchema = zod_1.z
    .record(zod_1.z.string(), zod_1.z.unknown())
    .refine((payload) => Object.keys(payload).length > 0, { message: "Webhook payload cannot be empty" });
