import { NextResponse, type NextRequest } from 'next/server';

import { getUserFromSource } from './utils/getUser';

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const user = (await getUserFromSource()).result;

  if (request.nextUrl.pathname === '/auth' && user) {
    return NextResponse.redirect(new URL('/', request.url));
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
