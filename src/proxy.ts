import { NextResponse, type NextRequest } from "next/server";

/**
 * CORS pour l'API FlambHub.
 * Permet notamment à l'extension Chrome (origine chrome-extension://…)
 * d'appeler l'API depuis n'importe quelle page (ex : un casino).
 * L'app est publique en V1 : aucune session/cookie ne transite par l'API.
 */
function corsHeaders(): Record<string, string> {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,PATCH,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, x-admin-token, x-flamb-code",
    "Access-Control-Max-Age": "86400",
  };
}

export function proxy(request: NextRequest) {
  if (request.method === "OPTIONS") {
    return new NextResponse(null, { status: 204, headers: corsHeaders() });
  }
  const response = NextResponse.next();
  for (const [key, value] of Object.entries(corsHeaders())) {
    response.headers.set(key, value);
  }
  return response;
}

export const config = {
  matcher: "/api/:path*",
};
