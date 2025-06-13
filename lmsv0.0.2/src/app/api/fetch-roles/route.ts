import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  console.log('🔍 Fetch-roles endpoint called');
  
  const { searchParams } = new URL(req.url);
  const encodedEmail = searchParams.get('email');
  console.log('📧 Encoded email:', encodedEmail);

  if (!encodedEmail) {
    console.log('❌ Missing email parameter');
    return NextResponse.json({ error: 'Missing email parameter' }, { status: 400 });
  }

  const email = decodeURIComponent(encodedEmail);
  console.log('📧 Decoded email:', email);
  
  const rawBody = JSON.stringify({ email });
  const timestamp = Date.now().toString();
  const secret = process.env.SJSFI_SHARED_SECRET;

  console.log('🔑 Environment check:', {
    hasSecret: !!secret,
    hasApiKey: !!process.env.SJSFI_LMS_API_KEY,
    timestamp
  });

  if (!secret) {
    console.error('❌ Missing SJSFI_SHARED_SECRET environment variable');
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
  }

  try {
    const encoder = new TextEncoder();
    const keyData = encoder.encode(secret);
    console.log('🔐 Generated key data');

    const cryptoKey = await crypto.subtle.importKey(
      "raw",
      keyData,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
    console.log('🔐 Imported crypto key');

    // Generate HMAC signature (body + timestamp)
    const signatureBuffer = await crypto.subtle.sign(
      "HMAC",
      cryptoKey,
      encoder.encode(rawBody + timestamp)
    );
    console.log('🔐 Generated signature buffer');

    // Convert signature to hex string
    const signature = Array.from(new Uint8Array(signatureBuffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    console.log('🔐 Generated signature hex');

    console.log('🚀 Making request to HRMS with:', {
      url: 'https://hrms-v2-azure.vercel.app/api/xr/user-access-lookup',
      timestamp,
      hasSignature: !!signature,
      hasApiKey: !!process.env.SJSFI_LMS_API_KEY
    });

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

    console.log('📥 HRMS Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ HRMS API error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      return NextResponse.json({ error: 'Failed to fetch role from HRMS' }, { status: response.status });
    }

    const data = await response.json();
    console.log('📦 HRMS Response data:', data);

    const role = data.Role?.[0]?.toLowerCase() || null;
    console.log('👤 Extracted role:', role);

    return NextResponse.json({ role }, { status: 200 });

  } catch (error) {
    console.error('💥 Error in fetch-roles:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : 'No stack trace'
    });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
