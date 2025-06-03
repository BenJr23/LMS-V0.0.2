import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const encodedEmail = searchParams.get('email');

  if (!encodedEmail) {
    return NextResponse.json({ error: 'Missing email parameter' }, { status: 400 });
  }

  const email = decodeURIComponent(encodedEmail); // ✅ this will convert %40 to @

  console.log('Email received:', email); // will now show admin@admin.com

  try {
    const response = await fetch(`https://hrms-v2-azure.vercel.app/api/getUserRole?email=${encodeURIComponent(email)}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.SJSFI_LMS_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch role from HRMS' }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json({ role: data.Role?.[0] || null });

  } catch (error) {
    console.error('Error fetching role from HRMS:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
