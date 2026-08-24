const url = "http://localhost:3000/api/research";
const topic = "Samsung Galaxy S27 Ultra vs iPhone 18 Pro Max";

async function runTest() {
  console.log("Creating run...");
  const createRes = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      topic,
      objective: topic,
      contentType: "Comparison",
      targetAudience: "General Consumer",
      requestedDepth: "Standard"
    })
  });
  const createData = await createRes.json();
  console.log("Create Response:", createData);

  const runId = createData.run?.id;
  if (!runId) return;

  console.log("Executing run...");
  const execRes = await fetch(`${url}/${runId}/execute`, { method: "POST" });
  const execData = await execRes.json();
  console.log("Execute Response:", execData);

  console.log("Polling status...");
  for (let i = 0; i < 5; i++) {
    const statusRes = await fetch(`${url}/${runId}/status`);
    const statusData = await statusRes.json();
    console.log(`Status [${i}]:`, statusData.run?.status, statusData.run?.failureReason);
    await new Promise(r => setTimeout(r, 1000));
  }
}

runTest().catch(console.error);
