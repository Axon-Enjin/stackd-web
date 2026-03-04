import { NextRequest, NextResponse } from "next/server";
import { HttpError } from "../errors/HttpError";
import { ApplicationError } from "../errors/ApplicationError";
import { applicationErrToHttpErr } from "./applicationErrToHttpErr";


export const errorHandler = async (req: NextRequest, error: unknown) => {
  if (error instanceof ApplicationError) {
    error = applicationErrToHttpErr(error)
  }

  if (error instanceof HttpError) {
    return NextResponse.json(
      {
        status: "error",
        message: error.title,
        details: error.description,
        stack: error.stack
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
