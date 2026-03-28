import session from 'express-session';
import MySQLStore from 'express-mysql-session';

const MySQLStoreSession = MySQLStore(session);

export const sessionStore = new MySQLStoreSession({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
})