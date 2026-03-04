import { NextRequest, NextResponse } from "next/server";
import { RateLimiterMemory } from "rate-limiter-flexible";
import { TooManyRequest_DEPRECATED } from "../errors/HttpError";
import { getClientIp } from "../httpUtils";

export class Limiter {
  memory: RateLimiterMemory;

  constructor(requestPerDuration: number, durationSeconds: number) {
    this.memory = new RateLimiterMemory({
      points: requestPerDuration,
      duration: durationSeconds,
    });
  }

  async consume(request: NextRequest) {
    try {
      const ip = await getClientIp(request);
      await this.memory.consume(ip);
    } catch {
      throw new TooManyRequest_DEPRECATED(
        "too many requests",
        "Too many requests. Try again later.",
      );
    }
  }
}

export const createLimiterHandler = (
  requestPerDuration: number,
  durationSeconds: number,
) => {
  const limiter = new Limiter(requestPerDuration, durationSeconds);

  return async (req: NextRequest) => {
    try {
      await limiter.consume(req);
    } catch (err: any) {
      throw new TooManyRequest_DEPRECATED(
        "too many requests",
        "Too many requests. Try again later.",
      );
    }
  };
};
