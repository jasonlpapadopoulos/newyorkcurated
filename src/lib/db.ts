import mysql from 'serverless-mysql';

const db = mysql({
  config: {
    host: process.env.MYSQL_HOST,
    port: parseInt(process.env.MYSQL_PORT || '3306'),
    database: process.env.MYSQL_DATABASE,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD
  }
});

export async function query(q: string, values: any[] = []) {
  try {
    const results = await db.query(q, values);
    await db.end();
    return results;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    // If it's not an Error instance, convert it to a string
    throw new Error(String(error));
  }
}

export default db;