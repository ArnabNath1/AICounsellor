import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return Response.json(
        { error: 'Email and password required' },
        { status: 400 }
      );
    }

    console.log('[Login API] Attempting login for email:', email);

    // In a real app, you'd hash and verify passwords
    // For now, we'll do a simple lookup
    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, email));

    if (user.length === 0) {
      console.log('[Login API] User not found:', email);
      return Response.json(
        { error: 'User not found. Please signup first.' },
        { status: 404 }
      );
    }

    const userData = user[0];
    console.log('[Login API] User found, returning data for:', userData.email);
    
    // Return user data (in real app, you'd set JWT tokens)
    return Response.json({
      success: true,
      user: {
        id: userData.id,
        name: userData.name,
        email: userData.email
      }
    });
  } catch (error) {
    console.error('[Login API] Error:', error);
    return Response.json(
      { error: 'Login failed' },
      { status: 500 }
    );
  }
}
