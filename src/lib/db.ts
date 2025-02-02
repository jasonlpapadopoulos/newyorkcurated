import mysql from 'serverless-mysql';

const db = mysql({
  config: {
    host: process.env.MYSQL_HOST,
    port: parseInt(process.env.MYSQL_PORT || '3306'),
    database: process.env.MYSQL_DATABASE,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    ssl: {
      rejectUnauthorized: false
    }
  }
});

export async function query(q: string, values: any[] = []) {
  try {
    const results = await db.query(q, values);
    await db.end();
    return results;
  } catch (error) {
    // Log the error details (but not sensitive info)
    console.error('Database error:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      query: q,
      // Don't log values as they might contain sensitive data
    });
    throw error;
  }
}

export default db;