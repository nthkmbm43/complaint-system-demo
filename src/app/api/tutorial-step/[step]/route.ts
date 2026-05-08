import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const BRAIN_DIR = "C:/Users/pc/.gemini/antigravity/brain/c2a70662-b3d1-4e95-961e-c2951ba9a609";

const CLICK = `${BRAIN_DIR}/.system_generated/click_feedback`;

// Map of step -> candidate screenshot paths (first found wins)
const STEPS: Record<string, string[]> = {
  "landing":   [`${BRAIN_DIR}/step_1_1777722470511.png`],
  "login":     [`${BRAIN_DIR}/step_1_1777722470511.png`],
  "dashboard": [`${BRAIN_DIR}/step_2_1777722514107.png`],
  "form":      [`${BRAIN_DIR}/step_3_fixed_1777723204208.png`],
  "detail":    [`${BRAIN_DIR}/step_5_1777723307416.png`],
};

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ step: string }> }
) {
  const { step } = await params;
  const candidates = STEPS[step];

  if (!candidates) {
    return new NextResponse("Step not found", { status: 404 });
  }

  for (const p of candidates) {
    if (fs.existsSync(p)) {
      const buf = fs.readFileSync(p);
      return new NextResponse(buf, {
        status: 200,
        headers: {
          "Content-Type": "image/png",
          "Cache-Control": "public, max-age=3600",
        },
      });
    }
  }

  return new NextResponse("Screenshot not found", { status: 404 });
}
