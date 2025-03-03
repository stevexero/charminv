import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// const isPublicRoute = createRouteMatcher(['/sign-in(.*)']);
const isPublicRoute = createRouteMatcher(['/(.*)']);

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    '/((?!_next|.*\\.(?:html?|css|js|jpg|png|gif|svg)).*)',
    '/(api|trpc)(.*)',
  ],
};
