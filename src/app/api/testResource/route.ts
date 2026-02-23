import { configs } from "@/configs/configs";
import { supabaseAdminClient } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

import { sampleResourceInsertDTO } from "@/features/SampleFeature/SampleFeature.types";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const pageNumber = parseInt(searchParams.get("pageNumber") || "1");
  const pageSized = parseInt(searchParams.get("pageNumber") || "10");

  const from = (pageNumber - 1) * pageSized;
  const to = from + pageSized - 1;

  const { data, error } = await supabaseAdminClient
    .from("test_resource")
    .select("*")
    .range(from, to)
    .limit(pageSized);

  if (error) {
    console.log(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  } else {
    return NextResponse.json(
      { message: "GET testResource", data: data },
      { status: 200 },
    );
  }
}

export async function POST(
  request: NextRequest, ) {
    const body = await request.json();

  const { data, error } = await supabaseAdminClient
    .from("test_resource")
    .insert<sampleResourceInsertDTO>(body)
    .select("*")
    .maybeSingle();

  if (error) {
    console.log(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  } else {
    return NextResponse.json(
      { message: "POST testResource", data: data },
      { status: 200 },
    );
  }
}
