import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createClerkClient } from '@clerk/backend';

const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

const isPublicRoute = createRouteMatcher([
    '/',
    '/api/fetch-roles',
]);

async function fetchUserRoleDirectly(email: string): Promise<string | null> {
    try {
        const response = await fetch(`https://hrms-v2-azure.vercel.app/api/getUserRole?email=${encodeURIComponent(email)}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${process.env.SJSFI_LMS_API_KEY}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) return null;

        const data = await response.json();
        return data.Role?.[0] || null;
    } catch (error) {
        console.error('Middleware role fetch error:', error);
        return null;
    }
}

export default clerkMiddleware(async (auth, req) => {
    const { userId } = await auth();
    const isAuthenticated = !!userId;

    if (!isPublicRoute(req) && !isAuthenticated) {
        return NextResponse.redirect(new URL('/sign-in', req.url));
    }

    if (isPublicRoute(req) && isAuthenticated) {
        const user = await clerkClient.users.getUser(userId);
        const email = user.emailAddresses[0]?.emailAddress;

        if (!email) {
            return NextResponse.redirect(new URL('/error', req.url));
        }

        const role = await fetchUserRoleDirectly(email);

        if (role) {
            const normalizedRole = role.toLowerCase();
            let redirectUrl = '/student-dashboard'; // default

            if (normalizedRole === 'faculty') {
                redirectUrl = '/faculty-dashboard';
            } else if (normalizedRole === 'admin') {
                redirectUrl = '/admin-dashboard';
            } else if (normalizedRole === 'student') {
                redirectUrl = '/student-dashboard';
            }

            return NextResponse.redirect(new URL(redirectUrl, req.url));
        }
    }
}, { debug: false });

export const config = {
    matcher: [
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        '/(api|trpc)(.*)',
    ],
};
