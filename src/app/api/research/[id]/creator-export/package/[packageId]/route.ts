import { NextRequest, NextResponse } from "next/server";
import { ResearchEngine } from "@/features/research/research-engine";
import { CreatorExportProvider } from "@/lib/creator/export/creator-export.provider";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string; packageId: string } }
) {
  try {
    const run = await ResearchEngine.getRunAsync(params.id);
    if (!run) {
      return NextResponse.json({ success: false, error: "Research run not found" }, { status: 404 });
    }

    const userId = req.headers.get("x-user-id") || "anonymous-creator";
    const pkg = CreatorExportProvider.getExportPackage(run.id, userId);

    if (pkg.packageId !== params.packageId) {
      return NextResponse.json({ success: false, error: "Export package not found." }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      package: pkg,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || "Failed to load package" }, { status: 500 });
  }
}
