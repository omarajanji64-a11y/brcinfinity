import { NextResponse } from 'next/server';

import {
  ADMIN_SESSION_COOKIE,
  ADMIN_SESSION_MAX_AGE,
  ADMIN_SESSION_VALUE,
} from '@/lib/admin-session';

const ADMIN_PASSWORD = 'brc1234';

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { password?: string } | null;
  const password = body?.password?.trim();

  if (!password) {
    return NextResponse.json({ error: 'Şifre gerekli.' }, { status: 400 });
  }

  if (password !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Şifre yanlış.' }, { status: 401 });
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set({
    name: ADMIN_SESSION_COOKIE,
    value: ADMIN_SESSION_VALUE,
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: ADMIN_SESSION_MAX_AGE,
    path: '/',
  });

  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.set({
    name: ADMIN_SESSION_COOKIE,
    value: '',
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 0,
    path: '/',
  });

  return response;
}
