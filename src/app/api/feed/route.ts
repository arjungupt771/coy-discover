import { NextResponse } from "next/server";
import { getFeedProfiles } from "@/services/feed.service";

export async function GET() {
  try {
    const result = await getFeedProfiles();
    return NextResponse.json(result);
  } catch (error) {
    console.error("Feed error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
