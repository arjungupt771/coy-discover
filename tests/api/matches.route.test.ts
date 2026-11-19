import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { GET as getMatchesRoute } from "@/app/api/matches/route";
import { POST as postSwipeRoute } from "@/app/api/swipe/route";
import { prisma } from "@/lib/prisma";
import { CURRENT_USER_ID } from "@/lib/constants";
import { NextRequest } from "next/server";

describe("GET /api/matches Route Handler", () => {
  beforeAll(async () => {
    // Clear demo matches and outgoing swipes
    await prisma.match.deleteMany({});
    await prisma.swipe.deleteMany({
      where: { fromUserId: CURRENT_USER_ID },
    });
  });



  it("returns 200 OK with empty matches array initially", async () => {
    const res = await getMatchesRoute();
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data).toHaveProperty("matches");
    expect(Array.isArray(data.matches)).toBe(true);
    expect(data.matches.length).toBe(0);
  });

  it("returns mutual matches after reciprocal like swipe", async () => {
    // profile_003 has predetermined incoming like
    const swipeReq = new NextRequest("http://localhost:3000/api/swipe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        profileId: "profile_003",
        direction: "LIKE",
      }),
    });

    const swipeRes = await postSwipeRoute(swipeReq);
    const swipeData = await swipeRes.json();
    expect(swipeData.matched).toBe(true);

    const matchesRes = await getMatchesRoute();
    expect(matchesRes.status).toBe(200);

    const matchesData = await matchesRes.json();
    expect(matchesData.matches.length).toBe(1);
    expect(matchesData.matches[0].profile.id).toBe("profile_003");
    expect(matchesData.matches[0].profile.name).toBe("Rohan Gupta");
  });
});
