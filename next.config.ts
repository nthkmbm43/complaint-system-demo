import type { NextConfig } from "next";
import fs from "fs";
import path from "path";

try {
  const middlewarePath = path.join(process.cwd(), 'src', 'middleware.ts');
  if (fs.existsSync(middlewarePath)) {
    fs.unlinkSync(middlewarePath);
    console.log('✅ Auto-deleted src/middleware.ts to fix Next.js proxy conflict.');
  }
} catch (e) {
  // ignore
}

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
