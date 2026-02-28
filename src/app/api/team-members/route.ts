import { teamMembersModuleController } from "@/features/TeamMembers/TeamMembersModule";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
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
      { status: 200 }
    );
  }

  const pageNumber = parseInt(searchParams.get("pageNumber") || "1");
  const pageSize = parseInt(searchParams.get("pageSize") || "10");

  const from = (pageNumber - 1) * pageSize;
  const to = from + pageSize - 1;

  const data = await teamMembersModuleController.listMembers(pageNumber, pageSize);

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
    const firstname = formData.get("firstname") as string;
    const lastname = formData.get("lastname") as string;
    const role = formData.get("role") as string;
    const bio = formData.get("bio") as string;
    const middlename = formData.get("middlename") as string | undefined;

    if (!firstname || !lastname || !role || !bio) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

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
  } catch (error: any) {
    console.error("Create Member Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}

/**
 * post request frontend example 
 * const formData = new FormData();
formData.append("firstname", "John");
formData.append("lastname", "Doe");
formData.append("middlename", "Quincy"); // Optional
formData.append("role", "Lead Developer");
formData.append("bio", "Expert in DDD and Supabase.");
formData.append("image", fileInput.files[0]); // The binary file

// Sent via POST to /api/members
 */
