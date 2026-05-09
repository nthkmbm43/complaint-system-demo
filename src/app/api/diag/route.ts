import { NextResponse } from "next/server";

export async function GET() {
  const url = process.env.DATABASE_URL || "NOT_SET";
  // Mask the password for security
  const maskedUrl = url.replace(/:([^:@]+)@/, ":****@");
  
  return NextResponse.json({
    env_status: url === "NOT_SET" ? "Missing" : "Found",
    database_host: url.includes("neon.tech") ? "Neon Cloud" : "Unknown/Placeholder",
    current_url_preview: maskedUrl,
    timestamp: new Date().toISOString()
  });
}
