import pool from './database';

const testDatabaseConnection = async () => {
    try {
        const result = await pool.query(
            'SELECT NOW()'
        );
        console.log('Database connected', result.rows[0]);
    } catch (error) {
        console.error('Error connecting to database', error);
    } finally {
        await pool.end();
    }
}

testDatabaseConnection();