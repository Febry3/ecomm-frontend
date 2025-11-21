import { NextResponse, NextRequest } from 'next/server';

export default function withLoggingMiddleware(request: NextRequest, response: NextResponse) {
    console.log('Logging: Request received for', request.nextUrl.pathname);
    return response;
}