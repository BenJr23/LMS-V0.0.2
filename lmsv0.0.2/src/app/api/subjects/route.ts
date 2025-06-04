import { NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const subjects = await prisma.subject.findMany({
      orderBy: { name: 'asc' },
    });

    return NextResponse.json(subjects);
  } catch (error) {
    console.error('Failed to fetch subjects:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { name, code } = await req.json();
    const createdById = 'user_admin123'; // Replace with session user if needed

    if (!name || !code) {
      return NextResponse.json({ error: 'Missing name or code' }, { status: 400 });
    }

    const newSubject = await prisma.subject.create({
      data: {
        name,
        code,
        createdById,
      },
    });

    return NextResponse.json(newSubject, { status: 201 });
  } catch (error) {
    console.error('Failed to create subject:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
