// lib/db/index.ts
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// Conexión para queries
const queryClient = postgres(process.env.DATABASE_URL!);
export const db = drizzle(queryClient, { schema });

// Conexión para migraciones
export const migrationClient = postgres(process.env.DATABASE_URL!, { max: 1 });