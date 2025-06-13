'use server';

import { PrismaClient } from '@/generated/prisma';
import { auth } from '@clerk/nextjs/server';

const prisma = new PrismaClient();

export async function getAvailableSubjects() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      throw new Error('Unauthorized');
    }

    // Get all subject instances with their enrolments
    const allSubjectInstances = await prisma.subjectInstance.findMany({
      include: {
        subject: {
          select: {
            id: true,
            name: true,
            code: true
          }
        },
        enrolments: {
          where: {
            userId: userId
          },
          select: {
            id: true,
            userId: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Filter out instances where the user is already enrolled
    const availableInstances = allSubjectInstances.filter(instance => 
      instance.enrolments.length === 0 && 
      instance.subject && 
      instance.subject.name && 
      instance.subject.code
    );

    return { 
      success: true, 
      data: availableInstances 
    };
  } catch (error) {
    console.error('Failed to fetch available subjects:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to fetch available subjects' 
    };
  }
} 