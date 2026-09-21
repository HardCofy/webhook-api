import { z } from "zod";

export const createEndpointSchema = z.object({
    name: z
        .string()
        .min(1, "Name is required")
        .max(100, "Name must be less than 100 characters"),

    url: z
        .string()
        .url("Invalid URL"),

    secret: z
        .string()
        .min(16, "Secret must be at least 16 characters")
});

export const patchEndpointSchema = createEndpointSchema
    .partial()
    .refine(
        (data) => Object.keys(data).length > 0,
        { message: "At least one field must be provided" }
    )


