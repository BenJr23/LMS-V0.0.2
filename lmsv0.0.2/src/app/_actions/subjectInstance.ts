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

  // Generate a random 4-digit enrollment code
  const enrolmentCode = Math.floor(1000 + Math.random() * 9000);

  const instance = await prisma.subjectInstance.create({
    data: {
      teacherName,
      grade,
      section,
      enrollment,
      icon,
      subjectId,
      createdById: userId,
      enrolmentCode,
    },
  });

  return instance;
}


export async function getSubjectInstances() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return [];
    }

    const instances = await prisma.subjectInstance.findMany({
      where: {
        createdById: userId
      },
      include: {
        subject: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Filter out any instances with null subject data
    const validInstances = instances.filter(instance => 
      instance && 
      instance.subject && 
      instance.subject.name && 
      instance.subject.code
    );

    return validInstances;
  } catch (error) {
    console.error('Failed to fetch subject instances:', error);
    return [];
  }
}

export async function getSubjectInstance(id: string) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      throw new Error('Unauthorized');
    }

    const instance = await prisma.subjectInstance.findUnique({
      where: {
        id,
        createdById: userId
      },
      include: {
        subject: true,
      },
    });

    if (!instance) {
      throw new Error('Subject instance not found');
    }

    return instance;
  } catch (error) {
    console.error('Failed to fetch subject instance:', error);
    throw new Error('Could not retrieve subject instance');
  }
}