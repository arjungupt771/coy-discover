import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { GET as getFeedRoute } from "@/app/api/feed/route";
import { prisma } from "@/lib/prisma";
import { CURRENT_USER_ID } from "@/lib/constants";

describe("GET /api/feed Route Handler", () => {
  beforeAll(async () => {
    // Clean demo state
    await prisma.match.deleteMany({});
    await prisma.swipe.deleteMany({
      where: { fromUserId: CURRENT_USER_ID },
    });
  });



  it("returns 200 OK with valid profile list and total remaining count", async () => {
    const res = await getFeedRoute();
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data).toHaveProperty("profiles");
    expect(data).toHaveProperty("totalRemaining");
    expect(Array.isArray(data.profiles)).toBe(true);
    expect(data.profiles.length).toBeGreaterThanOrEqual(30);
    expect(data.totalRemaining).toBe(data.profiles.length);
  });

  it("excludes current user (demo-user) from feed response", async () => {
    const res = await getFeedRoute();
    const data = await res.json();

    const currentUserInFeed = data.profiles.find(
      (p: { id: string }) => p.id === CURRENT_USER_ID
    );
    expect(currentUserInFeed).toBeUndefined();
  });

  it("does not expose incoming likes or private match information", async () => {
    const res = await getFeedRoute();
    const data = await res.json();

    for (const profile of data.profiles) {
      expect(profile.hasLikedCurrentUser).toBeUndefined();
      expect(profile.incomingLike).toBeUndefined();
      expect(profile.likedCurrentUser).toBeUndefined();
      expect(profile.isMatch).toBeUndefined();
    }
  });
});
