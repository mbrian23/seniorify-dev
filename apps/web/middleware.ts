import { NextResponse, type NextRequest } from "next/server";

const DECK_HOST = "deck.seniorify.dev";
const PRIMARY_HOST = "seniorify.dev";

export function middleware(request: NextRequest) {
  const host = request.headers.get("host")?.toLowerCase() ?? "";
  if (host !== DECK_HOST) return NextResponse.next();

  const url = request.nextUrl.clone();
  const path = url.pathname;

  // deck.seniorify.dev/ and /deck -> serve the deck page (rewrite, keep host)
  if (path === "/" || path === "/deck") {
    url.pathname = "/deck";
    return NextResponse.rewrite(url);
  }

  // Anything else on the deck subdomain -> bounce to the primary domain
  const target = new URL(path + url.search, `https://${PRIMARY_HOST}`);
  return NextResponse.redirect(target, 308);
}

export const config = {
  matcher: ["/((?!_next/|api/|.*\\..*).*)"],
};
