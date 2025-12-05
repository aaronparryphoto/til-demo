// Initial schema migration - creates all tables and indexes

import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  // Create users table
  await db.schema
    .createTable('users')
    .addColumn('id', 'uuid', (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`)
    )
    .addColumn('name', 'varchar(255)', (col) => col.notNull())
    .addColumn('phone_number', 'varchar(20)')
    .addColumn('created_at', 'timestamp', (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .addColumn('updated_at', 'timestamp', (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .execute();

  // Create index on phone_number for lookups
  await db.schema
    .createIndex('idx_users_phone')
    .on('users')
    .column('phone_number')
    .execute();

  // Create questions table
  await db.schema
    .createTable('questions')
    .addColumn('id', 'varchar(50)', (col) => col.primaryKey())
    .addColumn('category', 'varchar(50)', (col) => col.notNull())
    .addColumn('question_text', 'text', (col) => col.notNull())
    .addColumn('options', 'jsonb', (col) => col.notNull())
    .addColumn('correct_answer_index', 'integer', (col) => col.notNull())
    .addColumn('explanation', 'text')
    .addColumn('difficulty', 'varchar(10)')
    .addColumn('date_added', 'timestamp', (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .addColumn('is_active', 'boolean', (col) =>
      col.defaultTo(true).notNull()
    )
    .addColumn('created_at', 'timestamp', (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .addColumn('updated_at', 'timestamp', (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .execute();

  // Create indexes on questions table
  await db.schema
    .createIndex('idx_questions_category')
    .on('questions')
    .column('category')
    .execute();

  await db.schema
    .createIndex('idx_questions_active')
    .on('questions')
    .column('is_active')
    .execute();

  // Create quiz_attempts table
  await db.schema
    .createTable('quiz_attempts')
    .addColumn('id', 'uuid', (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`)
    )
    .addColumn('user_id', 'uuid', (col) =>
      col.references('users.id').onDelete('cascade').notNull()
    )
    .addColumn('quiz_date', 'date', (col) => col.notNull())
    .addColumn('score', 'integer', (col) => col.notNull())
    .addColumn('completed_at', 'timestamp', (col) => col.notNull())
    .addColumn('created_at', 'timestamp', (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .addColumn('updated_at', 'timestamp', (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .execute();

  // Add unique constraint on user_id + quiz_date
  await db.schema
    .createIndex('idx_quiz_attempts_user_date')
    .on('quiz_attempts')
    .columns(['user_id', 'quiz_date'])
    .unique()
    .execute();

  // Create additional indexes on quiz_attempts
  await db.schema
    .createIndex('idx_quiz_attempts_user')
    .on('quiz_attempts')
    .column('user_id')
    .execute();

  await db.schema
    .createIndex('idx_quiz_attempts_date')
    .on('quiz_attempts')
    .column('quiz_date')
    .execute();

  // Create user_answers table
  await db.schema
    .createTable('user_answers')
    .addColumn('id', 'uuid', (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`)
    )
    .addColumn('quiz_attempt_id', 'uuid', (col) =>
      col.references('quiz_attempts.id').onDelete('cascade').notNull()
    )
    .addColumn('question_id', 'varchar(50)', (col) =>
      col.references('questions.id').onDelete('cascade').notNull()
    )
    .addColumn('selected_answer_index', 'integer', (col) => col.notNull())
    .addColumn('is_correct', 'boolean', (col) => col.notNull())
    .addColumn('time_spent_ms', 'integer')
    .addColumn('created_at', 'timestamp', (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .execute();

  // Create indexes on user_answers table
  await db.schema
    .createIndex('idx_user_answers_attempt')
    .on('user_answers')
    .column('quiz_attempt_id')
    .execute();

  await db.schema
    .createIndex('idx_user_answers_question')
    .on('user_answers')
    .column('question_id')
    .execute();

  // Create updated_at trigger function (if it doesn't exist)
  await sql`
    CREATE OR REPLACE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = now();
      RETURN NEW;
    END;
    $$ language 'plpgsql';
  `.execute(db);

  // Add triggers to auto-update updated_at columns
  await sql`
    CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
  `.execute(db);

  await sql`
    CREATE TRIGGER update_questions_updated_at
    BEFORE UPDATE ON questions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
  `.execute(db);

  await sql`
    CREATE TRIGGER update_quiz_attempts_updated_at
    BEFORE UPDATE ON quiz_attempts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
  `.execute(db);
}

export async function down(db: Kysely<any>): Promise<void> {
  // Drop triggers
  await sql`DROP TRIGGER IF EXISTS update_quiz_attempts_updated_at ON quiz_attempts`.execute(db);
  await sql`DROP TRIGGER IF EXISTS update_questions_updated_at ON questions`.execute(db);
  await sql`DROP TRIGGER IF EXISTS update_users_updated_at ON users`.execute(db);
  await sql`DROP FUNCTION IF EXISTS update_updated_at_column()`.execute(db);

  // Drop tables in reverse order (respecting foreign keys)
  await db.schema.dropTable('user_answers').ifExists().execute();
  await db.schema.dropTable('quiz_attempts').ifExists().execute();
  await db.schema.dropTable('questions').ifExists().execute();
  await db.schema.dropTable('users').ifExists().execute();
}
