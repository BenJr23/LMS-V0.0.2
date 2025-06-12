// src/app/_actions/setStudentRole.ts
'use server'

import { clerkClient, currentUser } from '@clerk/nextjs/server'

export type SetResult = {
    success: boolean;
    error?: string;
    redirectUrl?: string;
};

// The student data now matches your API response
export async function setStudentRole(studentData: {
    full_name: string;
    email: string;
    role: string;
    grade_level: string;
    enrollment_status: string;
    status: string;
}): Promise<SetResult> {
    try {
        if (!process.env.CLERK_SECRET_KEY) {
            console.error('❌ Missing CLERK_SECRET_KEY environment variable');
            return { success: false, error: 'Server configuration error: Missing authentication keys' };
        }

        const user = await currentUser();
        const userId = user?.id;

        if (!userId) {
            console.warn('❌ Unauthorized: No user ID found');
            return { success: false, error: 'Unauthorized: User not authenticated' };
        }

        try {
            const client = await clerkClient();
            console.log('🔑 Clerk client initialized, updating student metadata...');

            const currentUserData = await client.users.getUser(userId);
            console.log('📋 Current student metadata:', {
                userId,
                currentRole: currentUserData.privateMetadata?.role,
                metadata: currentUserData.privateMetadata
            });

            // Always assign role: student
            await client.users.updateUserMetadata(userId, {
                privateMetadata: {
                    role: 'student',
                    full_name: studentData.full_name,
                    email: studentData.email,
                    grade_level: studentData.grade_level,
                    enrollment_status: studentData.enrollment_status,
                    status: studentData.status
                },
            });

            const updatedUserData = await client.users.getUser(userId);
            console.log('✅ Student metadata updated successfully:', {
                userId,
                updatedMetadata: updatedUserData.privateMetadata
            });

            return {
                success: true,
                redirectUrl: '/student/student-dashboard'
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
