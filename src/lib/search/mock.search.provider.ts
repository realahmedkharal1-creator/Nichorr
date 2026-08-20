import { SearchProvider, SearchResult } from "./search.interface";

export class MockSearchProvider implements SearchProvider {
  name = "Mock / Golden Benchmark Search";

  async search(query: string, queryType: string = "PRIMARY"): Promise<SearchResult[]> {
    const qLower = query.toLowerCase();

    if (qLower.includes("iphone") || qLower.includes("galaxy") || qLower.includes("s27") || qLower.includes("18 pro")) {
      return [
        {
          title: "Samsung Galaxy S27 Ultra Official Specifications & Battery Architecture",
          url: "https://www.samsung.com/global/galaxy-s27-ultra/specs/",
          snippet: "Galaxy S27 Ultra features 5500mAh silicon-carbon battery, Snapdragon 8 Gen 5 processor globally, and 200MP main camera sensor.",
          publisher: "Samsung Electronics",
          publishedDate: "2026-02-15",
          sourceType: "OFFICIAL_SPEC",
          sourceTier: 1,
        },
        {
          title: "Apple iPhone 18 Pro Max Tech Specs & A20 Pro Thermal Engineering",
          url: "https://www.apple.com/iphone-18-pro/specs/",
          snippet: "iPhone 18 Pro Max features A20 Pro 2nm chip, vapor chamber cooling for the first time, 4860mAh battery, and triple 48MP camera system.",
          publisher: "Apple Inc.",
          publishedDate: "2026-09-10",
          sourceType: "OFFICIAL_SPEC",
          sourceTier: 1,
        },
        {
          title: "AnandTech Deep Dive: Battery Drain under Sustained 4K 60FPS Video Recording",
          url: "https://www.anandtech.com/show/2026/s27u-vs-iphone18pro-battery-benchmark",
          snippet: "Under sustained 4K ProRes recording, iPhone 18 Pro Max lasted 6h 42m before thermal throttling, while S27 Ultra lasted 7h 15m at 43°C max skin temperature.",
          publisher: "AnandTech",
          author: "Dr. Ryan Smith",
          publishedDate: "2026-09-20",
          sourceType: "INDEPENDENT_BENCHMARK",
          sourceTier: 1,
        },
        {
          title: "GSM Arena Lab Tests: Low-Light Camera Noise & Shutter Lag Analysis",
          url: "https://www.gsmarena.com/s27_ultra_vs_iphone_18_pro_camera_test-review-2501.php",
          snippet: "GSM Arena lab measurements show Galaxy S27 Ultra shutter lag is reduced to 18ms, but iPhone 18 Pro Max maintains 0.3 EV higher dynamic range in high-contrast night shots.",
          publisher: "GSMArena",
          publishedDate: "2026-09-22",
          sourceType: "TECH_PUBLICATION",
          sourceTier: 2,
        },
        {
          title: "Reddit r/GalaxyS27: Display Grain & PWM Flickering at Low Brightness",
          url: "https://www.reddit.com/r/GalaxyS27/comments/display_grain_low_brightness/",
          snippet: "Multiple users report noticeable display graininess at <15% brightness on early batch S27 Ultra units. PWM frequency measured at 492Hz.",
          publisher: "Reddit r/GalaxyS27",
          publishedDate: "2026-09-25",
          sourceType: "COMMUNITY_FORUM",
          sourceTier: 3,
        }
      ];
    }

    // Default general technical search results
    return [
      {
        title: "Independent Hardware Benchmark & Thermal Analysis",
        url: "https://www.techpowerup.com/benchmarks/2026-hardware-review",
        snippet: "Comprehensive lab benchmarks measuring peak power consumption, sustained clock speeds, and acoustic fan noise levels across 10 test iterations.",
        publisher: "TechPowerUp Labs",
        publishedDate: "2026-05-10",
        sourceType: "INDEPENDENT_BENCHMARK",
        sourceTier: 1,
      },
      {
        title: "Official Developer Documentation & Architecture Specifications",
        url: "https://developer.hardware-vendor.com/docs/specs-2026",
        snippet: "Official hardware specifications detailing memory bandwidth, PCIe Gen 5 lanes, thermal design power (TDP), and recommended power supply requirements.",
        publisher: "Official Vendor Docs",
        publishedDate: "2026-04-01",
        sourceType: "OFFICIAL_SPEC",
        sourceTier: 1,
      },
      {
        title: "Community Technical Forum Thread: Real-World Stability & Thermal Issues",
        url: "https://www.reddit.com/r/hardware/comments/user_reports_thermal_throttling/",
        snippet: "Over 45 user posts reporting thermal throttling under sustained rendering workloads when using ambient temperatures above 26°C.",
        publisher: "Reddit r/hardware",
        publishedDate: "2026-06-15",
        sourceType: "COMMUNITY_FORUM",
        sourceTier: 3,
      }
    ];
  }
}
