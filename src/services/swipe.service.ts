import { prisma } from "@/lib/prisma";
import { CURRENT_USER_ID } from "@/lib/constants";
import { normalizeMatchIds } from "@/lib/utils";
import { SwipeDirection } from "@/types/swipe";

export interface SwipeResult {
  success: boolean;
  swipe: { direction: SwipeDirection };
  matched: boolean;
  match?: {
    id: string;
    profile: {
      id: string;
      name: string;
      age: number;
      photo: string;
    };
  };
}

export async function processSwipe(
  profileId: string,
  direction: SwipeDirection
): Promise<SwipeResult> {
  // Prevent self-swiping
  if (profileId === CURRENT_USER_ID) {
    throw new Error("SELF_SWIPE_NOT_ALLOWED");
  }

  // Verify profile exists
  const profile = await prisma.user.findUnique({
    where: { id: profileId },
  });

  if (!profile) {
    throw new Error("PROFILE_NOT_FOUND");
  }

  // Check for duplicate swipe
  const existingSwipe = await prisma.swipe.findUnique({
    where: {
      fromUserId_toUserId: {
        fromUserId: CURRENT_USER_ID,
        toUserId: profileId,
      },
    },
  });

  if (existingSwipe) {
    throw new Error("DUPLICATE_SWIPE");
  }

  // Record the swipe
  await prisma.swipe.create({
    data: {
      fromUserId: CURRENT_USER_ID,
      toUserId: profileId,
      direction: direction,
    },
  });

  // If PASS, no need to check for match
  if (direction === "PASS") {
    return {
      success: true,
      swipe: { direction },
      matched: false,
    };
  }

  // Check for reciprocal LIKE
  const reciprocalSwipe = await prisma.swipe.findUnique({
    where: {
      fromUserId_toUserId: {
        fromUserId: profileId,
        toUserId: CURRENT_USER_ID,
      },
    },
  });

  if (!reciprocalSwipe || reciprocalSwipe.direction !== "LIKE") {
    return {
      success: true,
      swipe: { direction },
      matched: false,
    };
  }

  // Create match using normalized IDs
  const normalizedIds = normalizeMatchIds(CURRENT_USER_ID, profileId);

  const match = await prisma.match.upsert({
    where: {
      user1Id_user2Id: normalizedIds,
    },
    update: {},
    create: normalizedIds,
  });

  return {
    success: true,
    swipe: { direction },
    matched: true,
    match: {
      id: match.id,
      profile: {
        id: profile.id,
        name: profile.name,
        age: profile.age,
        photo: profile.photo,
      },
    },
  };
}
