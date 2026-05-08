import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ step: string }> }
) {
  const { step } = await params;
  
  // Try to find the image in public/tutorial/ directory
  const filePath = path.join(process.cwd(), "public", "tutorial", `${step}.png`);

  if (fs.existsSync(filePath)) {
    const buf = fs.readFileSync(filePath);
    return new NextResponse(buf, {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=3600",
      },
    });
  }

  // Fallback: If no image found, return a placeholder or 404
  return new NextResponse("Screenshot not found", { status: 404 });
}
