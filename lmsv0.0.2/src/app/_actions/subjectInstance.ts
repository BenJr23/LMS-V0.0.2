'use server';

import { PrismaClient } from '@/generated/prisma';
import { auth } from '@clerk/nextjs/server';

const prisma = new PrismaClient();

export interface CreateSubjectInstanceData {
  teacherName: string;
  grade: string;
  section: string;
  enrollment: number;
  enrolmentCode: number;
  icon: string;
  subjectId: string;
}

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

    if (!userId) throw new Error('Unauthorized');

    const { teacherName, grade, section, enrollment, icon, subjectId, enrolmentCode } = formData;

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
        enrolmentCode,
      },
      include: {
        subject: true,
      },
    });

    return instance;
  } catch (error) {
    console.error('Error creating subject instance:', error);
    throw error;
  }
}


export async function getSubjectInstances() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return { success: false, error: 'Unauthorized', data: [] };
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

    // Ensure we always return an array
    const validInstances = Array.isArray(instances) ? instances : [];
    
    // Filter out any instances with null subject data
    const filteredInstances = validInstances.filter(instance => 
      instance && 
      instance.subject && 
      instance.subject.name && 
      instance.subject.code
    );

    return { success: true, data: filteredInstances };
  } catch (error) {
    console.error('Failed to fetch subject instances:', error);
    return { success: false, error: 'Failed to fetch subject instances', data: [] };
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

export async function updateSubjectInstance(id: string, data: {
  teacherName: string;
  grade: string;
  section: string;
  enrollment: number;
}) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      throw new Error('Unauthorized');
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
      throw new Error('Subject instance not found');
    }

    return updatedInstance;
  } catch (error) {
    console.error('Error updating subject instance:', error);
    throw error;
  }
}

export async function getSubjectInstanceDetails(id: string) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return { success: false, error: 'Unauthorized', data: null };
    }

    const subjectInstance = await prisma.subjectInstance.findUnique({
      where: { id },
      include: {
        subject: {
          select: {
            id: true,
            name: true,
            code: true
          }
        },
        announcements: {
          where: {
            subjectInstanceId: id
          },
          select: {
            id: true,
            title: true,
            content: true,
            createdAt: true,
            updatedAt: true
          },
          orderBy: {
            createdAt: 'desc'
          }
        },
        moduleFolders: {
          where: {
            subjectInstanceId: id
          },
          select: {
            id: true,
            folderName: true,
            createdAt: true,
            updatedAt: true
          },
          orderBy: {
            createdAt: 'desc'
          }
        },
        uploadedContents: {
          where: {
            subjectInstanceId: id
          },
          select: {
            id: true,
            fileName: true,
            filePath: true,
            createdAt: true,
            updatedAt: true
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    });

    if (!subjectInstance) {
      return { success: false, error: 'Subject instance not found', data: null };
    }

    // Ensure all required fields are present
    if (!subjectInstance.subject || !subjectInstance.subject.code) {
      return { success: false, error: 'Invalid subject data', data: null };
    }

    return { success: true, data: subjectInstance };
  } catch (error) {
    console.error('Failed to fetch subject instance details:', error);
    return { success: false, error: 'Failed to fetch subject instance details', data: null };
  }
}