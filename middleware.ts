import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Clone the request headers
  const requestHeaders = new Headers(request.headers)

  // Add the Supabase auth cookie to the request headers if it exists
  const supabaseCookie = request.cookies.get("sb-phenotype-store-auth-token")
  if (supabaseCookie) {
    requestHeaders.set("x-supabase-auth", supabaseCookie.value)
  }

  // Return the response with the modified headers
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}

export const config = {
  matcher: ["/api/check-admin", "/api/admin/:path*"],
}
