// src/app/_actions/setStudentRole.ts
'use server'

import { clerkClient, currentUser } from '@clerk/nextjs/server'

export type SetResult = {
    success: boolean;
    error?: string;
    redirectUrl?: string;
};

// Updated student data structure to match API response
export async function setStudentRole(studentData: {
    id: number;
    name: string;
    email: string;
    role: string;
    gradeLevel: string;
    status: string;
    studentNumber: string;
    dateOfBirth: string;
    gender: string;
    guardianName: string;
    guardianContact: string;
    address: string;
}): Promise<SetResult> {
    try {
        if (!process.env.CLERK_SECRET_KEY) {
            console.error('❌ Missing CLERK_SECRET_KEY environment variable');
            return { success: false, error: 'Server configuration error: Missing authentication keys' };
        }

        const user = await currentUser();
        
        if (!user) {
            console.warn('❌ Unauthorized: No user found');
            return { success: false, error: 'Unauthorized: User not authenticated' };
        }

        const userId = user.id;
        console.log('🔑 User authenticated:', { userId });

        try {
            const client = await clerkClient();
            console.log('🔑 Clerk client initialized, updating student metadata...');

            const currentUserData = await client.users.getUser(userId);
            console.log('📋 Current student metadata:', {
                userId,
                currentRole: currentUserData.privateMetadata?.role,
                metadata: currentUserData.privateMetadata
            });

            // Update both private and public metadata with exact field names
            await client.users.updateUser(userId, {
                privateMetadata: {
                    role: 'student', // Keep role private for security
                    studentId: studentData.id,
                    studentNumber: studentData.studentNumber
                },
                publicMetadata: {
                    name: studentData.name,
                    email: studentData.email,
                    gradeLevel: studentData.gradeLevel,
                    status: studentData.status,
                    dateOfBirth: studentData.dateOfBirth,
                    gender: studentData.gender,
                    guardianName: studentData.guardianName,
                    guardianContact: studentData.guardianContact,
                    address: studentData.address
                }
            });

            const updatedUserData = await client.users.getUser(userId);
            console.log('✅ Student metadata updated successfully:', {
                userId,
                privateMetadata: updatedUserData.privateMetadata,
                publicMetadata: updatedUserData.publicMetadata
            });

            return {
                success: true,
                redirectUrl: '/student/dashboard'
            };

        } catch (clerkError) {
            console.error('💥 Clerk client or update error:', clerkError);
            console.error('💥 Clerk error details:', {
                name: clerkError instanceof Error ? clerkError.name : 'Unknown',
                message: clerkError instanceof Error ? clerkError.message : String(clerkError),
                stack: clerkError instanceof Error ? clerkError.stack : 'No stack trace'
            });
            return {
                success: false,
                error: clerkError instanceof Error ? clerkError.message : 'Clerk operation failed'
            };
        }

    } catch (error) {
        console.error('💥 Error in setStudentRole:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'An unexpected error occurred while updating student role'
        };
    }
}
