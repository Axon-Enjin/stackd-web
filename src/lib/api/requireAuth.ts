import { NextRequest } from "next/server";
import { UnauthorizedError } from "../errors/HttpError";
import { customAuthModuleController } from "@/features/Auth/CustomAuthModule";

export const requireAuth = async (request: NextRequest) => {
  // 1. Check Authorization header (Bearer token)
  const authHeader = request.headers.get("Authorization");
  let token = "";

  if (authHeader?.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  } else {
    // 2. Fallback to auth_token cookie
    const cookieToken = request.cookies.get("auth_token")?.value;
    if (cookieToken) {
      token = cookieToken;
    }
  }

  if (!token) {
    throw new UnauthorizedError(
      "Unauthorized. Missing token. Please provide a valid token or login.",
    );
  }

  try {
    // 3. Verify token using Custom Auth
    const user = await customAuthModuleController.verifyToken(token);

    if (!user) {
      throw new UnauthorizedError("Unauthorized. Invalid or expired token.");
    }

    // Success
    return true;
  } catch (error) {
    throw new UnauthorizedError(
      "Unauthorized. An error occurred while verifying your session.",
    );
  }
};
