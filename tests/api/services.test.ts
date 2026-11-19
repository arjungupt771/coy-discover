import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { prisma } from "@/lib/prisma";
import { CURRENT_USER_ID } from "@/lib/constants";
import { getFeedProfiles } from "@/services/feed.service";
import { processSwipe } from "@/services/swipe.service";
import { getMatches } from "@/services/match.service";

describe("Coy Discover Services & Persistence Integration", () => {
  beforeAll(async () => {
    // Clean up any test swipes from demo-user
    await prisma.match.deleteMany({});
    await prisma.swipe.deleteMany({
      where: { fromUserId: CURRENT_USER_ID },
    });
  });



  it("Feed: returns unswiped profiles and excludes current user", async () => {
    const { profiles, totalRemaining } = await getFeedProfiles();

    expect(profiles.length).toBeGreaterThanOrEqual(30);
    expect(totalRemaining).toBe(profiles.length);

    // Current user must never be in feed
    const hasCurrentUser = profiles.some((p) => p.id === CURRENT_USER_ID);
    expect(hasCurrentUser).toBe(false);

    // Every profile must have required fields
    for (const p of profiles) {
      expect(p.id).toBeDefined();
      expect(p.name).toBeDefined();
      expect(p.age).toBeGreaterThanOrEqual(18);
      expect(p.photo).toBeDefined();
      expect(p.city).toBeDefined();
      expect(Array.isArray(p.interests)).toBe(true);

      // Privacy check: No incoming like or match info leaked
      const privacyCheck = p as unknown as Record<string, unknown>;
      expect(privacyCheck.hasLikedCurrentUser).toBeUndefined();
      expect(privacyCheck.incomingLike).toBeUndefined();
      expect(privacyCheck.likedCurrentUser).toBeUndefined();
    }
  });

  it("Swipe: PASS records swipe with no match and excludes profile from subsequent feed", async () => {
    const { profiles: beforeProfiles } = await getFeedProfiles();
    const target = beforeProfiles[0];

    const result = await processSwipe(target.id, "PASS");
    expect(result.success).toBe(true);
    expect(result.matched).toBe(false);
    expect(result.swipe.direction).toBe("PASS");

    // Persistence check: Verify swipe exists in DB
    const recordedSwipe = await prisma.swipe.findUnique({
      where: {
        fromUserId_toUserId: {
          fromUserId: CURRENT_USER_ID,
          toUserId: target.id,
        },
      },
    });
    expect(recordedSwipe).not.toBeNull();
    expect(recordedSwipe?.direction).toBe("PASS");

    // Feed reload check: swiped profile must be absent
    const { profiles: afterProfiles } = await getFeedProfiles();
    expect(afterProfiles.some((p) => p.id === target.id)).toBe(false);
    expect(afterProfiles.length).toBe(beforeProfiles.length - 1);
  });

  it("Swipe: Duplicate swipe throws DUPLICATE_SWIPE error", async () => {
    const swiped = await prisma.swipe.findFirst({
      where: { fromUserId: CURRENT_USER_ID },
    });
    expect(swiped).not.toBeNull();

    await expect(processSwipe(swiped!.toUserId, "LIKE")).rejects.toThrow("DUPLICATE_SWIPE");
  });

  it("Swipe: Prevents current user from swiping themselves", async () => {
    await expect(
      processSwipe(CURRENT_USER_ID, "LIKE")
    ).rejects.toThrow("SELF_SWIPE_NOT_ALLOWED");
  });

  it("Swipe & Match: LIKE on non-reciprocal profile does NOT match", async () => {
    // profile_002 has no predetermined incoming like and has not been swiped
    const result = await processSwipe("profile_002", "LIKE");
    expect(result.success).toBe(true);
    expect(result.matched).toBe(false);
    expect(result.match).toBeUndefined();
  });

  it("Swipe & Match: LIKE on profile with predetermined incoming like triggers mutual match", async () => {
    // profile_003 has predetermined incoming like in seed
    const incomingSwipe = await prisma.swipe.findUnique({
      where: {
        fromUserId_toUserId: {
          fromUserId: "profile_003",
          toUserId: CURRENT_USER_ID,
        },
      },
    });
    expect(incomingSwipe).not.toBeNull();
    expect(incomingSwipe?.direction).toBe("LIKE");

    const result = await processSwipe("profile_003", "LIKE");
    expect(result.success).toBe(true);
    expect(result.matched).toBe(true);
    expect(result.match).toBeDefined();
    expect(result.match?.profile.id).toBe("profile_003");
    expect(result.match?.profile.name).toBe("Rohan Gupta");

    // Verify Match record exists in DB
    const matches = await getMatches();
    expect(matches.some((m) => m.profile.id === "profile_003")).toBe(true);
  });

  it("Matches: getMatches returns mutual matches sorted newest first with full profile details", async () => {
    // Another predetermined like is profile_008
    await processSwipe("profile_008", "LIKE");

    const matches = await getMatches();
    expect(matches.length).toBe(2);

    // Profile details verification
    for (const m of matches) {
      expect(m.id).toBeDefined();
      expect(m.matchedAt).toBeDefined();
      expect(m.profile.name).toBeDefined();
      expect(m.profile.city).toBeDefined();
      expect(m.profile.photo).toBeDefined();
      expect(m.profile.interests.length).toBeGreaterThan(0);
    }
  });
});
