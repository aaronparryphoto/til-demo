// Kysely database client instance
// This module exports the configured database client for use throughout the application

import { Kysely, PostgresDialect } from 'kysely';
import { createPool } from '@vercel/postgres';
import { Database } from '@/server/db/schema';

/**
 * PostgreSQL dialect configuration using Vercel Postgres pool
 * The pool is created with connection pooling via PgBouncer
 */
const dialect = new PostgresDialect({
  pool: createPool({
    connectionString: process.env.POSTGRES_URL,
  }),
});

/**
 * Kysely database instance
 * Use this instance for all database queries throughout the application
 *
 * Example usage:
 * ```typescript
 * import { db } from '@/server/connections/db';
 *
 * const users = await db.selectFrom('users').selectAll().execute();
 * ```
 */
export const db = new Kysely<Database>({
  dialect,
});
