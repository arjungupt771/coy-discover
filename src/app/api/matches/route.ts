import { NextResponse } from "next/server";
import { getMatches } from "@/services/match.service";

export async function GET() {
  try {
    const matches = await getMatches();
    return NextResponse.json({ matches });
  } catch (error) {
    console.error("Matches error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
