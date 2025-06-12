// src/app/_actions/setUserRole.ts
'use server'

import { clerkClient, currentUser } from '@clerk/nextjs/server'

export type SetResult = {
    success: boolean;
    error?: string;
    redirectUrl?: string;
};

export async function setUserRole(role: string): Promise<SetResult> {
    try {
        // Check if required environment variables are present
        if (!process.env.CLERK_SECRET_KEY) {
            console.error('❌ Missing CLERK_SECRET_KEY environment variable');
            return { success: false, error: 'Server configuration error: Missing authentication keys' };
        }

        if (!role || typeof role !== 'string') {
            console.warn('❌ Invalid role provided:', { role, type: typeof role });
            return { success: false, error: 'Invalid role provided' };
        }

        const user = await currentUser();
        const userId = user?.id;

        if (!userId) {
            console.warn('❌ Unauthorized: No user ID found');
            return { success: false, error: 'Unauthorized: User not authenticated' };
        }

        const allowedRoles = ['faculty', 'admin'];
        const normalizedRole = role.toLowerCase();
        console.log('🔍 Role validation:', {
            originalRole: role,
            normalizedRole,
            allowedRoles,
            isAllowed: allowedRoles.includes(normalizedRole)
        });

        if (!allowedRoles.includes(normalizedRole)) {
            console.warn('❌ Invalid role attempted:', { role, normalizedRole, allowedRoles });
            return { success: false, error: 'Invalid role: Role not allowed' };
        }

        try {
            const client = await clerkClient();
            console.log('🔑 Clerk client initialized, updating user metadata...');

            // Get current user metadata before update
            const currentUserData = await client.users.getUser(userId);
            console.log('📋 Current user metadata:', {
                userId,
                currentRole: currentUserData.privateMetadata?.role,
                metadata: currentUserData.privateMetadata
            });

            // Update Clerk private metadata with role
            await client.users.updateUserMetadata(userId, {
                privateMetadata: {
                    role: normalizedRole,
                },
            });

            // Verify the update was successful
            const updatedUserData = await client.users.getUser(userId);
            console.log('✅ Role update verification:', {
                userId,
                requestedRole: normalizedRole,
                actualRole: updatedUserData.privateMetadata?.role,
                metadata: updatedUserData.privateMetadata,
                updateSuccessful: updatedUserData.privateMetadata?.role === normalizedRole
            });

            return { 
                success: true,
                redirectUrl: normalizedRole === 'admin' ? '/admin/admin-dashboard' : '/faculty/faculty-dashboard'
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
        console.error('💥 Error in setUserRole:', error);
        return { 
            success: false, 
            error: error instanceof Error ? error.message : 'An unexpected error occurred while updating user role'
        };
    }
}

// Add this as a safety check to ensure the function always returns a proper result
export async function validateSetResult(result: unknown): Promise<SetResult> {
    if (!result || typeof result !== 'object') {
        console.error('❌ Invalid setUserRole result:', result);
        return { success: false, error: 'Invalid server response' };
    }

    const resultObj = result as Record<string, unknown>;
    if (typeof resultObj.success !== 'boolean') {
        console.error('❌ setUserRole result missing success property:', result);
        return { success: false, error: 'Invalid server response format' };
    }

    return result as SetResult;
}
