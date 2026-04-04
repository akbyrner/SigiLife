import dotenv from 'dotenv';
dotenv.config();
import session from 'express-session';
import MySQLStore from 'express-mysql-session';
const MySQLStoreSession = MySQLStore(session);
const dbUrlStr = process.env.DATABASE_URL || process.env.DEV_DATABASE_URL || process.env.PROD_DATABASE_URL;
if (!dbUrlStr) {
    throw new Error('No db url in env for session store!');
}
const url = new URL(dbUrlStr);
export const sessionStore = new MySQLStoreSession({
    host: url.hostname,
    user: url.username,
    password: url.password || undefined,
    database: url.pathname.slice(1),
    port: url.port ? parseInt(url.port) : 3306,
});
