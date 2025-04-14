import { authMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your middleware
export default authMiddleware({
  publicRoutes: [
    "/",
    "/about",
    "/api/webhooks(.*)",
    "/sign-in(.*)",
    "/sign-up(.*)",
    "/api/webhook/clerk",
    "/pages/project-mgt",
    "/api/live-courses/project-mgt/lecture",
    "/api/live-courses/project-mgt/checkout",
    "/api/test-clerk-admin",
    "/api/auth/check-admin",
    "/checkout/project-mgt",
    "/pages/frontend",
    "/pages/fullstack",
    "/pages/ai-ml",
    "/pages/cybersecurity",
    "/pages/data-science",
    "/pages/graphic-design",
    "/pages/ui-ux",
    "/pages/digital-marketing",
    "/pages/software-devt",
    "/pages/careers",
    "/pages/mathematics-jss",
    "/pages/services",
    "/api/nofilesubmit-form",
    "/api/live-courses/(.*)",
    "/api/chatbot",
  ],
  async afterAuth(auth: { isPublicRoute: boolean; userId: string | null }, req: NextRequest) {
    // Handle public routes
    if (auth.isPublicRoute) {
      return NextResponse.next();
    }

    // Handle unauthenticated users
    if (!auth.userId) {
      const signInUrl = new URL("/sign-in", req.url);
      signInUrl.searchParams.set("redirect_url", req.url);
      return NextResponse.redirect(signInUrl);
    }

    // For all routes, just proceed
    // Admin access will be checked by the AdminCheck component
    return NextResponse.next();
  }
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}; 