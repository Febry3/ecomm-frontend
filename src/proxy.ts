import { NextRequest, NextResponse } from "next/server";
import withLoggingMiddleware from "./middleware/withLogging";
import withAuthMiddleware from "./middleware/withAuth";

function chainMiddleware(functions: ((request: NextRequest, response: NextResponse) => NextResponse)[]) {
    return (request: NextRequest) => {
        let response = NextResponse.next();
        for (const fn of functions) {
            response = fn(request, response);
        }
        return response;
    }
}

export const proxy = (request: NextRequest) => chainMiddleware([
    withLoggingMiddleware,
    withAuthMiddleware
])(request);

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
}
