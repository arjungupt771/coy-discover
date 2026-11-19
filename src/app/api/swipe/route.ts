import { NextRequest, NextResponse } from "next/server";
import { swipeSchema } from "@/lib/validators/swipe.schema";
import { processSwipe } from "@/services/swipe.service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const validated = swipeSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Invalid swipe request" },
        { status: 400 }
      );
    }

    const { profileId, direction } = validated.data;

    const result = await processSwipe(profileId, direction);
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "SELF_SWIPE_NOT_ALLOWED") {
        return NextResponse.json(
          { error: "You cannot swipe on your own profile" },
          { status: 400 }
        );
      }
      if (error.message === "PROFILE_NOT_FOUND") {
        return NextResponse.json(
          { error: "Profile not found" },
          { status: 404 }
        );
      }
      if (error.message === "DUPLICATE_SWIPE") {
        return NextResponse.json(
          { error: "Profile has already been swiped on" },
          { status: 409 }
        );
      }
    }

    console.error("Swipe error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
