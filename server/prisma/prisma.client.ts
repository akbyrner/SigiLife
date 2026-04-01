import 'dotenv/config';
import { PrismaClient } from '../prisma/generated/client.js';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';


if (!process.env.DATABASE_URL){
  throw new Error ('No db url in env!')
}
const url = new URL(process.env.DATABASE_URL)

const adapter = new PrismaMariaDb({
  host: url.hostname,
  user: url.username,
  password: url.password || undefined,
  database: url.pathname.slice(1),
  port: url.port ? parseInt(url.port) : 3306,
  connectionLimit: 5,
});
const prisma = new PrismaClient({ adapter });

export default  prisma ;
