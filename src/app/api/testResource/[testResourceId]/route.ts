import { supabaseAdminClient } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ testResourceId: string }> },
) {
  const { testResourceId } = await params;

  const { data, error } = await supabaseAdminClient
    .from("test_resource")
    .select("*")
    .eq("id", testResourceId)
    .maybeSingle();

  if (error) {
    console.error("Supabase Error:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json(
      { message: "Resource not found" },
      { status: 404 },
    );
  }

  return NextResponse.json(
    { message: "GET testResource success", data: data },
    { status: 200 },
  );
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ testResourceId: string }> },
) {
  const body = await request.json();
  const { testResourceId } = await params;

  const { data, error } = await supabaseAdminClient
    .from("test_resource")
    .update(body)
    .eq("id", testResourceId)
    .select("*")
    .maybeSingle();

  if (error) {
    console.log(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  } else {
    return NextResponse.json(
      { message: "PATCH testResource", data: data },
      { status: 200 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ testResourceId: string }> },
) {
  const { testResourceId } = await params;
  const { error } = await supabaseAdminClient
    .from("test_resource")
    .delete()
    .eq("id", testResourceId);

  if (error) {
    console.log(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
  return NextResponse.json({ message: "DELETE testResource" }, { status: 200 });
}
