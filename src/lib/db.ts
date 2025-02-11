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
    },
    connectTimeout: 10000 // 10 seconds
  }
});

export async function query(q: string, values: any[] = []) {
  try {
    // Verify connection before query
    // console.log('Attempting database connection...');
    await db.connect();
    // console.log('Database connected successfully');

    // Execute query
    // console.log('Executing query:', q);
    // console.log('Query parameters:', values);
    const results = await db.query(q, values);
    // console.log('Query executed successfully');

    // Clean up
    await db.end();
    return results;
  } catch (error: unknown) {
    console.error('Database error details:', {
      error,
      connectionConfig: {
        host: process.env.MYSQL_HOST,
        port: process.env.MYSQL_PORT,
        database: process.env.MYSQL_DATABASE,
        user: process.env.MYSQL_USER,
        // Don't log the password!
      }
    });

    if (error instanceof Error) {
      throw new Error(`Database error: ${error.message}`);
    }
    throw new Error('Unknown database error');
  }
}

export default db;