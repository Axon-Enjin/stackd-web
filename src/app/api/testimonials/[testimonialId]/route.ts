import { NextRequest, NextResponse } from "next/server";
import { testimonialsModuleController } from "@/features/Testimonials/TestimonialsModule"; // Adjust the import path as needed

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ testimonialId: string }> }
) {
  const { testimonialId } = await params;

  try {
    const data = await testimonialsModuleController.getOneTestimonial(
      testimonialId
    );

    return NextResponse.json(
      { message: "GET testimonial", data: data },
      { status: 200 }
    );
  } catch (error: any) {
    const status = error.message.includes("not found") ? 404 : 500;
    return NextResponse.json(
      { message: error.message || "Internal Server Error" },
      { status }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ testimonialId: string }> }
) {
  try {
    const { testimonialId } = await params;
    const formData = await request.formData();

    // 1. Extract the optional new image
    const newImage = formData.get("image") as File | null;

    // 2. Extract the update fields
    const updateDTO: any = {};

    // Notice we added "body" here to support testimonial updates
    const fields = ["name", "role", "body"];
    fields.forEach((field) => {
      const value = formData.get(field);
      if (value !== null) {
        updateDTO[field] = value as string;
      }
    });

    // 3. Execute the update via controller
    const updatedTestimonial =
      await testimonialsModuleController.updateTestimonial(
        testimonialId,
        updateDTO,
        newImage || undefined
      );

    return NextResponse.json(
      {
        message: "Testimonial updated successfully",
        data: updatedTestimonial,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("PATCH Testimonial Error:", error);

    const status = error.message.includes("not found") ? 404 : 500;

    return NextResponse.json(
      { message: error.message || "Internal Server Error" },
      { status }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ testimonialId: string }> }
) {
  try {
    const { testimonialId } = await params;

    const data = await testimonialsModuleController.deleteTestimonial(
      testimonialId
    );

    if (!data) {
      return NextResponse.json(
        { message: "An error occurred", status: "Error" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "DELETE testimonial", status: "Success" },
      { status: 200 }
    );
  } catch (error: any) {
    const status = error.message.includes("not found") ? 404 : 500;
    return NextResponse.json(
      { message: error.message || "Internal Server Error" },
      { status }
    );
  }
}