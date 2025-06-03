import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createClerkClient } from '@clerk/backend'


const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY })


const isPublicRoute = createRouteMatcher([
    '/',
]);

export default clerkMiddleware(async (auth, req) => {
    // Get the current authentication state
    const { userId } = await auth();
    const isAuthenticated = !!userId;
    //const url = new URL(req.url);

    // Debug authentication state
    // console.log('=== Authentication Debug Info ===');
    // console.log('URL:', url.pathname);
    // console.log('Is Authenticated:', isAuthenticated);
    // console.log('User ID:', userId || 'Not logged in');
    // console.log('Session ID:', sessionId || 'No active session');

    // If trying to access a protected route while not authenticated
    if (!isPublicRoute(req) && !isAuthenticated) {
        // console.log('🚫 Unauthorized access to protected route');
        await auth.protect();
    }

    // If trying to access a public route while authenticated
    if (isPublicRoute(req) && isAuthenticated) {
        // Fetch user role from Clerk
        const user = await clerkClient.users.getUser(userId);
        // Adjust this according to where you store the role (e.g., publicMetadata, privateMetadata, or a custom attribute)
        const userRole = user.publicMetadata?.role || user.privateMetadata?.role || user.unsafeMetadata?.role;

        let redirectUrl = '/student-dashboard'; // default
        if (userRole === 'Faculty') {
            redirectUrl = '/faculty-dashboard';
        } else if (userRole === 'admin') {
            redirectUrl = '/admin-dashboard';
        }
        return NextResponse.redirect(new URL(redirectUrl, req.url));
    }
}, { debug: false });// change before pushing to production

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
}