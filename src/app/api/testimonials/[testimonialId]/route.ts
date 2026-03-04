import { NextRequest, NextResponse } from "next/server";
import { testimonialsModuleController } from "@/features/Testimonials/TestimonialsModule";
import { createRegularHandler } from "@/lib/api/createHandler";
import {
  NotFoundError,
  UnprocessableEntityError,
} from "@/lib/errors/HttpError";

export const GET = createRegularHandler(
  async (
    request: NextRequest,
    { params }: { params: Promise<{ testimonialId: string }> },
  ) => {
    const { testimonialId } = await params;
    const data =
      await testimonialsModuleController.getOneTestimonial(testimonialId);

    return NextResponse.json(
      { message: "GET testimonial", data: data },
      { status: 200 },
    );
  },
);

export const PATCH = createRegularHandler(
  async (
    request: NextRequest,
    { params }: { params: Promise<{ testimonialId: string }> },
  ) => {
    const { testimonialId } = await params;
    const formData = await request.formData();

    // 1. Extract the optional new image
    const newImage = formData.get("image") as File | null;

    // 2. Extract the update fields
    const updateDTO: any = {};

    const fields = ["name", "role", "body"];
    fields.forEach((field) => {
      const value = formData.get(field);
      if (value !== null) {
        updateDTO[field] = value as string;
      }
    });

    // 3. Extract optional rankingIndex for sort operations
    const rankingIndexRaw = formData.get("rankingIndex");
    let rankingIndex: number | undefined;
    if (rankingIndexRaw !== null) {
      rankingIndex = parseFloat(rankingIndexRaw as string);
      if (isNaN(rankingIndex))
        throw new UnprocessableEntityError("rankingIndex must be a valid number");
    }

    // 4. Execute the update via controller
    const updatedTestimonial =
      await testimonialsModuleController.updateTestimonial(
        testimonialId,
        updateDTO,
        newImage || undefined,
        rankingIndex,
      );

    return NextResponse.json(
      {
        message: "Testimonial updated successfully",
        data: updatedTestimonial,
      },
      { status: 200 },
    );
  },
);

export const DELETE = createRegularHandler(
  async (
    request: NextRequest,
    { params }: { params: Promise<{ testimonialId: string }> },
  ) => {
    const { testimonialId } = await params;

    const data =
      await testimonialsModuleController.deleteTestimonial(testimonialId);

    if (!data) throw new NotFoundError("Resource not found");

    return NextResponse.json(
      { message: "ok", status: "success" },
      { status: 200 },
    );
  },
);
