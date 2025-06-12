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

  try {
    console.log('Fetching student data for email:', email);
    
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
      console.error('Failed to fetch student data. Status:', response.status);
      return NextResponse.json({ error: 'Failed to fetch student data' }, { status: response.status });
    }

    const data = await response.json();
    
    // Log the complete student data
    console.log('Student Data Retrieved:', {
      timestamp: new Date().toISOString(),
      email: email,
      data: data
    });

    // Log specific fields if they exist
    if (data) {
      console.log('Student Details:', {
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
    console.error('Error fetching student data:', {
      error: error,
      email: email,
      timestamp: new Date().toISOString()
    });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
