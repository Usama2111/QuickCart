import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
  matcher: [
    // Protect all routes except static files and Next.js internals
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:html|css|js|jpg|jpeg|webp|png|gif|svg|ttf|woff|woff2|ico|csv|docx|xlsx|zip|webmanifest)).*)',
    // Ensure API routes are always checked by Clerk
    '/(api|trpc)(.*)',
  ],
};
