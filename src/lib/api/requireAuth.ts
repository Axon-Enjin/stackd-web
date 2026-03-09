import { configs } from "@/configs/configs";
import { OAuth2Client } from "google-auth-library";
import { NextRequest, NextResponse } from "next/server";
import { UnauthorizedError } from "../errors/HttpError";
import { createSupabaseServerClient } from "../supabase/server";

export const requireAuth = async (request: NextRequest) => {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer")) {
    throw new UnauthorizedError(
      "Unauthorized. Missing token. Please provide a valid token.",
    );
  }

  const supabaseAccessToken = authHeader?.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : undefined;

  if (!supabaseAccessToken) {
    throw new UnauthorizedError("Unauthorized. You passed an invalid token.");
  }

  const supabase = await createSupabaseServerClient();
  // Get user from Supabase using the extracted token
  const { data: user, error: userError } =
    await supabase.auth.getUser(supabaseAccessToken);

  if (userError) {
    throw new UnauthorizedError(
      "Unauthorized. An error occured while loading user using the token you passed.",
    );
  }

  if (!user) {
    throw new UnauthorizedError("Unauthorized. User not found.");
  }

  return true;
};
