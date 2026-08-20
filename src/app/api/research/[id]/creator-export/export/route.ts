import { NextRequest, NextResponse } from "next/server";
import { ResearchEngine } from "@/features/research/research-engine";
import { CreatorExportProvider } from "@/lib/creator/export/creator-export.provider";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const run = await ResearchEngine.getRunAsync(params.id);
    if (!run) {
      return NextResponse.json({ success: false, error: "Research run not found" }, { status: 404 });
    }

    const userId = req.headers.get("x-user-id") || "anonymous-creator";
    const body = await req.json().catch(() => ({}));
    const pkg = CreatorExportProvider.getExportPackage(run.id, userId);

    const result = CreatorExportProvider.exportPackage(body.packageId || pkg.packageId, run.id, userId);

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      package: result.package,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || "Failed to execute export" }, { status: 500 });
  }
}
