import { NextRequest, NextResponse } from "next/server";
import { certificationsModuleController } from "@/features/Certifications/CertificationsModule";
import { createRegularHandler } from "@/lib/api/createHandler";
import {
  BadRequestError,
  UnprocessableEntityError,
} from "@/lib/errors/HttpError";

export const GET = createRegularHandler(async (request: NextRequest) => {
  const searchParams = request.nextUrl.searchParams;

  // Support ?all=true for fetching all items (used by sort modal)
  if (searchParams.get("all") === "true") {
    const data = await certificationsModuleController.listAllCertifications();
    return NextResponse.json(
      {
        status: "success",
        message: "GET all certifications",
        data,
      },
      { status: 200 },
    );
  }

  const pageNumber = parseInt(searchParams.get("pageNumber") || "1");
  const pageSize = parseInt(searchParams.get("pageSize") || "10");

  if (isNaN(pageNumber) || isNaN(pageSize))
    throw new UnprocessableEntityError(
      "pageNumber and pageSize must be valid numbers",
    );

  const data = await certificationsModuleController.listCertifications(
    pageNumber,
    pageSize,
  );

  return NextResponse.json(
    {
      status: "success",
      message: "GET certifications",
      data: data.list,
      meta: {
        totalRecords: data.count,
        currentPage: pageNumber,
        pageSize,
        totalPages: Math.ceil(data.count / pageSize),
      },
    },
    { status: 200 },
  );
});

export const POST = createRegularHandler(async (request: NextRequest) => {
  const formData = await request.formData();

  // 1. Extract the file
  const image = formData.get("image") as File;
  if (!image) throw new BadRequestError("Image is required");

  // 2. Extract and validate text fields
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;

  if (!title || !description)
    throw new BadRequestError("Missing required fields (title, description)");

  // 3. Call the controller
  const newCertification =
    await certificationsModuleController.createCertification(
      title,
      description,
      image,
    );

  return NextResponse.json(newCertification, { status: 201 });
});
