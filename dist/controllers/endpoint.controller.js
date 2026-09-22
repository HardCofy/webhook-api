"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteEndpointController = exports.patchEndpointController = exports.getEndpointController = exports.getEndpointsController = exports.createEndpointController = void 0;
const endpoint_service_1 = require("../services/endpoint.service");
const endpoint_schema_1 = require("../types/endpoint.schema");
const createEndpointController = async (req, res) => {
    const result = endpoint_schema_1.createEndpointSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({
            message: "Validation failed",
            errors: result.error.flatten()
        });
    }
    const { name, url, secret } = req.body;
    const Endpoint = await (0, endpoint_service_1.createEndpoint)(name, url, secret);
    res.status(201).json(Endpoint);
};
exports.createEndpointController = createEndpointController;
const getEndpointsController = async (_req, res) => {
    const endpoints = await (0, endpoint_service_1.getEndpoints)();
    res.status(200).json(endpoints);
};
exports.getEndpointsController = getEndpointsController;
const getEndpointController = async (req, res) => {
    const { id } = req.params;
    if (typeof id !== 'string') {
        return res.status(400).json({
            message: "Invalid endpoint id"
        });
    }
    const endpoint = await (0, endpoint_service_1.getEndpointById)(id);
    if (!endpoint) {
        return res.status(404).json({ message: "Endpoint not found" });
    }
    res.status(200).json(endpoint);
};
exports.getEndpointController = getEndpointController;
const patchEndpointController = async (req, res) => {
    const { id } = req.params;
    if (typeof id !== 'string') {
        return res.status(400).json({
            message: "Invalid endpoint id"
        });
    }
    const result = endpoint_schema_1.patchEndpointSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({
            message: "Validation failed",
            errors: result.error.flatten()
        });
    }
    const endpoint = await (0, endpoint_service_1.patchEndpoint)(id, result.data);
    if (!endpoint) {
        return res.status(404).json({ message: "Endpoint not found" });
    }
    res.status(200).json(endpoint);
};
exports.patchEndpointController = patchEndpointController;
const deleteEndpointController = async (req, res) => {
    const { id } = req.params;
    if (typeof id !== 'string') {
        return res.status(400).json({
            message: "Invalid endpoint id"
        });
    }
    const deleted = await (0, endpoint_service_1.deleteEndpoint)(id);
    if (!deleted) {
        return res.status(404).json({ message: "Endpoint not found" });
    }
    res.status(204).send();
};
exports.deleteEndpointController = deleteEndpointController;
