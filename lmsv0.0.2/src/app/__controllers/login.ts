import { PrismaClient } from '@/generated/prisma'; // adjust path if needed;
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    // 1. Find student by email
    const student = await prisma.student.findUnique({
      where: { email },
    });

    if (!student) {
      return new Response(JSON.stringify({ error: 'Invalid email or password' }), { status: 401 });
    }

    // 2. Compare hashed password
    const isPasswordValid = await bcrypt.compare(password, student.passwordHash);

    if (!isPasswordValid) {
      return new Response(JSON.stringify({ error: 'Invalid email or password' }), { status: 401 });
    }

    // 3. (Optional) Add session or token logic here

    // 4. Return success response
    return new Response(
      JSON.stringify({
        message: 'Login successful',
        student: {
          lrn: student.lrn,
          fullName: `${student.firstName} ${student.lastName}`,
          email: student.email,
          section: student.section,
          gradeLevel: student.gradeLevel,
        },
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
}