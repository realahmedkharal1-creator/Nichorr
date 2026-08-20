import { NextResponse } from "next/server";
import { EpistemicContractFormatter } from "@/lib/developer/epistemic-contract-formatter";

export async function GET(req: Request) {
  try {
    const graphData = {
      nodes: [
        { id: "ent-1", label: "Gemini 1.5 Flash", type: "MODEL" },
        { id: "ent-2", label: "Sub-path Distillation", type: "TECHNIQUE" },
      ],
      edges: [
        { source: "ent-1", target: "ent-2", relationship: "UTILIZES", confidence: 99.0 },
      ],
    };

    const response = EpistemicContractFormatter.formatResponse(graphData, `req_graph_${Date.now()}`, "SUPPORTED");
    return NextResponse.json(response);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
