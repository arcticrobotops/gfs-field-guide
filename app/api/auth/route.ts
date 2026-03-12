import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const COOKIE_NAME = 'site-auth';

// --- In-memory rate limiter (per-IP, max 5 attempts per 60 seconds) ---
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 60 * 1000;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  entry.count++;
  return entry.count > RATE_LIMIT_MAX;
}

/** Require an environment variable to be set; throw if missing. */
function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} environment variable is required`);
  }
  return value;
}

/** Validate that `next` is a safe relative path (no open redirect). */
function sanitizeNext(raw: string): string {
  if (!raw || !raw.startsWith('/') || raw.startsWith('//') || raw.includes('://')) {
    return '/';
  }
  return raw;
}

/**
 * Create an HMAC-signed auth token with a timestamp payload.
 *
 * NOTE: This uses Node.js `crypto` because the auth route runs in the
 * Node.js runtime. The middleware uses Web Crypto API instead because
 * it runs in the Edge runtime. Both produce compatible HMAC-SHA256
 * tokens with the same secret and payload format.
 */
function signToken(): string {
  const secret = requireEnv('SITE_PASSWORD');
  const timestamp = Date.now().toString(36);
  const payload = `authenticated|${timestamp}`;
  const hmac = crypto.createHmac('sha256', secret).update(payload).digest('hex');
  return `${hmac}.${timestamp}`;
}

/** Verify an HMAC-signed auth token. */
export function verifyToken(token: string): boolean {
  const secret = requireEnv('SITE_PASSWORD');
  const parts = token.split('.');
  if (parts.length !== 2) return false;
  const [hmac, timestamp] = parts;
  const payload = `authenticated|${timestamp}`;
  const expected = crypto.createHmac('sha256', secret).update(payload).digest('hex');
  if (hmac.length !== expected.length) return false;
  const isValid = crypto.timingSafeEqual(Buffer.from(hmac), Buffer.from(expected));
  if (!isValid) return false;

  // Reject tokens older than 30 days
  const tokenTime = parseInt(timestamp, 36);
  const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;
  if (isNaN(tokenTime) || Date.now() - tokenTime > thirtyDaysMs) {
    return false;
  }

  return true;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export async function GET(request: NextRequest) {
  const rawNext = request.nextUrl.searchParams.get('next') || '/';
  const next = sanitizeNext(rawNext);
  return new NextResponse(loginHTML(next), {
    headers: { 'Content-Type': 'text/html' },
  });
}

export async function POST(request: NextRequest) {
  try {
    // --- Rate limiting by IP ---
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    if (isRateLimited(ip)) {
      return new NextResponse(
        loginHTML('/', 'Too many attempts. Please try again later.'),
        {
          status: 429,
          headers: { 'Content-Type': 'text/html' },
        }
      );
    }

    // --- CSRF: Origin / Referer validation ---
    const origin = request.headers.get('origin');
    const requestHost = request.headers.get('host');
    if (origin) {
      const originHost = new URL(origin).host;
      if (originHost !== requestHost) {
        return new NextResponse(
          JSON.stringify({ error: 'Forbidden: origin mismatch' }),
          { status: 403, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }

    const formData = await request.formData();
    const password = formData.get('password') as string;
    const rawNext = formData.get('next') as string || '/';
    const next = sanitizeNext(rawNext);

    // Timing-safe password comparison
    const expected = requireEnv('SITE_PASSWORD');
    const pwBuffer = Buffer.from(password || '');
    const expectedBuffer = Buffer.from(expected);
    const lengthMatch = pwBuffer.length === expectedBuffer.length;
    const safePassword = lengthMatch ? pwBuffer : Buffer.alloc(expectedBuffer.length);
    const isValid = crypto.timingSafeEqual(safePassword, expectedBuffer) && lengthMatch;

    if (isValid) {
      const response = NextResponse.redirect(new URL(next, request.url));
      response.cookies.set(COOKIE_NAME, signToken(), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30,
      });
      return response;
    }

    return new NextResponse(loginHTML(next, 'Incorrect password'), {
      status: 401,
      headers: { 'Content-Type': 'text/html' },
    });
  } catch {
    return new NextResponse(loginHTML('/', 'Something went wrong'), {
      status: 500,
      headers: { 'Content-Type': 'text/html' },
    });
  }
}

function loginHTML(next: string, error?: string) {
  const safeNext = escapeHtml(next);
  const safeError = error ? escapeHtml(error) : '';
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Ghost Forest Surf Club</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #1a1a1a;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      color: #e5e5e5;
    }
    .container {
      text-align: center;
      padding: 2rem;
      max-width: 360px;
      width: 100%;
    }
    .brand {
      font-size: 11px;
      letter-spacing: 0.3em;
      text-transform: uppercase;
      color: #666;
      margin-bottom: 2rem;
    }
    h1 {
      font-size: 1.5rem;
      font-weight: 300;
      margin-bottom: 2rem;
      color: #ccc;
    }
    form { display: flex; flex-direction: column; gap: 1rem; }
    input[type="password"] {
      padding: 12px 16px;
      background: #2a2a2a;
      border: 1px solid #333;
      border-radius: 6px;
      color: #e5e5e5;
      font-size: 14px;
      text-align: center;
      outline: none;
      transition: border-color 0.2s;
    }
    input[type="password"]:focus { border-color: #555; }
    button {
      padding: 12px 16px;
      background: #333;
      border: 1px solid #444;
      border-radius: 6px;
      color: #e5e5e5;
      font-size: 13px;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      cursor: pointer;
      transition: background 0.2s;
    }
    button:hover { background: #444; }
    .error {
      color: #e57373;
      font-size: 13px;
      margin-bottom: 0.5rem;
    }
    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border-width: 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <p class="brand">Ghost Forest Surf Club</p>
    <h1>Enter Password</h1>
    ${safeError ? `<p class="error" role="alert">${safeError}</p>` : ''}
    <form method="POST" action="/api/auth">
      <input type="hidden" name="next" value="${safeNext}" />
      <label for="password" class="sr-only">Password</label>
      <input type="password" id="password" name="password" placeholder="Password" autofocus required />
      <button type="submit">Enter</button>
    </form>
  </div>
</body>
</html>`;
}
