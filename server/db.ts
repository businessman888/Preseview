import { neon, Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import ws from "ws";
import * as schema from "@shared/schema";
import https from "https";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Configure Neon to handle SSL certificates properly
neonConfig.webSocketConstructor = ws;
neonConfig.pipelineTLS = false;
neonConfig.pipelineConnect = false;

// Create custom fetch that accepts self-signed certificates
neonConfig.fetchFunction = async (input: RequestInfo | URL, init?: RequestInit) => {
  const agent = new https.Agent({
    rejectUnauthorized: false
  });
  
  return fetch(input, {
    ...init,
    // @ts-ignore - Node.js specific agent option
    agent
  });
};

// Use HTTP connection for main database queries
const sql = neon(process.env.DATABASE_URL);
export const db = drizzle(sql, { schema });

// Create Pool for session store with SSL disabled
export const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});
