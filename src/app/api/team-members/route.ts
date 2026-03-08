import { teamMembersModuleController } from "@/features/TeamMembers/TeamMembersModule";
import { createRegularHandler } from "@/lib/api/createHandler";
import {
  BadRequestError,
  UnprocessableEntityError,
} from "@/lib/errors/HttpError";
import { NextRequest, NextResponse } from "next/server";

export const GET = createRegularHandler(async (request: NextRequest) => {
  const searchParams = request.nextUrl.searchParams;

  // Support ?all=true for fetching all items (used by sort modal)
  if (searchParams.get("all") === "true") {
    const data = await teamMembersModuleController.listAllMembers();
    return NextResponse.json(
      {
        status: "success",
        message: "GET all team members",
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

  const data = await teamMembersModuleController.listMembers(
    pageNumber,
    pageSize,
  );

  return NextResponse.json(
    {
      status: "success",
      message: "GET teamMembers",
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
    const firstname = formData.get("firstname") as string;
    const lastname = formData.get("lastname") as string;
    const role = formData.get("role") as string;
    const bio = formData.get("bio") as string;
    const middlename = formData.get("middlename") as string | undefined;

    if (!firstname || !lastname || !role || !bio)
      throw new BadRequestError(
        "Missing required fields (firstname, lastname, role, bio)",
      );

    // 3. Call the controller
    const newMember = await teamMembersModuleController.createMember(
      firstname,
      lastname,
      role,
      bio,
      image,
      middlename,
    );

    return NextResponse.json(newMember, { status: 201 });
  },
  {
    auth: {
      required: true,
    },
  },
);
