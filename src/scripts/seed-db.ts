// Database seed runner script
// Run with: pnpm db:seed

import * as path from 'path';
import { config } from 'dotenv';

// Load environment variables from .env.local FIRST
config({ path: path.join(process.cwd(), '.env.local') });

async function runSeed() {
  try {
    console.log('Starting database seeding...');

    // Dynamically import after env vars are loaded
    const { db } = await import('@/server/connections/db');
    const { seedQuestions } = await import('@/server/db/seed/seed-questions');

    await seedQuestions();

    console.log('✅ Database seeding completed successfully');
    await db.destroy();
  } catch (error) {
    console.error('❌ Error seeding database:');
    console.error(error);
    process.exit(1);
  }
}

runSeed();
