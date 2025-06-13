'use server';

import { PrismaClient } from '@/generated/prisma';
import { revalidatePath } from 'next/cache';
import { auth } from '@clerk/nextjs/server';

const prisma = new PrismaClient();

export interface CreateRequirementData {
  requirementNumber: number;
  title?: string;
  content?: string;
  scoreBase: number;
  deadline: Date;
  type: string;
  subjectInstanceId: string;
}

export async function createRequirement(data: CreateRequirementData) {
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new Error('Unauthorized');
    }

    // Validate the data
    if (!data.requirementNumber || !data.scoreBase || !data.deadline || !data.type || !data.subjectInstanceId) {
      throw new Error('Missing required fields');
    }

    // Check if the subject instance exists
    const subjectInstance = await prisma.subjectInstance.findUnique({
      where: { id: data.subjectInstanceId }
    });

    if (!subjectInstance) {
      throw new Error('Subject instance not found');
    }

    // Create the requirement
    const requirement = await prisma.requirement.create({
      data: {
        requirementNumber: data.requirementNumber,
        title: data.title,
        content: data.content,
        scoreBase: data.scoreBase,
        deadline: data.deadline,
        type: data.type,
        subjectInstanceId: data.subjectInstanceId,
        createdById: userId
      }
    });

    // Revalidate the course page to show the new requirement
    revalidatePath(`/faculty/dashboard/${data.subjectInstanceId}`);
    revalidatePath(`/student/dashboard/${data.subjectInstanceId}`);

    return { success: true, data: requirement };
  } catch (error) {
    console.error('Error creating requirement:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Failed to create requirement' };
  }
}

export async function getRequirements(subjectInstanceId: string) {
  try {
    const requirements = await prisma.requirement.findMany({
      where: { subjectInstanceId },
      orderBy: [
        { type: 'asc' },
        { requirementNumber: 'asc' }
      ]
    });

    return { success: true, data: requirements };
  } catch (error) {
    console.error('Error fetching requirements:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Failed to fetch requirements' };
  }
}

export async function updateRequirement(id: string, data: Partial<CreateRequirementData>) {
  try {
    const requirement = await prisma.requirement.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date()
      }
    });

    // Revalidate the course page to show the updated requirement
    revalidatePath(`/faculty/dashboard/${requirement.subjectInstanceId}`);
    revalidatePath(`/student/dashboard/${requirement.subjectInstanceId}`);

    return { success: true, data: requirement };
  } catch (error) {
    console.error('Error updating requirement:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Failed to update requirement' };
  }
}

export async function deleteRequirement(id: string) {
  try {
    const requirement = await prisma.requirement.delete({
      where: { id }
    });

    // Revalidate the course page to remove the deleted requirement
    revalidatePath(`/faculty/dashboard/${requirement.subjectInstanceId}`);
    revalidatePath(`/student/dashboard/${requirement.subjectInstanceId}`);

    return { success: true };
  } catch (error) {
    console.error('Error deleting requirement:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Failed to delete requirement' };
  }
} 