import mysql from 'serverless-mysql';

const db = mysql({
    config: {
        host: process.env.MYSQL_HOST,
        port: parseInt(process.env.MYSQL_PORT || '3306'),
        database: process.env.MYSQL_DATABASE,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        ssl: { rejectUnauthorized: false },
        connectTimeout: 10000
    }
});

export async function query(q: string, values: any[] = []) {
  try {
      const results = await db.query(q, values);
      await db.end(); // ✅ Ensures the connection is closed
      return results;
  } catch (error: unknown) {
      console.error('Database error:', error);

      // ✅ Fix: Check if error is an instance of Error before accessing message
      if (error instanceof Error) {
          throw new Error(`Database error: ${error.message}`);
      } else {
          throw new Error('Database error: An unknown error occurred');
      }
  }
}


export default db;
