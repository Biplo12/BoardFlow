import {
  convexAuthNextjsMiddleware,
  createRouteMatcher,
  nextjsMiddlewareRedirect,
} from '@convex-dev/auth/nextjs/server';

const isAuthPage = createRouteMatcher(['/login', '/register']);
const isProtectedRoute = createRouteMatcher(['/dashboard(.*)', '/board(.*)']);

export default convexAuthNextjsMiddleware(async (request, { convexAuth }) => {
  if (isAuthPage(request) && (await convexAuth.isAuthenticated())) {
    return nextjsMiddlewareRedirect(request, '/dashboard');
  }

  if (isProtectedRoute(request) && !(await convexAuth.isAuthenticated())) {
    return nextjsMiddlewareRedirect(request, '/login');
  }
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
