"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("./database"));
const testDatabaseConnection = async () => {
    try {
        const result = await database_1.default.query('SELECT NOW()');
        console.log('Database connected', result.rows[0]);
    }
    catch (error) {
        console.error('Error connecting to database', error);
    }
    finally {
        await database_1.default.end();
    }
};
testDatabaseConnection();
