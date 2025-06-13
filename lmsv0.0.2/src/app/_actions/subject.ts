'use server';

import { PrismaClient } from '@/generated/prisma';
import { auth } from '@clerk/nextjs/server';

const prisma = new PrismaClient();

export async function createSubject(formData: FormData) {
    const { userId } = await auth();

    if (!userId) {
        throw new Error('Unauthorized');
    }

    const name = formData.get('name') as string;
    const code = formData.get('code') as string;

    if (!name || !code) {
        throw new Error('Missing name or code');
    }

    const newSubject = await prisma.subject.create({
        data: {
            name,
            code,
            createdById: userId,
        },
    });

    return newSubject;
}

export async function getSubjects() {
    try {
        const { userId } = await auth();
        
        if (!userId) {
            return { success: false, error: 'Unauthorized', data: [] };
        }

        const subjects = await prisma.subject.findMany({
            orderBy: { name: 'asc' },
        });

        return { success: true, data: subjects || [] };
    } catch (error) {
        console.error('Failed to fetch subjects:', error);
        return { success: false, error: 'Failed to fetch subjects', data: [] };
    }
}

export async function deleteSubject(id: string) {
    const { userId } = await auth();

    if (!userId) {
        throw new Error('Unauthorized');
    }

    const deleted = await prisma.subject.delete({
        where: { id },
    });

    return deleted;
}