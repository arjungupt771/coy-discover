import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { POST as postSwipeRoute } from "@/app/api/swipe/route";
import { prisma } from "@/lib/prisma";
import { CURRENT_USER_ID } from "@/lib/constants";
import { NextRequest } from "next/server";

function createSwipeRequest(body: unknown): NextRequest {
  return new NextRequest("http://localhost:3000/api/swipe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/swipe Route Handler", () => {
  beforeAll(async () => {
    await prisma.match.deleteMany({});
    await prisma.swipe.deleteMany({
      where: { fromUserId: CURRENT_USER_ID },
    });
  });


  it("handles valid PASS swipe returning 200 OK and matched: false", async () => {
    const req = createSwipeRequest({
      profileId: "profile_010",
      direction: "PASS",
    });

    const res = await postSwipeRoute(req);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.matched).toBe(false);
    expect(data.swipe.direction).toBe("PASS");
  });

  it("handles valid LIKE swipe returning 200 OK", async () => {
    const req = createSwipeRequest({
      profileId: "profile_011",
      direction: "LIKE",
    });

    const res = await postSwipeRoute(req);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.swipe.direction).toBe("LIKE");
  });

  it("rejects invalid payload with 400 Bad Request", async () => {
    const req = createSwipeRequest({
      profileId: "profile_001",
      direction: "SUPER_LIKE",
    });

    const res = await postSwipeRoute(req);
    expect(res.status).toBe(400);

    const data = await res.json();
    expect(data).toHaveProperty("error");
    expect(data.error).toBe("Invalid swipe request");
  });

  it("rejects self-swipe with 400 Bad Request", async () => {
    const req = createSwipeRequest({
      profileId: CURRENT_USER_ID,
      direction: "LIKE",
    });

    const res = await postSwipeRoute(req);
    expect(res.status).toBe(400);

    const data = await res.json();
    expect(data.error).toBe("You cannot swipe on your own profile");
  });

  it("returns 404 Not Found when profile does not exist", async () => {
    const req = createSwipeRequest({
      profileId: "non_existent_profile_999",
      direction: "PASS",
    });

    const res = await postSwipeRoute(req);
    expect(res.status).toBe(404);

    const data = await res.json();
    expect(data.error).toBe("Profile not found");
  });

  it("returns 409 Conflict when attempting duplicate swipe", async () => {
    // profile_010 was already swiped in the first test
    const req = createSwipeRequest({
      profileId: "profile_010",
      direction: "LIKE",
    });

    const res = await postSwipeRoute(req);
    expect(res.status).toBe(409);

    const data = await res.json();
    expect(data.error).toBe("Profile has already been swiped on");
  });
});
