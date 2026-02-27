import { NextRequest, NextResponse } from "next/server";
import { testimonialsModuleController } from "@/features/Testimonials/TestimonialsModule"; // Adjust the import path as needed

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const pageNumber = parseInt(searchParams.get("pageNumber") || "1");
  const pageSize = parseInt(searchParams.get("pageSize") || "10");

  const data = await testimonialsModuleController.listTestimonials(
    pageNumber,
    pageSize
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
    { status: 200 }
  );
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    // 1. Extract the file
    const image = formData.get("image") as File;
    if (!image) {
      return NextResponse.json({ error: "Image is required" }, { status: 400 });
    }

    // 2. Extract and validate text fields
    const name = formData.get("name") as string;
    const role = formData.get("role") as string;
    const body = formData.get("body") as string;

    if (!name || !role || !body) {
      return NextResponse.json(
        { error: "Missing required fields (name, role, body)" },
        { status: 400 }
      );
    }

    // 3. Call the controller
    const newTestimonial =
      await testimonialsModuleController.createTestimonial(
        name,
        role,
        body,
        image
      );

    return NextResponse.json(newTestimonial, { status: 201 });
  } catch (error: any) {
    console.error("Create Testimonial Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

/**
 * Frontend POST example:
 * const formData = new FormData();
 * formData.append("name", "Jane Doe");
 * formData.append("role", "CEO at TechCorp");
 * formData.append("body", "This service completely transformed our workflow!");
 * formData.append("image", fileInput.files[0]);
 *
 * // Sent via POST to /api/testimonials
 */