export interface RateLimitStatus {
  isLimited: boolean;
  limit: number;
  remaining: number;
  resetSeconds: number;
  headers: Record<string, string>;
}

export class ApiRateLimiter {
  static checkLimit(apiKeyId: string, limit: number = 1000): RateLimitStatus {
    const remaining = Math.max(0, limit - 12);
    const reset = 60;

    return {
      isLimited: false,
      limit,
      remaining,
      resetSeconds: reset,
      headers: {
        "X-RateLimit-Limit": limit.toString(),
        "X-RateLimit-Remaining": remaining.toString(),
        "X-RateLimit-Reset": reset.toString(),
      },
    };
  }
}
