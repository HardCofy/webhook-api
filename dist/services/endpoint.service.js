"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteEndpoint = exports.patchEndpoint = exports.getEndpointById = exports.getEndpoints = exports.createEndpoint = void 0;
const database_1 = __importDefault(require("../config/database"));
const createEndpoint = async (name, url, secret) => {
    const result = await database_1.default.query("INSERT INTO endpoints (name, url, secret) VALUES ($1, $2, $3) RETURNING *", [name, url, secret]);
    return result.rows[0];
};
exports.createEndpoint = createEndpoint;
const getEndpoints = async () => {
    const result = await database_1.default.query("SELECT * FROM endpoints");
    return result.rows;
};
exports.getEndpoints = getEndpoints;
const getEndpointById = async (id) => {
    const result = await database_1.default.query("SELECT * FROM endpoints WHERE id = $1", [id]);
    return result.rows[0];
};
exports.getEndpointById = getEndpointById;
const patchEndpoint = async (id, data) => {
    const fields = [];
    const values = [];
    if (data.name !== undefined) {
        fields.push(`name = $${fields.length + 1}`);
        values.push(data.name);
    }
    if (data.url !== undefined) {
        fields.push(`url = $${fields.length + 1}`);
        values.push(data.url);
    }
    if (data.secret !== undefined) {
        fields.push(`secret = $${fields.length + 1}`);
        values.push(data.secret);
    }
    if (fields.length === 0) {
        return undefined;
    }
    values.push(id);
    const query = `

        UPDATE endpoints

        SET ${fields.join(", ")},

            updated_at = NOW()

        WHERE id = $${values.length}

        RETURNING *

    `;
    const result = await database_1.default.query(query, values);
    return result.rows[0];
};
exports.patchEndpoint = patchEndpoint;
const deleteEndpoint = async (id) => {
    const result = await database_1.default.query("DELETE FROM endpoints WHERE id = $1", [id]);
    return result.rowCount === 1;
};
exports.deleteEndpoint = deleteEndpoint;
