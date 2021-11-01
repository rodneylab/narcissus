import Base64 from 'crypto-js/enc-base64.js';
import sha256 from 'crypto-js/sha256.js';
import { config } from 'dotenv';
import fs from 'fs';
import { parse } from 'node-html-parser';
import path from 'path';

config();

const __dirname = path.resolve();
const rootDomain = process.env.VITE_DOMAIN;

const buildDir = path.join(__dirname, 'build');
const buildPathLength = path.dirname(buildDir).length + path.basename(buildDir).length + 1;

let pageCspElements = [];
function findHtmlFiles(startPath, filter = /\.html$/) {
  if (!fs.existsSync(startPath)) {
    console.log(`Missing file: ${startPath}`);
    return;
  }
  const files = fs.readdirSync(startPath);
  files.forEach((element) => {
    const filename = path.join(startPath, element);
    const stat = fs.lstatSync(filename);
    if (stat.isDirectory()) {
      findHtmlFiles(filename, filter);
    } else if (filter.test(filename)) {
      const route = path.dirname(filename).slice(buildPathLength);
      pageCspElements.push(`${route[0] === '/' ? route : `/${route}`}
  Content-Security-Policy-Report-Only: base-uri 'self'; child-src 'self';  connect-src 'self' ws://${
    process.env.VITE_DOMAIN
  } https://hcaptcha.com https://*.hcaptcha.com ${
        process.env.VITE_WORKER_URL
      }; img-src 'self' data\:; font-src 'self' data\:; form-action 'self'; frame-ancestors 'self'; frame-src 'self' https://hcaptcha.com https://*.hcaptcha.com; manifest-src 'self'; media-src 'self' data:; object-src 'none'; script-src 'self' 'unsafe-inline' https://hcaptcha.com https://*.hcaptcha.com; worker-src 'self'; report-to csp-endpoint; report-uri https://sentry.io/api/${
        process.env.SENTRY_PROJECT_ID
      }/security/?sentry_key=${process.env.SENTRY_KEY};`);
    }
  });
}

const htmlSourceFile = path.join(__dirname, 'build/index.html');
const htmlSource = fs.readFileSync(htmlSourceFile, { encoding: 'utf-8' });
const root = parse(htmlSource);
let styleSrcAttrHashes = new Set();

const styleAttributesTags = ['div', 'g', 'img', 'span', 'svg'];
styleAttributesTags.forEach((tag) => {
  root.getElementsByTagName(tag).forEach((element) => {
    if (element.hasAttribute('style')) {
      const hash = sha256(element.getAttribute('style'));
      styleSrcAttrHashes.add(hash.toString(Base64));
    }
  });
});

const styleSrcAttrCsp = [...styleSrcAttrHashes].map((element) => `'sha-256-${element}'`).join(' ');

function createHeaders() {
  const headers = `/*
  X-Frame-Options: DENY
  X-XSS-Protection: 1; mode=block
  X-Content-Type-Options: nosniff
  Referrer-Policy: same-origin
  Permissions-Policy: accelerometer=(), autoplay=(), camera=(), document-domain=(), encrypted-media=(), fullscreen=(), gyroscope=(), interest-cohort=(), magnetometer=(), microphone=(), midi=(), payment=(), picture-in-picture=(), publickey-credentials-get=(), sync-xhr=(), usb=(), xr-spatial-tracking=(), geolocation=()
  Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
  Report-To: {"group": "csp-endpoint", "max_age": 10886400, "endpoints": [{"url": "https://sentry.io/api/${
    process.env.SENTRY_PROJECT_ID
  }/security/?sentry_key=${process.env.SENTRY_KEY}"}]}
${pageCspElements.join('\n')}
`;

  const headersFile = path.join(buildDir, '_headers');
  console.log('headers: ', headers);
  fs.writeFileSync(headersFile, headers);
}

async function main() {
  findHtmlFiles(buildDir);
  console.log(pageCspElements);
  createHeaders();
  console.log(pageCspElements);
}

main();

// #Content-Security-Policy-Report-Only: base-uri 'self'; child-src 'self'; connect-src 'self' ws://${
//     process.env.VITE_DOMAIN
//   } https://hcaptcha.com https://*.hcaptcha.com ${
//     process.env.VITE_WORKER_URL
//   }; img-src 'self' data\:; font-src 'self' data\:; form-action 'self'; frame-ancestors 'self'; frame-src 'self' https://hcaptcha.com https://*.hcaptcha.com; manifest-src 'self'; media-src 'self' data\:; object-src 'none'; style-src 'self' 'unsafe-hashes' ${styleSrcAttrCsp} https://hcaptcha.com https://*.hcaptcha.com; default-src 'self' ${rootDomain} ws://${rootDomain}; script-src 'self' 'unsafe-inline' https://hcaptcha.com https://*.hcaptcha.com; worker-src 'self'; report-to csp-endpoint; report-uri https://sentry.io/api/${
//     process.env.SENTRY_PROJECT_ID
//   }/security/?sentry_key=${process.env.SENTRY_KEY};
//   Content-Security-Policy-Report-Only: default-src 'none';
