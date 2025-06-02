import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email');

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  try {
    const response = await fetch(`https://hrms-v2-azure.vercel.app/api/getUserRole?email=${encodeURIComponent(email)}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.SJSFI_HRMS_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error from HRMS API: ${response.status} ${response.statusText}: ${errorText}`);
      return NextResponse.json({ error: 'Failed to fetch role' }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json({ role: Array.isArray(data.Role) ? data.Role[0] : null });
  } catch (err) {
    console.error('Fetch failed:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
