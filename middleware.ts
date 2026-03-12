import { NextRequest, NextResponse } from 'next/server';

const COOKIE_NAME = 'site-auth';

/** Compute HMAC-SHA256 using Web Crypto API (Edge-compatible). */
async function computeHmac(secret: string, message: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(message));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/** Timing-safe comparison for hex strings. */
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

/** Verify an HMAC-signed auth token. */
async function verifyToken(token: string): Promise<boolean> {
  const secret = process.env.SITE_PASSWORD || '';
  const expected = await computeHmac(secret, 'authenticated');
  return timingSafeEqual(token, expected);
}

/** Validate that `next` is a safe relative path (no open redirect). */
function sanitizeNext(raw: string): string {
  if (!raw || !raw.startsWith('/') || raw.startsWith('//') || raw.includes('://')) {
    return '/';
  }
  return raw;
}

export async function middleware(request: NextRequest) {
  // Skip all API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Check for auth cookie with HMAC verification
  const authCookie = request.cookies.get(COOKIE_NAME);
  if (authCookie?.value && await verifyToken(authCookie.value)) {
    return NextResponse.next();
  }

  // Redirect to login with sanitized next param
  const loginUrl = new URL('/api/auth', request.url);
  loginUrl.searchParams.set('next', sanitizeNext(request.nextUrl.pathname));
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)'],
};
