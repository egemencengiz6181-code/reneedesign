import { NextRequest, NextResponse } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { locales, localePrefix } from "./config/locales";

const intlMiddleware = createIntlMiddleware({
  defaultLocale: "tr",
  locales,
  localePrefix,
});

// ── Bot / saldırı tespiti için engellenen path kalıpları ──
const BLOCKED_PATHS = [
  "wp-",            // WordPress tarama
  "wp-admin",
  "wp-login",
  "wp-includes",
  "wp-content",
  "xmlrpc",
  ".env",           // Ortam dosyası arama
  ".git",
  ".php",           // PHP dosyası arama
  "admin",
  "phpmyadmin",
  "cgi-bin",
  "eval-stdin",
  "shell",
  "vendor",
  "telescope",
  "debug",
  "_ignition",
  "actuator",       // Spring Boot probe
  "solr",
  "config.json",
  "credentials",
  "login",
  "signin",
  "setup-config",
  "installer",
];

// ── Bilinen kötü niyetli User-Agent kalıpları ──
const BLOCKED_UA_PATTERNS = [
  /sqlmap/i,
  /nikto/i,
  /nmap/i,
  /masscan/i,
  /zgrab/i,
  /gobuster/i,
  /dirbuster/i,
  /wpscan/i,
  /nessus/i,
  /acunetix/i,
  /openvas/i,
  /python-requests/i,
  /go-http-client/i,
  /curl\//i,
  /wget\//i,
  /scrapy/i,
  /httpclient/i,
  /libwww-perl/i,
  /java\//i,
  /headlesschrome/i,
  /phantomjs/i,
  /semrush/i,
  /ahrefsbot/i,
  /mj12bot/i,
  /dotbot/i,
  /blexbot/i,
  /petalbot/i,
  /bytespider/i,
];

export function middleware(request: NextRequest): NextResponse {
  const path = request.nextUrl.pathname.toLowerCase();
  const ua = request.headers.get("user-agent") ?? "";

  // 1) Engellenen yol kalıpları — bağlantıyı hemen kopar
  if (BLOCKED_PATHS.some((p) => path.includes(p))) {
    return new NextResponse(null, { status: 444 });
  }

  // 2) Kötü niyetli User-Agent kontrolü
  if (BLOCKED_UA_PATTERNS.some((re) => re.test(ua))) {
    return new NextResponse(null, { status: 444 });
  }

  // 3) Boş User-Agent (genellikle script/bot)
  if (!ua || ua.length < 5) {
    return new NextResponse(null, { status: 403 });
  }

  // 4) Aşırı uzun URL (path traversal denemesi)
  if (path.length > 500) {
    return new NextResponse(null, { status: 414 });
  }

  // ── Meşru trafik → i18n middleware ──
  return intlMiddleware(request) as NextResponse;
}

export const config = {
  matcher: [
    /*
     * Statik dosyalar (_next/static, _next/image, favicon.ico, public assets)
     * HARİÇ her şeyi yakala — böylece bot istekleri de middleware'den geçer.
     */
    "/((?!_next/static|_next/image|favicon.ico|logos|works|sitemap.xml|robots.txt).*)",
  ],
};
