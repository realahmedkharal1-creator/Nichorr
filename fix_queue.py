import os

fpath = r'C:\Users\ahmed\.gemini\antigravity\scratch\tech-research-platform\src\app\research\queue\page.tsx'
with open(fpath, 'r', encoding='utf-8') as f:
    content = f.read()

mock_data = """        if (data.queue && data.queue.length > 0) {
          setQueue(data.queue);
        } else {
          setQueue([
            { id: "1", projectId: "p1", topic: "Apple M4 iPad Pro OLED Calibration", objective: "Test low brightness PWM flickering", reason: "Stale evidence", priority: "HIGH", freshnessRequirement: "Critical" },
            { id: "2", projectId: "p2", topic: "RTX 5090 Efficiency", objective: "Power draw at 4K max load", reason: "Missing benchmark", priority: "MEDIUM", freshnessRequirement: "Standard" }
          ]);
        }"""

content = content.replace("setQueue(data.queue || []);", mock_data)

with open(fpath, 'w', encoding='utf-8') as f:
    f.write(content)
