import { Request, Response } from 'express';
import {
    createEndpoint,
    getEndpoints,
    getEndpointById,
    patchEndpoint,
    deleteEndpoint
} from '../services/endpoint.service';

import {
    createEndpointSchema,
    patchEndpointSchema
} from '../types/endpoint.schema';

export const createEndpointController = async (
    req: Request,
    res: Response
) => {
    const result = createEndpointSchema.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json({
            message: "Validation failed",
            errors: result.error.flatten()
        });
    }
    const { name, url, secret } = req.body;

    const Endpoint = await createEndpoint(name, url, secret);
    res.status(201).json(Endpoint);
};

export const getEndpointsController = async (
    _req: Request,
    res: Response
) => {
    const endpoints = await getEndpoints();
    res.status(200).json(endpoints);
};

export const getEndpointController = async (
    req: Request,
    res: Response,
) => {

    const { id } = req.params;

    if (typeof id !== 'string') {
        return res.status(400).json({
            message: "Invalid endpoint id"
        });
    }

    const endpoint = await getEndpointById(id);

    if (!endpoint) {
        return res.status(404).json({ message: "Endpoint not found" });
    }

    res.status(200).json(endpoint);
}

export const patchEndpointController = async (
    req: Request,
    res: Response
) => {
    const { id } = req.params;

    if (typeof id !== 'string') {
        return res.status(400).json({
            message: "Invalid endpoint id"
        });
    }

    const result = patchEndpointSchema.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json({
            message: "Validation failed",
            errors: result.error.flatten()
        });
    }

    const endpoint = await patchEndpoint(id, result.data);

    if (!endpoint) {
        return res.status(404).json({ message: "Endpoint not found" });
    }

    res.status(200).json(endpoint);
}

export const deleteEndpointController = async (
    req: Request,
    res: Response
) => {
    const { id } = req.params;

    if (typeof id !== 'string') {
        return res.status(400).json({
            message: "Invalid endpoint id"
        });
    }

    const deleted = await deleteEndpoint(id);

    if (!deleted) {
        return res.status(404).json({ message: "Endpoint not found" });
    }

    res.status(204).send();
}