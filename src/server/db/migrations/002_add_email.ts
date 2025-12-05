// Add email field to users table for future email confirmation

import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  // Add email column to users table
  await db.schema
    .alterTable('users')
    .addColumn('email', 'varchar(255)')
    .execute();

  // Create index on email for lookups
  await db.schema
    .createIndex('idx_users_email')
    .on('users')
    .column('email')
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  // Drop index
  await db.schema
    .dropIndex('idx_users_email')
    .ifExists()
    .execute();

  // Drop email column
  await db.schema
    .alterTable('users')
    .dropColumn('email')
    .execute();
}
