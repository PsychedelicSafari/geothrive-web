import path from 'node:path';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Pin the Turbopack root to this directory so Next.js does not walk up the
  // tree looking for a workspace lockfile. Without this the build can OOM when
  // lockfiles exist above the app (the defrag setup gotcha).
  turbopack: {
    root: path.join(__dirname),
  },
  // Avoid workspace-root inference for output file tracing for the same reason.
  outputFileTracingRoot: path.join(__dirname),
};

export default nextConfig;
