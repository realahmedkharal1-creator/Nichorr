import { ResearchEngine } from '../src/features/research/research-engine';

async function testE2E() {
  console.log('--- Starting End-to-End Pipeline Execution Verification ---');
  const engine = new ResearchEngine();
  
  const session = await engine.createRun({
    topic: "Samsung Galaxy S26 Ultra vs iPhone 17 Pro Max",
    objective: "Compare camera dynamic range, sustained thermals under 4K video, battery endurance, and real-world value.",
    contentType: "Comparison",
    targetAudience: "Tech Content Creators",
    requestedDepth: "Standard",
  });
  
  console.log(`Created Run ID: ${session.id}, Status: ${session.status}`);
  
  console.log('Executing Pipeline...');
  const completedSession = await engine.executeRun(session.id);
  
  console.log(`\nExecution Finished!`);
  console.log(`Status: ${completedSession.status}`);
  console.log(`Sources extracted: ${completedSession.sources.length}`);
  console.log(`Claims extracted: ${completedSession.claims.length}`);
  console.log(`Conflicts surfaced: ${completedSession.conflicts.length}`);
  console.log(`Community signals: ${completedSession.communitySignals.length}`);
  console.log(`Audience questions: ${completedSession.audienceQuestions.length}`);
  console.log(`Content opportunities: ${completedSession.opportunities.length}`);
  console.log(`Quality gate status: ${completedSession.qualityGateStatus}`);
  console.log(`Brief key findings: ${completedSession.brief?.key_findings?.length || 0}`);
  
  if (completedSession.status !== 'COMPLETED') {
    throw new Error(`Expected COMPLETED status but got ${completedSession.status}`);
  }
  
  console.log('\n--- Pipeline E2E Verification Succeeded 100% ---');
}

testE2E().catch((err) => {
  console.error('E2E Verification Failed:', err);
  process.exit(1);
});
