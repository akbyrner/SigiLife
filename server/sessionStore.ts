import session from 'express-session';
import MySQLStore from 'express-mysql-session';

const MySQLStoreSession = MySQLStore(session);

export const sessionStore = new MySQLStoreSession({
  host: process.env.DB_HOST
})