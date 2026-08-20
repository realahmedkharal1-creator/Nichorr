const rateLimitStore = new Map<string, { count: number; windowStart: number }>();

export function checkRateLimit(key: string, maxRequests: number = 30, windowMs: number = 60000): {
  allowed: boolean;
  remaining: number;
} {
  const now = Date.now();
  const record = rateLimitStore.get(key) || { count: 0, windowStart: now };

  if (now - record.windowStart > windowMs) {
    record.count = 1;
    record.windowStart = now;
  } else {
    record.count += 1;
  }

  rateLimitStore.set(key, record);

  const allowed = record.count <= maxRequests;
  const remaining = Math.max(0, maxRequests - record.count);

  return { allowed, remaining };
}

export class RateLimiter {
  static checkLimit(key: string, maxRequests: number = 30, windowMs: number = 60000) {
    return checkRateLimit(key, maxRequests, windowMs);
  }
}
