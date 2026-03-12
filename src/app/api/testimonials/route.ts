import { NextRequest, NextResponse } from "next/server";
import { testimonialsModuleController } from "@/features/Testimonials/TestimonialsModule";
import { createRegularHandler } from "@/lib/api/createHandler";
import {
  BadRequestError,
  UnprocessableEntityError,
} from "@/lib/errors/HttpError";

export const GET = createRegularHandler(async (request: NextRequest) => {
  const searchParams = request.nextUrl.searchParams;

  // Support ?all=true for fetching all items (used by sort modal)
  if (searchParams.get("all") === "true") {
    const data = await testimonialsModuleController.listAllTestimonials();
    return NextResponse.json(
      {
        status: "success",
        message: "GET all testimonials",
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

  const data = await testimonialsModuleController.listTestimonials(
    pageNumber,
    pageSize,
  );

  return NextResponse.json(
    {
      status: "success",
      message: "GET testimonials",
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

export const POST = createRegularHandler(
  async (request: NextRequest) => {
    const formData = await request.formData();

    // 1. Extract the file
    const image = formData.get("image") as File;
    if (!image) throw new BadRequestError("Image is required");

    // 2. Extract and validate text fields
    const name = formData.get("name") as string;
    const role = formData.get("role") as string;
    const company = (formData.get("company") as string) || null;
    const body = formData.get("body") as string;

    if (!name || !role || !body)
      throw new BadRequestError("Missing required fields (name, role, body)");

    // 3. Call the controller
    const newTestimonial = await testimonialsModuleController.createTestimonial(
      name,
      role,
      company,
      body,
      image,
    );

    return NextResponse.json(newTestimonial, { status: 201 });
  },
  {
    auth: {
      required: true,
    },
  },
);
