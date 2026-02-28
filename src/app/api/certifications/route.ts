import { NextRequest, NextResponse } from "next/server";
import { certificationsModuleController } from "@/features/Certifications/CertificationsModule"; // Adjust the import path as needed

export async function GET(request: NextRequest) {
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
      { status: 200 }
    );
  }

  const pageNumber = parseInt(searchParams.get("pageNumber") || "1");
  const pageSize = parseInt(searchParams.get("pageSize") || "10");

  const data = await certificationsModuleController.listCertifications(
    pageNumber,
    pageSize
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
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;

    if (!title || !description) {
      return NextResponse.json(
        { error: "Missing required fields (title, description)" },
        { status: 400 }
      );
    }

    // 3. Call the controller
    const newCertification =
      await certificationsModuleController.createCertification(
        title,
        description,
        image
      );

    return NextResponse.json(newCertification, { status: 201 });
  } catch (error: any) {
    console.error("Create Certification Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

/**
 * Frontend POST example:
 * const formData = new FormData();
 * formData.append("title", "AWS Certified Solutions Architect");
 * formData.append("description", "Validates technical expertise in AWS cloud.");
 * formData.append("image", fileInput.files[0]);
 *
 * // Sent via POST to /api/certifications
 */