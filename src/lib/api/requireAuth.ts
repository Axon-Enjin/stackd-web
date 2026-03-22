import { NextRequest } from "next/server";
import { UnauthorizedError } from "../errors/HttpError";
import { customAuthModuleController } from "@/features/Auth/CustomAuthModule";

export const requireAuth = async (request: NextRequest) => {
  // 1. Check Authorization header (Bearer token)
  const authHeader = request.headers.get("Authorization");
  let token = "";

  if (authHeader?.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
    console.log("[Auth] Token found in Authorization header");
  }

  if (!token) {
    console.error("[Auth] No token found in Authorization header");
    // Log all headers for debugging (be careful with sensitive info, but here we just need to know if headers exist)
    const allHeaders: Record<string, string> = {};
    request.headers.forEach((value, key) => {
      if (key.toLowerCase() !== "authorization") {
        allHeaders[key] = value;
      }
    });
    console.log("[Auth] Request Headers:", JSON.stringify(allHeaders));

    throw new UnauthorizedError(
      "Unauthorized. Missing token. Please provide a valid Bearer token in the Authorization header.",
    );
  }

  try {
    // 2. Verify token using Custom Auth
    const user = await customAuthModuleController.verifyToken(token);


    if (!user) {
      console.error(`[Auth] Verification failed for token: ${token.substring(0, 10)}...`);
      throw new UnauthorizedError("Unauthorized. Invalid or expired session. Please log in again.");
    }

    console.log("[Auth] Verification success for user:", user.username);
    // Success
    return true;
  } catch (error: any) {
    if (error instanceof UnauthorizedError) throw error;
    
    console.error("[Auth] Unexpected error during verification:", error.message);
    throw new UnauthorizedError(
      `Unauthorized. Session verification failed: ${error.message}`,
    );
  }
};
