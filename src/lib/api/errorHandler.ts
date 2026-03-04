import { NextRequest, NextResponse } from "next/server";
import { HttpError } from "../errors/HttpError";

export const errorHandler = async (req: NextRequest, error: any) => {
  if (error instanceof HttpError) {
    return NextResponse.json(
      {
        status: "error",
        message: error.title,
        details: error.description,
      },
      { status: error.statusCode },
    );
  }

  if (error instanceof Error) {
    return NextResponse.json(
      {
        status: "error",
        message: "Unhandled server error",
        details: error.message,
      },
      { status: 500 },
    );
  }

  return NextResponse.json(
    {
      status: "error",
      message: "Unknown server error",
    },
    { status: 500 },
  );
};
