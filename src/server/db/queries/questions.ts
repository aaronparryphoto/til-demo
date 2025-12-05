// Database queries for questions

import { db } from '@/server/connections/db';
import type { Question } from '@/server/db/schema';

/**
 * Get all active questions from the database
 */
export async function getActiveQuestions(): Promise<Question[]> {
  const questions = await db
    .selectFrom('questions')
    .selectAll()
    .where('is_active', '=', true)
    .execute();

  return questions;
}

/**
 * Get questions by category
 */
export async function getQuestionsByCategory(
  category: 'History' | 'Science' | 'Geography' | 'Pop Culture' | 'Politics'
): Promise<Question[]> {
  const questions = await db
    .selectFrom('questions')
    .selectAll()
    .where('category', '=', category)
    .where('is_active', '=', true)
    .execute();

  return questions;
}

/**
 * Get a single question by ID
 */
export async function getQuestionById(id: string): Promise<Question | null> {
  const question = await db
    .selectFrom('questions')
    .selectAll()
    .where('id', '=', id)
    .executeTakeFirst();

  return question || null;
}

/**
 * Get multiple questions by IDs
 */
export async function getQuestionsByIds(ids: string[]): Promise<Question[]> {
  if (ids.length === 0) {
    return [];
  }

  const questions = await db
    .selectFrom('questions')
    .selectAll()
    .where('id', 'in', ids)
    .execute();

  return questions;
}
