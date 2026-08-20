const test = require("node:test");
const assert = require("node:assert");
const { spawn } = require("node:child_process");

const PORT = 3001; // Run on a different port to avoid conflicts
const BASE_URL = `http://localhost:${PORT}`;

let serverProcess;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

test.before(async () => {
  console.log("Starting Next.js server for smoke tests...");
  serverProcess = spawn("npm", ["run", "dev", "--", "-p", PORT.toString()], {
    stdio: "pipe",
    shell: true,
  });

  let isReady = false;
  
  // Poll until server is responding
  for (let i = 0; i < 30; i++) {
    try {
      const res = await fetch(BASE_URL);
      if (res.status === 200 || res.status === 404) {
        isReady = true;
        break;
      }
    } catch (e) {
      // Ignore
    }
    await sleep(1000);
  }

  if (!isReady) {
    throw new Error("Server failed to start in time");
  }
  
  console.log("Server is ready, starting tests.");
});

test.after(() => {
  if (serverProcess && serverProcess.pid) {
    console.log("Shutting down server...");
    try {
      if (process.platform === "win32") {
        const { execSync } = require("node:child_process");
        execSync(`taskkill /pid ${serverProcess.pid} /f /t`, { stdio: "ignore" });
      } else {
        serverProcess.kill("SIGTERM");
      }
    } catch (e) {
      serverProcess.kill("SIGTERM");
    }
  }
});

// Route 1: /api/v1/research (POST)
test('POST /api/v1/research - Valid Payload', async () => {
  const res = await fetch(`${BASE_URL}/api/v1/research`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer demo-api-key"
    },
    body: JSON.stringify({
      topic: "Apple M4 Analysis",
      objective: "Analyze thermal efficiency",
    })
  });
  
  const data = await res.json();
  assert.strictEqual(res.status, 201);
  assert.strictEqual(data.success, true);
  assert.ok(data.data.id);
});

test('POST /api/v1/research - Invalid Payload (Missing topic)', async () => {
  const res = await fetch(`${BASE_URL}/api/v1/research`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer demo-api-key"
    },
    body: JSON.stringify({}) // Missing topic
  });
  
  const data = await res.json();
  assert.strictEqual(res.status, 400);
  assert.strictEqual(data.success, false);
});

// Route 2: /api/v1/knowledge/answer (POST)
test('POST /api/v1/knowledge/answer - Valid Payload', async () => {
  const res = await fetch(`${BASE_URL}/api/v1/knowledge/answer`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: "What is sub-path distillation?"
    })
  });
  
  const data = await res.json();
  assert.strictEqual(res.status, 200);
  assert.ok(data.meta.certainty);
});

test('POST /api/v1/knowledge/answer - Invalid Payload (Missing query)', async () => {
  const res = await fetch(`${BASE_URL}/api/v1/knowledge/answer`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({})
  });
  
  const data = await res.json();
  assert.strictEqual(res.status, 400);
  assert.strictEqual(data.success, false);
});

// Route 3: /api/v1/knowledge/search (GET)
test('GET /api/v1/knowledge/search - Valid Payload', async () => {
  const res = await fetch(`${BASE_URL}/api/v1/knowledge/search?q=latency`, {
    method: "GET"
  });
  
  const data = await res.json();
  assert.strictEqual(res.status, 200);
  assert.ok(data.meta.certainty);
});

test('GET /api/v1/knowledge/search - Invalid Payload (Missing q)', async () => {
  const res = await fetch(`${BASE_URL}/api/v1/knowledge/search`, {
    method: "GET"
  });
  
  const data = await res.json();
  assert.strictEqual(res.status, 400);
  assert.strictEqual(data.success, false);
});

// Route 4: /api/v1/usage (GET)
test('GET /api/v1/usage - Valid Request', async () => {
  const res = await fetch(`${BASE_URL}/api/v1/usage`, {
    method: "GET",
    headers: {
      "Authorization": "Bearer demo-api-key"
    }
  });
  
  const data = await res.json();
  assert.strictEqual(res.status, 200);
  assert.strictEqual(data.success, true);
});

// Route 5: /api/webhooks (POST)
test('POST /api/webhooks - Valid Payload', async () => {
  const res = await fetch(`${BASE_URL}/api/webhooks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      url: "https://example.com/webhook",
      events: ["research.completed"]
    })
  });
  
  const data = await res.json();
  assert.strictEqual(res.status, 200);
  assert.strictEqual(data.success, true);
});

test('POST /api/webhooks - Invalid Payload (Missing url)', async () => {
  const res = await fetch(`${BASE_URL}/api/webhooks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      events: ["research.completed"]
    }) // Missing url
  });
  
  const data = await res.json();
  assert.strictEqual(res.status, 400);
  assert.strictEqual(data.success, false);
});
