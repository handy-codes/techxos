import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// 1. Define ALL public routes (expand this list as needed)
const isPublicRoute = createRouteMatcher([
  '/',                             // Homepage
  '/sign-in(.*)',                  // All sign-in variations
  '/sign-up(.*)',                  // All sign-up variations
  '/about',                        // Public about page
  '/courses',                      // Public course listings
  '/pages/careers',                      // Pricing page
  '/pages/frontend',                      // Pricing page
  '/pages/fullstack',                      // Pricing page
  '/pages/data-science',                      // Pricing page
  '/pages/ai-ml',                      // Pricing page
  '/pages/software-devt',                      // Pricing page
  '/pages/digital-marketing',                      // Pricing page
  '/pages/ui-ux',                      // Pricing page
  '/pages/services',                      // Pricing page
  '/pages/careers',                      // Pricing page
  '/pages/cybersecurity',                      // Pricing page
  '/pages/graphic-design',                      // Pricing page
  '/pages/project-mgt',                      // Pricing page
  '/blog(.*)',                     // Blog routes
  '/contact',                      // Contact form
  '/api/trpc(.*)',                 // tRPC endpoints (adjust if needed)
  '/terms-of-service',             // Legal pages
  '/privacy-policy'                // Legal pages
]);

export default clerkMiddleware(async (auth, req) => {
  // 2. Immediately allow public routes
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  // 3. Protect non-public routes with Clerk's built-in handler
  const { userId } = auth();
  
  // 4. If not authenticated and trying to access protected route, redirect
  if (!userId) {
    return auth().redirectToSignIn({ returnBackUrl: req.url });
  }

  // 5. Allow authenticated users to proceed
  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
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