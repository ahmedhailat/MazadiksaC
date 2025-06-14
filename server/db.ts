import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  console.error("❌ DATABASE_URL environment variable is not set!");
  console.error("Please set up your database connection:");
  console.error("1. Create a Neon database at https://neon.tech");
  console.error("2. Copy the connection string to your .env file");
  console.error("3. Run 'npm run db:push' to create tables");
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Configure pool with better error handling
export const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  max: 5,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 15000,
});

export const db = drizzle({ client: pool, schema });

// Test database connection
pool.on('error', (err) => {
  console.error('❌ Database pool error:', err);
});

// Test connection on startup
pool.connect()
  .then(client => {
    console.log('✅ Database connected successfully');
    client.release();
  })
  .catch(err => {
    console.error('❌ Failed to connect to database:', err.message);
    console.error('Please check your DATABASE_URL in .env file');
  });

// Graceful shutdown
process.on('SIGINT', async () => {
  await pool.end();
  process.exit(0);
});