import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your middleware
const publicRoutes = [
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/webhook/clerk",
  "/pages/project-mgt",
  "/api/live-courses/project-mgt/lecture",
  "/api/live-courses/project-mgt/checkout",
  "/api/test-clerk-admin"
];

const adminRoutes = [
  "/admin(.*)",
  "/pages/admin(.*)",
  "/api/admin(.*)"
];

const isPublicRoute = createRouteMatcher(publicRoutes);
const isAdminRoute = createRouteMatcher(adminRoutes);

// Add configuration to handle clock skew
const clerkConfig = {
  // Allow a 5-minute clock skew to handle system time discrepancies
  clockSkewInMs: 5 * 60 * 1000,
};

export default clerkMiddleware((auth, req) => {
  // Handle public routes
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  // Protect non-public routes
  const { userId } = auth();
  
  // If not authenticated and trying to access protected route, redirect
  if (!userId) {
    return auth().redirectToSignIn({ returnBackUrl: req.url });
  }

  // For admin routes, let the API route handle authorization
  // This removes the Prisma dependency in the middleware
  
  // Allow authenticated users to proceed
  return NextResponse.next();
}, clerkConfig);

export const config = {
  matcher: [
    "/((?!.*\\..*|_next).*)",
    "/",
    "/(api|trpc)(.*)"
  ]
};