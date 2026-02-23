import {
  TeamsModuleController,
  teamsModuleController,
} from "@/features/Team/TeamsModule";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ teamMemberId: string }> },
) {
  const { teamMemberId } = await params;

  const data = await teamsModuleController.getOneMember(teamMemberId);

  return NextResponse.json(
    { message: "GET teamMember", data: data },
    { status: 200 },
  );
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ teamMemberId: string }> },
) {
  try {
    const { teamMemberId } = await params;
    const formData = await request.formData();

    // 1. Extract the optional new image
    const newImage = formData.get("image") as File | null;

    // 2. Extract the update fields
    // We filter out nulls to ensure we only pass provided values to the Partial DTO
    const updateDTO: any = {};

    const fields = ["firstName", "lastName", "middleName", "role", "bio"];
    fields.forEach((field) => {
      const value = formData.get(field);
      if (value !== null) {
        updateDTO[field] = value as string;
      }
    });

    // 3. Execute the update via controller
    const updatedMember = await teamsModuleController.updateMember(
      teamMemberId,
      updateDTO,
      newImage || undefined,
    );

    return NextResponse.json(
      { message: "Member updated successfully", data: updatedMember },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("PATCH Member Error:", error);

    // Check for specific domain errors if you've defined them
    const status = error.message.includes("not found") ? 404 : 500;

    return NextResponse.json(
      { message: error.message || "Internal Server Error" },
      { status },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ teamMemberId: string }> },
) {
  const { teamMemberId } = await params;

  const data = await teamsModuleController.deleteMember(teamMemberId);

  if (!data) {
    return NextResponse.json(
      { message: "An error occured", status: "Error" },
      { status: 404 },
    );
  }

  return NextResponse.json(
    { message: "DELETE testResource", status: "Success" },
    { status: 200 },
  );
}
