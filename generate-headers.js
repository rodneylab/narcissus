import { config } from 'dotenv';
import fs from 'fs';
import path from 'path';

config();
const rootDomain = process.env.VITE_DOMAIN;

const headers = `/*
  X-Frame-Options: DENY
  X-XSS-Protection: 1; mode=block
  X-Content-Type-Options: nosniff
  Referrer-Policy: same-origin
  Permissions-Policy: accelerometer=(), autoplay=(), camera=(), document-domain=(), encrypted-media=(), fullscreen=(), gyroscope=(), interest-cohort=(), magnetometer=(), microphone=(), midi=(), payment=(), picture-in-picture=(), publickey-credentials-get=(), sync-xhr=(), usb=(), xr-spatial-tracking=(), geolocation=()
  Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
  Content-Security-Policy: base-uri 'self'; child-src 'self'; connect-src 'self' ws://${process.env.VITE_DOMAIN} https://hcaptcha.com https://*.hcaptcha.com ${process.env.VITE_WORKER_URL}; img-src 'self' data:; font-src 'self' data:; form-action 'self'; frame-ancestors 'self'; frame-src 'self' https://hcaptcha.com https://*.hcaptcha.com; manifest-src 'self'; media-src 'self' data:; object-src 'none'; style-src 'self' 'unsafe-inline' https://hcaptcha.com https://*.hcaptcha.com; default-src 'self' ${rootDomain} ws://${rootDomain}; script-src 'self' 'unsafe-inline' https://hcaptcha.com https://*.hcaptcha.com; worker-src 'self'; report-to csp-endpoint; report-uri https://sentry.io/api/${process.env.SENTRY_PROJECT_ID}/security/?sentry_key=${process.env.SENTRY_KEY};
  Report-To: {"group": "csp-endpoint", "max_age": 10886400, "endpoints": [{"url": "https://sentry.io/api/${process.env.SENTRY_PROJECT_ID}/security/?sentry_key=${process.env.SENTRY_KEY}"}]}
`;

const __dirname = path.resolve();
const headersFile = path.join(__dirname, 'build/_headers');

fs.writeFileSync(headersFile, headers);
