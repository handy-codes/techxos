import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Define public routes
const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  // Add other public routes as needed
]);

export default clerkMiddleware((auth, req) => {
  // 1. Handle public routes
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  // 2. Protect non-public routes
  const { userId } = auth();
  
  // 3. If not authenticated and trying to access protected route, redirect
  if (!userId) {
    return auth().redirectToSignIn({ returnBackUrl: req.url });
  }

  // 4. Allow authenticated users to proceed
  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};