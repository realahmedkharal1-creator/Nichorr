import { ResearchEngine } from "./src/features/research/research-engine";

async function run() {
  try {
    const engine = new ResearchEngine();
    const session = await engine.createRun({
      topic: "Samsung Galaxy S26 Ultra vs iPhone 18 Pro Max",
      objective: "Comparison",
    });
    console.log("Created Run:", session.id);

    const result = await engine.executeRun(session.id);
    console.log("Run completed with status:", result.status);
    console.log(result.failureReason || "Success");
  } catch (e) {
    console.error("Execution error:", e);
  }
}

run();
