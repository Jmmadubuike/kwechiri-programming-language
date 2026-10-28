import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const websiteRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const configuration = JSON.parse(readFileSync(resolve(websiteRoot, "vercel.json"), "utf8"));
const globalHeaders = configuration.headers?.find((entry) => entry.source === "/(.*)")?.headers ?? [];
const headerValue = (name) => globalHeaders.find((header) => header.key.toLowerCase() === name.toLowerCase())?.value;

const contentSecurityPolicy = headerValue("Content-Security-Policy");
const requiredPolicyDirectives = [
  "default-src 'self'",
  "base-uri 'self'",
  "connect-src 'self'",
  "form-action 'none'",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "script-src 'self' 'unsafe-eval'",
  "style-src 'self'",
  "worker-src 'self'",
];

if (contentSecurityPolicy === undefined) throw new Error("Missing Content-Security-Policy header.");
for (const directive of requiredPolicyDirectives) {
  if (!contentSecurityPolicy.includes(directive)) {
    throw new Error(`Content-Security-Policy is missing: ${directive}`);
  }
}

const requiredHeaders = new Map([
  ["Cross-Origin-Opener-Policy", "same-origin"],
  ["Permissions-Policy", "camera=(), geolocation=(), microphone=(), payment=(), usb=()"],
  ["Referrer-Policy", "strict-origin-when-cross-origin"],
  ["Strict-Transport-Security", "max-age=63072000; includeSubDomains"],
  ["X-Content-Type-Options", "nosniff"],
  ["X-Frame-Options", "DENY"],
]);

for (const [name, expected] of requiredHeaders) {
  if (headerValue(name) !== expected) throw new Error(`Unexpected or missing header: ${name}`);
}

const canonicalRedirect = configuration.redirects?.find((redirect) =>
  redirect.source === "/(.*)"
  && redirect.destination === "https://kwechiri.dev/$1"
  && redirect.permanent === true
  && redirect.has?.some((condition) => condition.type === "host" && condition.value === "www.kwechiri.dev"));
if (canonicalRedirect === undefined) throw new Error("Missing canonical www redirect.");

console.log("Verified production security headers and canonical redirect.");
