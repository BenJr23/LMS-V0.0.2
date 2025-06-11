'use server';

import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';

export async function createSubject(formData: FormData) {
    const { userId } = await auth();

    if (!userId) {
        return { success: false, error: 'Unauthorized' };
    }

    const name = formData.get('name') as string;
    const code = formData.get('code') as string;

    if (!name || !code) {
        return { success: false, error: 'Missing name or code' };
    }

    try {
        const newSubject = await prisma.subject.create({
            data: {
                name,
                code,
                createdById: userId,
            },
        });

        return { success: true, data: newSubject };
    } catch (error) {
        console.error('Failed to create subject:', error);
        return { success: false, error: 'Failed to create subject' };
    }
}

export async function getSubjects() {
    try {
        const subjects = await prisma.subject.findMany({
            orderBy: { name: 'asc' },
        });

        return { success: true, data: subjects };
    } catch (error) {
        console.error('Failed to fetch subjects:', error);
        return { success: false, error: 'Failed to fetch subjects' };
    }
}

export async function deleteSubject(id: string) {
    const { userId } = await auth();

    if (!userId) {
        return { success: false, error: 'Unauthorized' };
    }

    try {
        const deleted = await prisma.subject.delete({
            where: { id },
        });

        return { success: true, data: deleted };
    } catch (error) {
        console.error('Failed to delete subject:', error);
        return { success: false, error: 'Failed to delete subject' };
    }
}