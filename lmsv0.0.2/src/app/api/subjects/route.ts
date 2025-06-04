import { NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';
import { auth } from '@clerk/nextjs/server';

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
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, code } = await req.json();

    if (!name || !code) {
      return NextResponse.json({ error: 'Missing name or code' }, { status: 400 });
    }

    const newSubject = await prisma.subject.create({
      data: {
        name,
        code,
        createdById: userId,
      },
    });

    return NextResponse.json(newSubject, { status: 201 });
  } catch (error) {
    console.error('Failed to create subject:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
