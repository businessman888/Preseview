import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import * as schema from '@shared/schema';

if (!process.env.DATABASE_URL) {
  throw new Error(
    'DATABASE_URL must be set. Did you forget to provision a database?',
  );
}

const { Pool } = pg;

// Cria Pool de conexões com SSL ativado (recomendado para Supabase)
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // necessário para conexões locais
  },
});

// Cria conexão do Drizzle usando o pool
export const db = drizzle(pool, { schema });

// Caso você queira conexão única ao invés de pool:
// const client = new pg.Client({
//   connectionString: process.env.DATABASE_URL,
//   ssl: { rejectUnauthorized: false },
// });
// await client.connect();
// export const db = drizzle(client, { schema });

