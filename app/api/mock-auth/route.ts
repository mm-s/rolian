// app/api/mock-auth/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json();
  // mock verify signature
  if (!body.account || !body.signature) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }
  return NextResponse.json({ success: true });
}

