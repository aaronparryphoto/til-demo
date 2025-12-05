// Seed questions from questions.json into the database

import { db } from '@/server/connections/db';
import { sql } from 'kysely';
import questionsData from '../../../../data/questions.json';

interface QuestionData {
  id: string;
  category: 'History' | 'Science' | 'Geography' | 'Pop Culture' | 'Politics';
  questionText: string;
  options: string[];
  correctAnswerIndex: number;
  explanation?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
}

export async function seedQuestions() {
  const questions = questionsData.questions as QuestionData[];

  console.log(`Seeding ${questions.length} questions...`);

  // Clear existing questions
  await db.deleteFrom('questions').execute();

  // Insert questions in batches of 10
  const batchSize = 10;
  for (let i = 0; i < questions.length; i += batchSize) {
    const batch = questions.slice(i, i + batchSize);

    await db
      .insertInto('questions')
      .values(
        batch.map((q) => ({
          id: q.id,
          category: q.category,
          question_text: q.questionText,
          options: sql`${JSON.stringify(q.options)}::jsonb`,
          correct_answer_index: q.correctAnswerIndex,
          explanation: q.explanation || null,
          difficulty: q.difficulty || null,
          is_active: true,
        }))
      )
      .execute();

    console.log(`✓ Inserted batch ${Math.floor(i / batchSize) + 1}`);
  }

  console.log(`✅ Successfully seeded ${questions.length} questions`);
}
