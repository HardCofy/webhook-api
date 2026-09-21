import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not defined in the environment variables");
}

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

pool.on('error', (error) => {
    console.error('Unexpected database error', error);
});

export default pool;


