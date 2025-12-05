// Date utilities for daily quiz selection

import { Question, QuizCategory, CATEGORY_ORDER, QUESTIONS_PER_DAY } from './types';
import questionsData from '../../data/questions.json';

/**
 * Get today's date in YYYY-MM-DD format
 */
export function getTodayDate(): string {
  const now = new Date();
  return now.toISOString().split('T')[0];
}

/**
 * Check if a date string is today
 */
export function isToday(dateString: string): boolean {
  return dateString === getTodayDate();
}

/**
 * Simple seeded random number generator
 * Returns a number between 0 and 1 based on the seed
 */
function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

/**
 * Convert a date string (YYYY-MM-DD) to a numeric seed
 */
function dateSeed(dateString: string): number {
  const parts = dateString.split('-');
  const year = parseInt(parts[0]);
  const month = parseInt(parts[1]);
  const day = parseInt(parts[2]);
  return year * 10000 + month * 100 + day;
}

/**
 * Get a deterministic random selection from an array based on date
 */
function selectByDate<T>(items: T[], date: string, index: number = 0): T {
  const seed = dateSeed(date) + index;
  const randomIndex = Math.floor(seededRandom(seed) * items.length);
  return items[randomIndex];
}

/**
 * Get 5 questions for a specific date, one from each category in order
 */
export function getQuestionsForDate(dateString: string): Question[] {
  const allQuestions = questionsData.questions as Question[];
  const selectedQuestions: Question[] = [];

  // For each category in order, select one question deterministically
  CATEGORY_ORDER.forEach((category: QuizCategory, categoryIndex) => {
    const categoryQuestions = allQuestions.filter(q => q.category === category);

    if (categoryQuestions.length === 0) {
      throw new Error(`No questions found for category: ${category}`);
    }

    // Use category index + date to ensure different questions per category per day
    const question = selectByDate(categoryQuestions, dateString, categoryIndex);
    selectedQuestions.push(question);
  });

  return selectedQuestions;
}

/**
 * Get today's questions
 */
export function getTodaysQuestions(): Question[] {
  return getQuestionsForDate(getTodayDate());
}

/**
 * Format a date string for display
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString + 'T00:00:00');
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Get the difference in days between two dates
 */
export function daysDifference(date1: string, date2: string): number {
  const d1 = new Date(date1 + 'T00:00:00');
  const d2 = new Date(date2 + 'T00:00:00');
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Check if two dates are consecutive
 */
export function areConsecutiveDates(date1: string, date2: string): boolean {
  return daysDifference(date1, date2) === 1;
}

/**
 * Get yesterday's date
 */
export function getYesterdayDate(): string {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return yesterday.toISOString().split('T')[0];
}
