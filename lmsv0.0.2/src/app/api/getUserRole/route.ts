// app/api/getUserRole/route.ts
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email');

  if (!email) {
    return NextResponse.json({ error: 'Missing email parameter' }, { status: 400 });
  }

  try {
    const res = await fetch(`https://hrms-v2-azure.vercel.app/api/getUserRole?email=${encodeURIComponent(email)}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.SJSFI_LMS_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch role' }, { status: res.status });
    }

    const data = await res.json();

    const role = Array.isArray(data.Role) ? data.Role[0] : null;

    return NextResponse.json({
      email: data.Email,
      role,
    });

  } catch (err) {
    console.error('Error fetching role:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
