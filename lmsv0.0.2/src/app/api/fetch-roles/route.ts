import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const encodedEmail = searchParams.get('email');

  if (!encodedEmail) {
    return NextResponse.json({ error: 'Missing email parameter' }, { status: 400 });
  }

  const email = decodeURIComponent(encodedEmail);
  const rawBody = JSON.stringify({ email });
  const timestamp = Date.now().toString();
  const secret = process.env.SJSFI_SHARED_SECRET;

  if (!secret) {
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
  }

  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  // Step 6: Generate HMAC signature (body + timestamp)
  const signatureBuffer = await crypto.subtle.sign(
    "HMAC",
    cryptoKey,
    encoder.encode(rawBody + timestamp)
  );

  // Step 7: Convert signature to hex string
  const signature = Array.from(new Uint8Array(signatureBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  try {
    const response = await fetch(`https://hrms-v2-azure.vercel.app/api/xr/user-access-lookup`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.SJSFI_LMS_API_KEY}`,
        'Content-Type': 'application/json',
        "x-timestamp": timestamp,
        "x-signature": signature,
      },
      body: rawBody
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch role from HRMS' }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json({ role: data.Role?.[0]?.toLowerCase() || null }, { status: 200 });

  } catch (error) {
    console.error('Error fetching role from HRMS:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
