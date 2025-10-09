import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

// Only disable TLS checks in development to handle self-signed certificates
const isDevelopment = process.env.NODE_ENV !== 'production';
if (isDevelopment) {
  neonConfig.pipelineTLS = false;
  neonConfig.pipelineConnect = false;
}

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

export const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  ssl: isDevelopment ? {
    rejectUnauthorized: false
  } : true
});
export const db = drizzle({ client: pool, schema });
