import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const publicRoutes = [
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/webhook/clerk",
  "/pages/project-mgt",
  "/api/live-courses/project-mgt/lecture"
];

const isPublicRoute = createRouteMatcher(publicRoutes);

export default clerkMiddleware((auth, req) => {
  // Set headers first
  const response = NextResponse.next();
  if (req.nextUrl.pathname.startsWith("/api/")) {
    response.headers.set("Content-Type", "application/json");
  }

  // Handle auth
  if (isPublicRoute(req)) return response;
  
  const { userId } = auth();
  if (!userId) return auth().redirectToSignIn({ returnBackUrl: req.url });

  return response;
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"]
};


// import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
// import { NextResponse } from "next/server";

// // Define public routes
// const isPublicRoute = createRouteMatcher([
//   '/',
//   '/sign-in(.*)',
//   '/sign-up(.*)',
//   // Add other public routes as needed
// ]);

// export default clerkMiddleware((auth, req) => {
//   // 1. Handle public routes
//   if (isPublicRoute(req)) {
//     return NextResponse.next();
//   }

//   // 2. Protect non-public routes
//   const { userId } = auth();
  
//   // 3. If not authenticated and trying to access protected route, redirect
//   if (!userId) {
//     return auth().redirectToSignIn({ returnBackUrl: req.url });
//   }

//   // 4. Allow authenticated users to proceed
//   return NextResponse.next();
// });

// export const config = {
//   matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
// };