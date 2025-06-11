'use server';

import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';

export async function createSubjectInstance(formData: {
  teacherName: string;
  grade: string;
  section: string;
  enrollment: number;
  icon: string;
  subjectId: string;
  enrolmentCode: number;
}) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return { success: false, error: 'Unauthorized' };
    }

    const { teacherName, grade, section, enrollment, icon, subjectId, enrolmentCode } = formData;

    if (!teacherName || !grade || !section || !subjectId) {
      return { success: false, error: 'Missing required fields' };
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
        enrolmentCode,
      },
      include: {
        subject: true,
      },
    });

    return { success: true, data: instance };
  } catch (error) {
    console.error('Error creating subject instance:', error);
    return { success: false, error: 'Failed to create subject instance' };
  }
}

export async function getSubjectInstances() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return { success: false, error: 'Unauthorized' };
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

    return { success: true, data: validInstances };
  } catch (error) {
    console.error('Failed to fetch subject instances:', error);
    return { success: false, error: 'Failed to fetch subject instances' };
  }
}

export async function getSubjectInstance(id: string) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return { success: false, error: 'Unauthorized' };
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
      return { success: false, error: 'Subject instance not found' };
    }

    return { success: true, data: instance };
  } catch (error) {
    console.error('Failed to fetch subject instance:', error);
    return { success: false, error: 'Failed to fetch subject instance' };
  }
}

export async function updateSubjectInstance(id: string, data: {
  teacherName: string;
  grade: string;
  section: string;
  enrollment: number;
}) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return { success: false, error: 'Unauthorized' };
    }

    const updatedInstance = await prisma.subjectInstance.update({
      where: {
        id,
        createdById: userId
      },
      data: {
        teacherName: data.teacherName,
        grade: data.grade,
        section: data.section,
        enrollment: data.enrollment,
      },
      include: {
        subject: true,
      },
    });

    if (!updatedInstance) {
      return { success: false, error: 'Subject instance not found' };
    }

    return { success: true, data: updatedInstance };
  } catch (error) {
    console.error('Error updating subject instance:', error);
    return { success: false, error: 'Failed to update subject instance' };
  }
}