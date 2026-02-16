import { NextResponse } from 'next/server';
import { verifyAdminCredentials, createAdminSession } from '@/lib/auth';
import { adminLoginSchema } from '@/lib/schemas';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = adminLoginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid payload', issues: parsed.error.issues },
        { status: 400 }
      );
    }
    const { username, password } = parsed.data;

    const valid = await verifyAdminCredentials(username, password);
    if (!valid) {
      return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
    }

    await createAdminSession(username);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json({ success: false, error: 'Login failed' }, { status: 500 });
  }
}
