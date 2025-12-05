// Database migration runner script
// Run with: pnpm db:migrate

import * as path from 'path';
import { promises as fs } from 'fs';
import { config } from 'dotenv';
import { Migrator, FileMigrationProvider } from 'kysely';

// Load environment variables from .env.local FIRST
config({ path: path.join(process.cwd(), '.env.local') });

async function migrateToLatest() {
  // Dynamically import db after env vars are loaded
  const { db } = await import('@/server/connections/db');

  const migrator = new Migrator({
    db,
    provider: new FileMigrationProvider({
      fs,
      path,
      migrationFolder: path.join(__dirname, '../server/db/migrations'),
    }),
  });

  const { error, results } = await migrator.migrateToLatest();

  results?.forEach((it) => {
    if (it.status === 'Success') {
      console.log(`✓ Migration "${it.migrationName}" was executed successfully`);
    } else if (it.status === 'Error') {
      console.error(`✗ Failed to execute migration "${it.migrationName}"`);
    }
  });

  if (error) {
    console.error('❌ Failed to migrate');
    console.error(error);
    process.exit(1);
  }

  console.log('✅ All migrations completed successfully');
  await db.destroy();
}

migrateToLatest();
