import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    { status: "success", message: "stackd-api is running" },
    { status: 200 },
  );
}
