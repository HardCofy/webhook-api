import { Endpoint, updateEndpointInput } from "../types/endpoint.types";

import pool from "../config/database";

export const createEndpoint = async (
    name: string,
    url: string,
    secret: string
) => {
    const result = await pool.query(
        "INSERT INTO endpoints (name, url, secret) VALUES ($1, $2, $3) RETURNING *",
        [name, url, secret]
    )

    return result.rows[0];
};

export const getEndpoints = async () => {
    const result = await pool.query("SELECT * FROM endpoints");
    return result.rows;
};

export const getEndpointById = async (id: string) => {
    const result = await pool.query("SELECT * FROM endpoints WHERE id = $1", [id]);
    return result.rows[0];
}

export const patchEndpoint = async (id: string, data: updateEndpointInput) => {
    const fields: string[] = [];
    const values: unknown[] = [];

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

    const result = await pool.query(query, values);
    return result.rows[0];
}

export const deleteEndpoint = async (id: string): Promise<boolean> => {
    const result = await pool.query("DELETE FROM endpoints WHERE id = $1", [id]);
    return result.rowCount === 1;
}