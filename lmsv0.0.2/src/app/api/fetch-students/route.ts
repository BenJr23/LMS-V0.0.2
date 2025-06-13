import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  console.log('📥 Fetch Students API: Request received');
  const { searchParams } = new URL(req.url);
  const encodedEmail = searchParams.get('email');

  if (!encodedEmail) {
    console.error('❌ Fetch Students API: Missing email parameter');
    return NextResponse.json({ error: 'Missing email parameter' }, { status: 400 });
  }

  const email = decodeURIComponent(encodedEmail);
  console.log('📧 Fetch Students API: Processing request for email:', email);

  const rawBody = JSON.stringify({ email });
  const timestamp = Date.now().toString();
  const secret = process.env.SJSFI_SHARED_SECRET;

  if (!secret) {
    console.error('❌ Fetch Students API: Server configuration error - Missing SJSFI_SHARED_SECRET');
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
  }

  console.log('🔑 Fetch Students API: Generating HMAC signature');
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  // Generate HMAC signature (body + timestamp)
  const signatureBuffer = await crypto.subtle.sign(
    "HMAC",
    cryptoKey,
    encoder.encode(rawBody + timestamp)
  );

  // Convert signature to hex string
  const signature = Array.from(new Uint8Array(signatureBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  console.log('🔐 Fetch Students API: Signature generated successfully');

  try {
    console.log('🌐 Fetch Students API: Making request to external API');
    console.log('Request details:', {
      url: 'https://sjsfi-auth-2a04ezduh-dnsxmrs-projects.vercel.app/api/xr/getStudent',
      method: 'POST',
      timestamp,
      email
    });
    
    const response = await fetch('https://sjsfi-auth-2a04ezduh-dnsxmrs-projects.vercel.app/api/xr/getStudent', {
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
      console.error('❌ Fetch Students API: External API request failed', {
        status: response.status,
        statusText: response.statusText,
        email
      });
      return NextResponse.json({ error: 'Failed to fetch student data' }, { status: response.status });
    }

    const data = await response.json();
    
    // Log the complete student data
    console.log('✅ Fetch Students API: Student data retrieved successfully', {
      timestamp: new Date().toISOString(),
      email: email,
      data: data
    });

    // Log specific fields if they exist
    if (data) {
      console.log('📋 Fetch Students API: Student details', {
        name: `${data.first_name} ${data.last_name}`,
        email: data.email,
        role: data.role,
        grade_level: data.grade_level,
        enrollment_status: data.enrollment_status,
        status: data.status
      });
    }
    
    return NextResponse.json({
      full_name: `${data.first_name} ${data.last_name}`,
      email: data.email,
      role: data.role,
      grade_level: data.grade_level,
      enrollment_status: data.enrollment_status,
      status: data.status
    }, { status: 200 });
    

  } catch (error) {
    console.error('💥 Fetch Students API: Error occurred', {
      error: error,
      email: email,
      timestamp: new Date().toISOString(),
      stack: error instanceof Error ? error.stack : 'No stack trace'
    });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
