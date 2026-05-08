import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  const baseDir = "C:/Users/pc/.gemini/antigravity/brain/c2a70662-b3d1-4e95-961e-c2951ba9a609";

  try {
    const allFiles = fs.readdirSync(baseDir);

    // Get all .webp files with their sizes, sorted largest first (most complete recording)
    const webpFiles = allFiles
      .filter((f) => f.endsWith(".webp"))
      .map((f) => ({ name: f, size: fs.statSync(path.join(baseDir, f)).size }))
      .sort((a, b) => b.size - a.size);

    if (webpFiles.length === 0) {
      return new NextResponse("No tutorial video found", { status: 404 });
    }

    // Use the largest webp file available
    const bestFile = webpFiles[0].name;
    const fileBuffer = fs.readFileSync(path.join(baseDir, bestFile));

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": "image/webp",
        "Cache-Control": "no-cache",
        "Content-Disposition": "inline",
        "X-Tutorial-File": bestFile,
        "X-File-Size": webpFiles[0].size.toString(),
      },
    });
  } catch (err) {
    console.error("Tutorial video error:", err);
    return new NextResponse("Error loading tutorial video", { status: 500 });
  }
}
