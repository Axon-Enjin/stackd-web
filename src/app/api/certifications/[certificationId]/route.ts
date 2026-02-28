import { NextRequest, NextResponse } from "next/server";
import { certificationsModuleController } from "@/features/Certifications/CertificationsModule"; // Adjust the import path as needed

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ certificationId: string }> }
) {
  const { certificationId } = await params;

  try {
    const data = await certificationsModuleController.getOneCertification(
      certificationId
    );

    return NextResponse.json(
      { message: "GET certification", data: data },
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
  { params }: { params: Promise<{ certificationId: string }> }
) {
  try {
    const { certificationId } = await params;
    const formData = await request.formData();

    // 1. Extract the optional new image
    const newImage = formData.get("image") as File | null;

    // 2. Extract the update fields
    const updateDTO: any = {};

    const fields = ["title", "description"];
    fields.forEach((field) => {
      const value = formData.get(field);
      if (value !== null) {
        updateDTO[field] = value as string;
      }
    });

    // 3. Extract optional rankingIndex for sort operations
    const rankingIndexRaw = formData.get("rankingIndex");
    const rankingIndex = rankingIndexRaw !== null ? parseFloat(rankingIndexRaw as string) : undefined;

    // 4. Execute the update via controller
    const updatedCertification =
      await certificationsModuleController.updateCertification(
        certificationId,
        updateDTO,
        newImage || undefined,
        rankingIndex,
      );

    return NextResponse.json(
      {
        message: "Certification updated successfully",
        data: updatedCertification,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("PATCH Certification Error:", error);

    const status = error.message.includes("not found") ? 404 : 500;

    return NextResponse.json(
      { message: error.message || "Internal Server Error" },
      { status }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ certificationId: string }> }
) {
  try {
    const { certificationId } = await params;

    const data = await certificationsModuleController.deleteCertification(
      certificationId
    );

    if (!data) {
      return NextResponse.json(
        { message: "An error occurred", status: "Error" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "DELETE certification", status: "Success" },
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