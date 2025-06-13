'use server';

import { PrismaClient, Enrolment } from '@/generated/prisma';
import { auth, clerkClient } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';

const prisma = new PrismaClient();

export interface EnrolmentData {
  subjectInstanceId: string;
  code: number;
  fullName: string;
  email: string;
  gradeLevel: string;
  enrollmentStatus: string;
  status: string;
  hasNewContent?: boolean;  // Added to match schema
}

interface EnrolmentResponse {
  success: boolean;
  data?: Enrolment;
  error?: string;
}

export async function createEnrolment(subjectInstanceId: string, code: number): Promise<EnrolmentResponse> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return {
        success: false,
        error: 'Unauthorized: Please sign in to enroll in subjects.'
      };
    }

    // First, verify the enrollment code
    const subjectInstance = await prisma.subjectInstance.findUnique({
      where: { id: subjectInstanceId }
    });

    if (!subjectInstance) {
      return {
        success: false,
        error: 'Subject instance not found.'
      };
    }

    if (subjectInstance.enrolmentCode !== code) {
      return {
        success: false,
        error: 'Invalid enrollment code.'
      };
    }

    // Check if student is already enrolled
    const existingEnrolment = await prisma.enrolment.findFirst({
      where: {
        userId: userId,
        subjectInstanceId: subjectInstanceId
      }
    });

    if (existingEnrolment) {
      return {
        success: false,
        error: 'You are already enrolled in this subject.'
      };
    }

    // Get student data from Clerk metadata
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const metadata = user.publicMetadata;

    console.log('User metadata:', metadata); // Debug log

    // Validate enrollment status and status
    if (metadata.enrollment_status !== 'enrolled') {
      return {
        success: false,
        error: 'Your enrollment status is not active. Please contact the administrator.'
      };
    }

    if (metadata.status !== 'active') {
      return {
        success: false,
        error: 'Your account is not active. Please contact the administrator.'
      };
    }

    // Create the enrollment with metadata
    const enrolment = await prisma.enrolment.create({
      data: {
        userId,
        subjectInstanceId,
        code,
        fullName: metadata.full_name as string,
        email: metadata.email as string,
        gradeLevel: metadata.grade_level as string,
        enrollmentStatus: metadata.enrollment_status as string,
        status: metadata.status as string
      }
    });

    // Revalidate both pages to ensure consistency
    revalidatePath('/student/subjects');
    revalidatePath('/student/dashboard');

    return {
      success: true,
      data: enrolment
    };

  } catch (error) {
    console.error('Error in createEnrolment:', error);
    return {
      success: false,
      error: 'An unexpected error occurred.'
    };
  }
}

export async function getEnrolledSubjects() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return {
        success: false,
        error: 'Unauthorized: Please sign in to view enrolled subjects.'
      };
    }

    const enrolments = await prisma.enrolment.findMany({
      where: {
        userId: userId
      },
      include: {
        subjectInstance: {
          include: {
            subject: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return {
      success: true,
      data: enrolments
    };

  } catch (error) {
    console.error('Error in getEnrolledSubjects:', error);
    return {
      success: false,
      error: 'An unexpected error occurred.'
    };
  }
}