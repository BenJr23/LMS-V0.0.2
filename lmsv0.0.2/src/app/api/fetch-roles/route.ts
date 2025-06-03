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
      const html = await res.text(); // in case it's HTML
      console.error('HRMS Error Response:', html);
      return NextResponse.json({ error: 'Failed to fetch role' }, { status: res.status });
    }

    const data = await res.json();

    return NextResponse.json({
      email: data.Email,
      role: Array.isArray(data.Role) ? data.Role[0] : null,
    });

  } catch (err) {
    console.error('Error fetching role:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
