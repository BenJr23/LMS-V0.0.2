import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email');

  if (!email) {
    return NextResponse.json({ error: 'Missing email' }, { status: 400 });
  }

  try {
    const res = await fetch(`https://hrms-v2-azure.vercel.app/api/getUserRole?email=${encodeURIComponent(email)}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SJSFI_HRMS_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch role' }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);

  } catch (err) {
    console.error('Fetch error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
