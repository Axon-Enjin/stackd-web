# Chapter 5 — PWA Setup & Configuration

This document outlines how the Progressive Web App (PWA) functionality is implemented in the Stackd web application using [Serwist](https://serwist.pages.dev/).

---

## Overview

The PWA setup allows users to "install" the Stackd website onto their devices (mobile and desktop) resulting in a native app-like experience. This is achieved through three primary components:
1. **App Icons & Manifest**: The visual identity of the app when installed.
2. **Service Worker**: A background script that handles caching and offline capabilities.
3. **Next.js Integration**: Build-time configuration to generate the final service worker file.

---

## 1. App Icons & Manifest

Next.js automatically handles metadata and manifest linking when files are placed in the correct directories.

- **`public/site.webmanifest`**: Defines the app name, theme colors, and icons for the PWA.
- **`src/app/icon.png`, `src/app/icon.svg`, `src/app/apple-icon.png`**: Auto-discovered by Next.js to inject `<link rel="icon">` and Apple touch icons into the HTML head.
- **`public/web-app-manifest-*.png`**: The specific sizes (192x192, 512x512) referenced within the `site.webmanifest`.

### Theme Color
In `src/app/layout.tsx`, the `viewport` object exports the `themeColor` which styles the browser address bar and PWA title bar:

```tsx
export const viewport: Viewport = {
  themeColor: "#0B1F3B",
};
```

---

## 2. Service Worker (`src/app/sw.ts`)

We use **Serwist** to generate our service worker. The source file is located at `src/app/sw.ts`.

```typescript
import { defaultCache } from "@serwist/next/worker";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { Serwist } from "serwist";

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: defaultCache,
});

serwist.addEventListeners();
```

During the build process, Serwist reads this file, injects the list of cached assets into `self.__SW_MANIFEST`, and outputs the final compiled service worker to `public/sw.js`.

---

## 3. Configuration & Build Pipeline

### `next.config.ts`

The Next.js config is wrapped with `withSerwistInit` to enable the webpack plugin that compiles the service worker:

```typescript
import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
  swSrc: "src/app/sw.ts",
  swDest: "public/sw.js",
  disable: process.env.NODE_ENV === "development", // Disable SW in dev to prevent caching issues
});

export default withSerwist(nextConfig);
```

### `tsconfig.json`

To prevent TypeScript errors in the service worker and ignore the compiled output, the following additions are required in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "esnext", "webworker"], // Added "webworker" for ServiceWorkerGlobalScope
    "types": ["@serwist/next/typings"], // Provide Serwist global types
    // ...
  },
  "exclude": ["node_modules", "public/sw.js"] // Ignore the compiled output
}
```

### `package.json` Build Script Constraint

**CRITICAL NOTE**: Next.js 15+ defaults to **Turbopack** for builds, but `@serwist/next` currently relies on **Webpack** plugins. To ensure the PWA builds correctly in production, we must explicitly force Next.js to use Webpack during the build step.

```json
"scripts": {
  "build": "next build --webpack"
}
```

If you see an error like `This build is using Turbopack, with a webpack config and no turbopack config`, it means `--webpack` is missing from the build command.

---

## 4. Testing the PWA

To test the PWA features:
1. Run a production build: `pnpm build && pnpm start`
2. Open the site in Chrome.
3. You should see an **"Install Stackd"** icon appear on the right side of the address bar.
4. Open Chrome DevTools -> **Application** tab -> **Service Workers** to verify `sw.js` is registered and running.
