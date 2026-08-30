import { NextRequest, NextResponse } from "next/server";
import { ResearchEngine } from "@/features/research/research-engine";
import { ProductionMatrixProvider } from "@/lib/creator/production-matrix/production-matrix.provider";
import { ProductionVariantType } from "@/lib/creator/production-matrix/production-matrix.types";

const EVIDENCE_SNAPSHOT_HASH = "snap-evidence-default";

const VALID_TYPES: ProductionVariantType[] = [
  "YOUTUBE_LONG_FORM",
  "YOUTUBE_SHORT",
  "PODCAST",
  "CUSTOM_CREATOR_VARIANT",
];

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const run = await ResearchEngine.getRunAsync(params.id);
    if (!run) {
      return NextResponse.json({ success: false, error: "Research run not found" }, { status: 404 });
    }

    const body = await req.json().catch(() => ({}));
    const name = String(body.name || "").trim();
    const variantType: ProductionVariantType = VALID_TYPES.includes(body.variantType)
      ? body.variantType
      : "YOUTUBE_LONG_FORM";
    const targetDurationMinutes = Math.max(1, Math.min(240, Number(body.targetDurationMinutes) || 10));

    if (!name) {
      return NextResponse.json({ success: false, error: "Variant name is required." }, { status: 400 });
    }

    const userId = req.headers.get("x-user-id") || "anonymous-creator";
    const variant = ProductionMatrixProvider.createVariant(
      userId,
      run.id,
      name,
      variantType,
      targetDurationMinutes,
      EVIDENCE_SNAPSHOT_HASH
    );

    return NextResponse.json({ success: true, variant });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to create production variant" },
      { status: 500 }
    );
  }
}
