// Server actions for user management
'use server';

import { db } from '@/server/connections/db';
import { getSessionId, createSession } from '@/server/utils/session';
import type { User } from '@/server/db/schema';

/**
 * Get the current user based on session cookie
 * Returns null if no user exists for the session
 */
export async function getCurrentUser(): Promise<User | null> {
  const sessionId = await getSessionId();

  if (!sessionId) {
    return null;
  }

  const user = await db
    .selectFrom('users')
    .selectAll()
    .where('id', '=', sessionId)
    .executeTakeFirst();

  return user || null;
}

/**
 * Ensure a user exists for the current session
 * Creates an anonymous user if one doesn't exist
 * Returns the user ID
 */
export async function ensureUser(): Promise<string> {
  let sessionId = await getSessionId();

  // Create session if it doesn't exist
  if (!sessionId) {
    sessionId = await createSession();
  }

  // Check if user exists
  const existingUser = await db
    .selectFrom('users')
    .select('id')
    .where('id', '=', sessionId)
    .executeTakeFirst();

  if (existingUser) {
    return existingUser.id;
  }

  // Create new anonymous user
  const newUser = await db
    .insertInto('users')
    .values({
      id: sessionId,
      name: `User ${sessionId.substring(0, 8)}`,
      phone_number: null,
    })
    .returning('id')
    .executeTakeFirstOrThrow();

  return newUser.id;
}

/**
 * Update the current user's profile
 */
export async function updateUserProfile(data: {
  name?: string;
  phone_number?: string;
}): Promise<User> {
  const userId = await ensureUser();

  const updatedUser = await db
    .updateTable('users')
    .set({
      ...(data.name && { name: data.name }),
      ...(data.phone_number !== undefined && { phone_number: data.phone_number }),
    })
    .where('id', '=', userId)
    .returningAll()
    .executeTakeFirstOrThrow();

  return updatedUser;
}
