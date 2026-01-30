import { db } from '@/db';
import { users, profiles } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(req: Request) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return Response.json(
        { authenticated: false },
        { status: 401 }
      );
    }

    // Check if user exists
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (user.length === 0) {
      return Response.json(
        { authenticated: false },
        { status: 401 }
      );
    }

    // Check if user has completed onboarding (has profile)
    const profile = await db
      .select()
      .from(profiles)
      .where(eq(profiles.userId, userId))
      .limit(1);

    return Response.json({
      authenticated: true,
      user: user[0],
      onboardingComplete: profile.length > 0
    });
  } catch (error) {
    console.error('[Auth Check] Error:', error);
    return Response.json(
      { authenticated: false },
      { status: 500 }
    );
  }
}
