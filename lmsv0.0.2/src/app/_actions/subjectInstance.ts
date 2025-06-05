'use server';

import { PrismaClient } from '@/generated/prisma';
import { auth } from '@clerk/nextjs/server';

const prisma = new PrismaClient();

export async function createSubjectInstance(formData: {
  teacherName: string;
  grade: string;
  section: string;
  enrollment: number;
  icon: string;
  subjectId: string;
}) {
  const { userId } = await auth();

  if (!userId) throw new Error('Unauthorized');

  const { teacherName, grade, section, enrollment, icon, subjectId } = formData;

  if (!teacherName || !grade || !section || !subjectId) {
    throw new Error('Missing required fields');
  }

  const instance = await prisma.subjectInstance.create({
    data: {
      teacherName,
      grade,
      section,
      enrollment,
      icon,
      subjectId,
      createdById: userId,
    },
  });

  return instance;
}