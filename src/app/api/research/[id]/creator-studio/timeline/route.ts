import { NextRequest, NextResponse } from "next/server";
import { ResearchEngine } from "@/features/research/research-engine";
import { CreatorStudioProvider } from "@/lib/creator/creator.provider";
import { TimelineProvider, TimelineExportOptions } from "@/lib/creator/timeline/timeline.provider";
import { CreatorProductionPreferences, DEFAULT_PRODUCTION_PREFERENCES } from "@/lib/creator/production-preferences.types";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const run = await ResearchEngine.getRunAsync(params.id);
    if (!run) {
      return NextResponse.json({ success: false, error: "Research run not found" }, { status: 404 });
    }

    const body = await req.json().catch(() => ({}));
    const options: TimelineExportOptions = {
      format: body.format === "FCPXML" ? "FCPXML" : "EDL",
      fps: Number(body.fps) || 24,
      includeSections: body.includeSections ?? true,
      includeBRoll: body.includeBRoll ?? true,
      includeBenchmarkCards: body.includeBenchmarkCards ?? true,
      includeChapters: body.includeChapters ?? true,
      includeThermals: body.includeThermals ?? true,
    };

    const preferences: CreatorProductionPreferences = {
      ...DEFAULT_PRODUCTION_PREFERENCES,
      ...(body.preferences || {}),
      generateTimelineMarkers: true,
      generateScript: options.includeSections ?? true,
      generateBRoll: options.includeBRoll ?? true,
      generateBenchmarkCards: options.includeBenchmarkCards ?? true,
      generateChapters: options.includeChapters ?? true,
    };

    const targetDuration = (body.duration === 8 || body.duration === 18) ? body.duration : (run.creatorStudio?.targetDurationMinutes || 12);
    
    // Ensure report exists with matching duration
    let report = run.creatorStudio;
    if (!report || report.targetDurationMinutes !== targetDuration) {
      report = CreatorStudioProvider.generateReport(run, targetDuration, preferences);
    }

    // Generate markers
    const markers = TimelineProvider.getMarkers(report, preferences, options.fps);
    const exportResult = TimelineProvider.exportTimeline(run.topic, markers, targetDuration, options);

    return NextResponse.json({
      success: true,
      timeline: exportResult,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
