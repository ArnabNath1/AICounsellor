import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return Response.json(
        { error: 'Name, email, and password required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email));

    if (existingUser.length > 0) {
      return Response.json(
        { error: 'User already exists' },
        { status: 409 }
      );
    }

    // Generate user ID
    const userId = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // In a real app, you'd hash the password
    // For the prototype, we'll store it as-is
    const newUser = await db
      .insert(users)
      .values({
        id: userId,
        name,
        email,
        password // In production, this should be hashed
      })
      .returning();

    return Response.json({
      success: true,
      user: {
        id: newUser[0].id,
        name: newUser[0].name,
        email: newUser[0].email
      }
    });
  } catch (error) {
    console.error('[Signup API] Error:', error);
    return Response.json(
      { error: 'Signup failed' },
      { status: 500 }
    );
  }
}
