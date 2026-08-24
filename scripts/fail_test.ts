import { ResearchEngine } from '../src/features/research/research-engine';

process.env.SERPAPI_API_KEY = "bad-key";

async function testFailure() {
  console.log('--- Starting Failure Simulation ---');
  const engine = new ResearchEngine();
  
  const session = await engine.createRun({
    topic: "Should fail topics",
    objective: "Testing honest failures",
    contentType: "Comparison",
    targetAudience: "Test",
    requestedDepth: "Standard",
  });
  
  console.log(`Created Run ID: ${session.id}`);
  
  console.log('Executing Pipeline with bad search key...');
  const completedSession = await engine.executeRun(session.id);
  
  console.log(`\nExecution Finished!`);
  console.log(`Status: ${completedSession.status}`);
  console.log(`Failure Reason: ${completedSession.failureReason}`);
  console.log(`Sources: ${completedSession.sources.length}`);
}

testFailure().catch((err) => {
  console.error('Test Failed:', err);
  process.exit(1);
});
