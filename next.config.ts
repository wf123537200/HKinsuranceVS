import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  // `standalone` bundles only the node_modules that the app actually uses
  // into `.next/standalone/`. The server then only needs that directory
  // + `public/` + `.next/static/` to run `node server.js` — no `npm ci`
  // required on the 1.9GiB VPS. This is the single biggest OOM lever:
  // before this, every deploy ran `npm ci --production=false` (573
  // packages) on the production server, which peaked RAM well past
  // what was available alongside aitools4me.
  //
  // We also explicitly trace the Prisma client files (and its native
  // query engine binary) because standalone's default file tracer
  // doesn't follow `@prisma/client` -> `app/generated/prisma` (the
  // generated client lives outside `node_modules/@prisma/`).
  output: "standalone",
  outputFileTracingIncludes: {
    "**": [
      "./prisma/**/*",
      "./app/generated/prisma/**/*",
      "./node_modules/@prisma/**/*",
      "./node_modules/.prisma/**/*",
    ],
  },
};

export default withNextIntl(nextConfig);
