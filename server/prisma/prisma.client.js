import 'dotenv/config';
import { PrismaClient } from '../prisma/generated/client.js';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
const dbUrl = process.env.NODE_ENV === 'production'
    ? process.env.PROD_DATABASE_URL
    : process.env.DEV_DATABASE_URL || process.env.DATABASE_URL;
if (!dbUrl) {
    throw new Error('No db url found for environment: ' + process.env.NODE_ENV);
}
const url = new URL(dbUrl);
console.log('DB connection:', url.hostname, url.username, JSON.stringify(url.password));
const adapter = new PrismaMariaDb({
    host: url.hostname,
    user: url.username,
    password: decodeURIComponent(url.password),
    database: url.pathname.slice(1),
    port: url.port ? parseInt(url.port) : 3306,
    connectionLimit: 5,
    allowPublicKeyRetrieval: true,
});
const prisma = new PrismaClient({ adapter });
export default prisma;
