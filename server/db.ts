import { neon, Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import ws from "ws";
import * as schema from "@shared/schema";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Use HTTP connection for main database queries (avoids WebSocket SSL issues)
const sql = neon(process.env.DATABASE_URL);
export const db = drizzle(sql, { schema });

// Create Pool for session store with SSL disabled
neonConfig.webSocketConstructor = ws;
neonConfig.pipelineTLS = false;
neonConfig.pipelineConnect = false;

export const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});
