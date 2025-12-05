// Database seed runner script
// Run with: pnpm db:seed

import { db } from '@/server/connections/db';
import { seedQuestions } from '@/server/db/seed/seed-questions';
import 'dotenv/config';

async function runSeed() {
  try {
    console.log('Starting database seeding...');

    await seedQuestions();

    console.log('✅ Database seeding completed successfully');
  } catch (error) {
    console.error('❌ Error seeding database:');
    console.error(error);
    process.exit(1);
  } finally {
    await db.destroy();
  }
}

runSeed();
