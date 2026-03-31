import { teamMembersModuleController } from "@/features/TeamMembers/TeamMembersModule";
import { createRegularHandler } from "@/lib/api/createHandler";
import {
  NotFoundError,
  UnprocessableEntityError,
} from "@/lib/errors/HttpError";
import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

export const GET = createRegularHandler(
  async (
    request: NextRequest,
    { params }: { params: Promise<{ teamMemberId: string }> },
  ) => {
    const { teamMemberId } = await params;

    const data = await teamMembersModuleController.getOneMember(teamMemberId);

    return NextResponse.json(
      { message: "GET teamMember", data: data },
      { status: 200 },
    );
  },
);

export const PATCH = createRegularHandler(
  async (
    request: NextRequest,
    { params }: { params: Promise<{ teamMemberId: string }> },
  ) => {
    const { teamMemberId } = await params;
    const formData = await request.formData();

    // 1. Extract the optional new image
    const newImage = formData.get("image") as File | null;

    // 2. Extract the update fields
    const updateDTO: any = {};

    const fields = ["firstName", "lastName", "middleName", "role", "bio", "linkedinProfile"];
    fields.forEach((field) => {
      const value = formData.get(field);
      if (value !== null) {
        updateDTO[field] = value as string;
      }
    });

    // Parse achievements if provided (sent as a JSON string array)
    const achievementsRaw = formData.get("achievements");
    if (achievementsRaw !== null) {
      try {
        updateDTO.achievements = JSON.parse(achievementsRaw as string);
      } catch {
        throw new UnprocessableEntityError("achievements must be a valid JSON array");
      }
    }

    // 3. Extract optional rankingIndex for sort operations
    const rankingIndexRaw = formData.get("rankingIndex");
    let rankingIndex: number | undefined;
    if (rankingIndexRaw !== null) {
      rankingIndex = parseFloat(rankingIndexRaw as string);
      if (isNaN(rankingIndex))
        throw new UnprocessableEntityError("rankingIndex must be a valid number");
    }

    // 4. Execute the update via controller
    const updatedMember = await teamMembersModuleController.updateMember(
      teamMemberId,
      updateDTO,
      newImage || undefined,
      rankingIndex,
    );

    revalidateTag("team-members", "default");

    return NextResponse.json(
      { message: "Member updated successfully", data: updatedMember },
      { status: 200 },
    );
  },
  {
    auth: {
      required: true,
    },
  },
);

export const DELETE = createRegularHandler(
  async (
    request: NextRequest,
    { params }: { params: Promise<{ teamMemberId: string }> },
  ) => {
    const { teamMemberId } = await params;

    const data =
      await teamMembersModuleController.deleteMember(teamMemberId);

    if (!data) throw new NotFoundError("Resource not found");

    revalidateTag("team-members", "default");

    return NextResponse.json(
      { message: "ok", status: "success" },
      { status: 200 },
    );
  },
  {
    auth: {
      required: true,
    },
  },
);
