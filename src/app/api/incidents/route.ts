import { NextResponse } from "next/server";
import { IncidentsRepository } from "@/lib/database/repositories/incidents.repo";

export async function GET() {
  try {
    const repo = new IncidentsRepository();
    const incidents = await repo.getIncidents();
    return NextResponse.json({ success: true, incidents });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
