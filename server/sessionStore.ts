import dotenv from 'dotenv';
dotenv.config();

import session from 'express-session';
import MySQLStore from 'express-mysql-session';

const MySQLStoreSession = (MySQLStore as any)(session);

const dbUrlStr = process.env.NODE_ENV === 'production'
  ? process.env.PROD_DATABASE_URL
  : process.env.DEV_DATABASE_URL || process.env.DATABASE_URL;

if (!dbUrlStr) {
  throw new Error('No db url in env for session store!');
}
const url = new URL(dbUrlStr);

export const sessionStore = new MySQLStoreSession({
  host: url.hostname,
  user: url.username,
  password: decodeURIComponent(url.password || ''),
  database: url.pathname.slice(1),
  port: url.port ? parseInt(url.port) : 3306,
  ssl: {
    rejectUnauthorized: false
  },
  // Retry connection on transient failures instead of crashing
  reconnectDelay: 5000,
  retries: 5,
  // Prevent idle connections from being dropped by Aiven's firewall
  connectionLimit: 3,
});

// Prevent uncaught session store errors from crashing the process
sessionStore.on('error', (err: Error) => {
  console.error('[SessionStore] Connection error (non-fatal):', err.message);
});
