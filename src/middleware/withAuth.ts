import { NextRequest, NextResponse } from "next/server";

export default function withAuthMiddleware(request: NextRequest, response: NextResponse) {
    const token = request.cookies.get("authToken")?.value;
    const isAuthenticated = !!token;

    if (isAuthenticated && (request.nextUrl.pathname === "/login" || request.nextUrl.pathname === "/register")) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    return response;
}