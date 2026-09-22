"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.patchEndpointSchema = exports.createEndpointSchema = void 0;
const zod_1 = require("zod");
exports.createEndpointSchema = zod_1.z.object({
    name: zod_1.z
        .string()
        .min(1, "Name is required")
        .max(100, "Name must be less than 100 characters"),
    url: zod_1.z
        .string()
        .url("Invalid URL"),
    secret: zod_1.z
        .string()
        .min(16, "Secret must be at least 16 characters")
});
exports.patchEndpointSchema = exports.createEndpointSchema
    .partial()
    .refine((data) => Object.keys(data).length > 0, { message: "At least one field must be provided" });
