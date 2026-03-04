import { NextRequest } from "next/server";

export const getClientIp = async (req: NextRequest) => {
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim(); // first IP in list
  }
  return req.headers.get("x-real-ip") || "unknown";
};