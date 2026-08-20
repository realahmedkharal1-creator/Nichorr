export interface BenchmarkTestCase {
  id: string;
  topic: string;
  objective: string;
  contentType: string;
  expectedEntities: string[];
  expectedQuestions: string[];
  knownClaims: Array<{ text: string; status: string; confidence: string }>;
  knownConflicts: Array<{ type: string; explanation: string }>;
  expectedSignals: string[];
  expectedOpportunities: string[];
}

export const GOLDEN_BENCHMARK_DATASET: BenchmarkTestCase[] = [
  {
    id: "bm-01-flagship-phones",
    topic: "Samsung Galaxy S27 Ultra vs iPhone 18 Pro Max",
    objective: "Compare camera dynamic range, battery endurance under 4K video recording, sustained SoC thermal throttling, and real-world value for a YouTube video.",
    contentType: "Comparison",
    expectedEntities: ["Galaxy S27 Ultra", "iPhone 18 Pro Max", "Snapdragon 8 Gen 5", "A20 Pro"],
    expectedQuestions: [
      "Which flagship phone has longer battery endurance during 4K video recording?",
      "How do sustained thermal throttles compare under heavy gaming or rendering workloads?",
      "What low-light camera shutter lag and dynamic range differences exist?",
      "What recurring display or hardware problems are early buyers reporting?"
    ],
    knownClaims: [
      { text: "iPhone 18 Pro Max sustained 4K ProRes recording for 6h 42m before thermal shutdown.", status: "SUPPORTED", confidence: "HIGH" },
      { text: "Galaxy S27 Ultra features 5500mAh battery and sustained recording for 7h 15m at 43°C max skin temperature.", status: "SUPPORTED", confidence: "HIGH" },
      { text: "Galaxy S27 Ultra completely eliminates low-light shutter lag.", status: "PARTIALLY_SUPPORTED", confidence: "MEDIUM" }
    ],
    knownConflicts: [
      { type: "METHODOLOGICAL", explanation: "AnandTech lab tests report iPhone 18 Pro Max throttling earlier due to glass back dissipation, whereas Tom's Hardware reports identical endurance when using active cooling clips." }
    ],
    expectedSignals: [
      "Early batch S27 Ultra users report subtle display graininess under 15% brightness.",
      "iPhone 18 Pro Max users note initial iOS thermal spikes during background photo indexing."
    ],
    expectedOpportunities: [
      "Deep dive video into 4K video recording thermal limits: Why active cooling matters for mobile creators.",
      "Display PWM flickering & grain analysis: Fact vs placebo in early production batches."
    ]
  },
  {
    id: "bm-02-laptop-thermals",
    topic: "MacBook Pro 16 M5 Max vs Dell XPS 16 Core Ultra 9 Thermal Throttling",
    objective: "Investigate sustained CPU rendering performance and acoustic noise under 100% multi-core load.",
    contentType: "Review",
    expectedEntities: ["MacBook Pro 16 M5 Max", "Dell XPS 16 Core Ultra 9 185H"],
    expectedQuestions: [
      "Does Dell XPS 16 throttle below base clock speed under combined CPU+GPU workload?",
      "What is fan noise decibel output under full synthetic stress test?"
    ],
    knownClaims: [
      { text: "MacBook Pro 16 M5 Max maintains 98.4% performance stability after 45 minutes of Cinebench R24.", status: "SUPPORTED", confidence: "HIGH" },
      { text: "Dell XPS 16 power limits drop from 80W PL2 to 45W PL1 after 8 minutes.", status: "SUPPORTED", confidence: "HIGH" }
    ],
    knownConflicts: [
      { type: "NUMERIC", explanation: "Notebookcheck measured 46dBA fan noise while LaptopMag reported 51dBA due to ambient room temperature delta (21°C vs 25°C)." }
    ],
    expectedSignals: [
      "XPS 16 users report palm rest temperatures reaching 44°C during 3D rendering."
    ],
    expectedOpportunities: [
      "Thermal Throttling Reality Check: Why thin-and-light creator laptops drop 30% performance over time."
    ]
  },
  {
    id: "bm-03-gpu-comparison",
    topic: "NVIDIA RTX 5080 vs AMD RX 8900 XTX 4K Gaming Benchmark",
    objective: "Compare 4K ray tracing performance, DLSS 4 vs FSR 4 frame generation quality, and power consumption.",
    contentType: "Comparison",
    expectedEntities: ["RTX 5080 16GB", "RX 8900 XTX 24GB", "Blackwell Architecture", "RDNA4 Architecture"],
    expectedQuestions: [
      "Is 16GB VRAM a bottleneck for 4K ray-traced gaming in 2026 titles?",
      "What is real-world wall-socket power draw delta?"
    ],
    knownClaims: [
      { text: "RTX 5080 delivers 28% higher path-tracing FPS in Cyberpunk 2077 Ultra Ray Tracing preset.", status: "SUPPORTED", confidence: "HIGH" },
      { text: "RX 8900 XTX draws 410W TBP vs RTX 5080 340W TBP under 4K load.", status: "SUPPORTED", confidence: "HIGH" }
    ],
    knownConflicts: [
      { type: "VARIANT", explanation: "Factory overclocked partner cards (ASUS TUF vs MSI Suprim) exhibit 45W TBP variation." }
    ],
    expectedSignals: [
      "Users report 12V-2x6 power connector rigidity concerns in compact micro-ATX cases."
    ],
    expectedOpportunities: [
      "16GB vs 24GB VRAM in 2026: Testing 4K texture allocation limits on modern GPUs."
    ]
  },
  {
    id: "bm-04-pc-build-ram",
    topic: "DDR5-7200 vs DDR5-6000 Stability on AMD Ryzen 9 9950X",
    objective: "Determine optimal RAM sweet spot, EXPO profile stability, and 1% low FPS gaming gains.",
    contentType: "Explainer",
    expectedEntities: ["Ryzen 9 9950X", "DDR5 6000 CL30", "DDR5 7200 CL34", "Infinity Fabric FCLK"],
    expectedQuestions: [
      "Does DDR5-7200 run 1:1 gear mode stably on AM5 socket without manual voltage tuning?",
      "What is 1% low framerate difference in esports titles?"
    ],
    knownClaims: [
      { text: "DDR5-6000 CL30 remains optimal 1:1 FCLK sweet spot for 99.9% plug-and-play stability.", status: "SUPPORTED", confidence: "HIGH" }
    ],
    knownConflicts: [
      { type: "METHODOLOGICAL", explanation: "Hardware Unboxed shows 2% gaming difference; TechSpot shows 8% in memory-bound CPU titles." }
    ],
    expectedSignals: [
      "Users report 45-second EXPO memory training boot times on early AGESA BIOS builds."
    ],
    expectedOpportunities: [
      "Stop Wasting Money on DDR5-7200: Ryzen 9000 Memory Tuning Guide."
    ]
  },
  {
    id: "bm-05-smartwatch-sensors",
    topic: "Apple Watch Ultra 3 vs Garmin Fenix 8 Battery & Heart Rate Sensor Accuracy",
    objective: "Compare GPS track accuracy in dense urban areas, optical HR sensor vs chest strap, and battery life during multi-day hikes.",
    contentType: "Comparison",
    expectedEntities: ["Apple Watch Ultra 3", "Garmin Fenix 8 AMOLED"],
    expectedQuestions: [
      "How many days does Fenix 8 last with always-on display enabled vs Apple Watch Ultra 3?",
      "Is dual-frequency L1+L5 GPS track precision identical in high-rise city canyons?"
    ],
    knownClaims: [
      { text: "Garmin Fenix 8 delivers 16 days battery life vs Apple Watch Ultra 3's 72 hours in low-power mode.", status: "SUPPORTED", confidence: "HIGH" }
    ],
    knownConflicts: [
      { type: "DEFINITION", explanation: "Battery life claims differ based on whether 'Always-On Display' or 'Gesture Wake' is counted as standard use." }
    ],
    expectedSignals: [
      "Apple Watch Ultra 3 users praise satellite SOS messaging setup speed during backcountry trails."
    ],
    expectedOpportunities: [
      "7-Day Survival Test: Apple Watch Ultra 3 vs Garmin Fenix 8 for Extreme Hiking."
    ]
  },
  {
    id: "bm-06-gaming-handheld",
    topic: "Steam Deck OLED vs ROG Ally X 2 Battery & Ergonomics",
    objective: "Compare 15W TDP vs 25W TDP game framerates, battery runtime at 720p/1080p, and sleep/resume reliability.",
    contentType: "Review",
    expectedEntities: ["Steam Deck OLED", "ROG Ally X 2", "Z2 Extreme SoC", "SteamOS 3.6"],
    expectedQuestions: [
      "Does ROG Ally X 2 80Wh battery bridge the endurance gap against Steam Deck OLED at 15W TDP?"
    ],
    knownClaims: [
      { text: "Steam Deck OLED screen achieves 1,000 nits HDR peak brightness vs ROG Ally X 2's 500 nits IPS.", status: "SUPPORTED", confidence: "HIGH" }
    ],
    knownConflicts: [],
    expectedSignals: ["Windows 11 sleep/resume state still causes game audio desync on ROG Ally X 2."],
    expectedOpportunities: ["Handheld Gaming Showdown: Is Windows 11 Still the Weakest Link in 2026?"]
  },
  {
    id: "bm-07-tech-news-conflicts",
    topic: "iOS 19.4 Update Battery Drain Investigation",
    objective: "Analyze conflicting reports on whether iOS 19.4 update degrades iPhone battery health or if it is temporary post-update indexing.",
    contentType: "Problem investigation",
    expectedEntities: ["iOS 19.4", "iPhone 17 Pro", "iPhone 16 Pro"],
    expectedQuestions: ["Is iOS 19.4 battery drain real or background spotlight re-indexing?"],
    knownClaims: [
      { text: "Geekbench battery benchmark scores drop by 4% within first 48 hours post-update, normalizing after day 3.", status: "SUPPORTED", confidence: "MEDIUM" }
    ],
    knownConflicts: [
      { type: "TEMPORAL", explanation: "Day 1 battery tests show 18% faster drain; Day 4 tests show zero net loss compared to iOS 19.3." }
    ],
    expectedSignals: ["Reddit users flooding support threads claiming 10% battery drop per hour."],
    expectedOpportunities: ["Don't Panic About iOS Updates: Understanding Day-1 Background Indexing Drain."]
  },
  {
    id: "bm-08-display-tint-complaints",
    topic: "OLED Monitor Uniformity & Green Tint Issue Investigation",
    objective: "Investigate QD-OLED Gen 3 vs WOLED panel green/pink tinting at extreme viewing angles.",
    contentType: "Problem investigation",
    expectedEntities: ["QD-OLED Gen 3", "WOLED 480Hz Panel", "ASUS ROG Swift PG27AQDP"],
    expectedQuestions: ["What percentage of WOLED panels exhibit subtle green tint on gray backgrounds?"],
    knownClaims: [
      { text: "WOLED panels exhibit subtle color shift past 45° viewing angles due to micro-lens array (MLA) refraction.", status: "SUPPORTED", confidence: "HIGH" }
    ],
    knownConflicts: [],
    expectedSignals: ["Users returning monitors up to 3 times to win the 'panel lottery'."],
    expectedOpportunities: ["OLED Panel Lottery Explained: How to Test Your Monitor for Uniformity & Tint."]
  },
  {
    id: "bm-09-regional-soc-variants",
    topic: "Samsung Galaxy S27 Regional Variants: Snapdragon 8 Gen 5 vs Exynos 2600",
    objective: "Compare regional battery performance, modem 5G efficiency, and ISP camera processing between US/China and European models.",
    contentType: "Comparison",
    expectedEntities: ["Galaxy S27 (US/Asia - Snapdragon)", "Galaxy S27 (Europe - Exynos 2600)"],
    expectedQuestions: ["Is there a performance or battery gap between regional S27 variants?"],
    knownClaims: [
      { text: "Exynos 2600 modem consumes 8% more power under weak 5G signal conditions compared to Snapdragon X80 modem.", status: "SUPPORTED", confidence: "HIGH" }
    ],
    knownConflicts: [
      { type: "VARIANT", explanation: "US tech reviewers testing Snapdragon report 10% higher battery life than European reviewers testing Exynos." }
    ],
    expectedSignals: ["European buyers expressing frustration over paying identical price for Exynos SoC variant."],
    expectedOpportunities: ["Regional Phone Variants: Why Your Location Changes Phone Battery & Camera Performance."]
  },
  {
    id: "bm-10-firmware-degradation",
    topic: "Wireless Gaming Headset Active Noise Cancellation Degradation Post-Firmware 2.1.0",
    objective: "Verify community complaints that ANC strength was reduced in firmware 2.1.0 to eliminate cabin pressure feeling.",
    contentType: "Problem investigation",
    expectedEntities: ["Sony WH-1000XM6", "Firmware 2.1.0"],
    expectedQuestions: ["Did firmware 2.1.0 measurably decrease low-frequency ANC isolation?"],
    knownClaims: [
      { text: "SoundGuys acoustic lab measurements confirm 4dB attenuation reduction in 100Hz-300Hz low-frequency noise post-update.", status: "SUPPORTED", confidence: "HIGH" }
    ],
    knownConflicts: [],
    expectedSignals: ["Users warning community members not to update firmware via official smartphone app."],
    expectedOpportunities: ["Did Firmware 2.1.0 Ruin Your Headsets ANC? Acoustic Lab Measurements Revealed."]
  }
];
