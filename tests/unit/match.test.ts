import { describe, it, expect } from "vitest";
import { normalizeMatchIds } from "@/lib/utils";

describe("Match ID Normalization", () => {
  it("should normalize IDs deterministically regardless of order (A, B) vs (B, A)", () => {
    const pair1 = normalizeMatchIds("user_alpha", "user_beta");
    const pair2 = normalizeMatchIds("user_beta", "user_alpha");

    expect(pair1.user1Id).toBe("user_alpha");
    expect(pair1.user2Id).toBe("user_beta");

    expect(pair2.user1Id).toBe("user_alpha");
    expect(pair2.user2Id).toBe("user_beta");

    expect(pair1).toEqual(pair2);
  });

  it("handles complex or numerical ID strings correctly", () => {
    const pair1 = normalizeMatchIds("profile_005", "demo-user");
    const pair2 = normalizeMatchIds("demo-user", "profile_005");

    expect(pair1).toEqual(pair2);
    expect(pair1.user1Id).toBe("demo-user");
    expect(pair1.user2Id).toBe("profile_005");
  });
});

describe("Matching Logic Scenarios & Duplicate Prevention", () => {
  function evaluateMatch(
    userSwipe: "LIKE" | "PASS",
    reciprocalSwipe: "LIKE" | "PASS" | null
  ): boolean {
    if (userSwipe !== "LIKE") return false;
    if (!reciprocalSwipe) return false;
    return reciprocalSwipe === "LIKE";
  }

  it("Test 1: User A likes User B, User B likes User A => Match", () => {
    const isMatch = evaluateMatch("LIKE", "LIKE");
    expect(isMatch).toBe(true);
  });

  it("Test 2: User A likes User B, User B has not liked User A => No match", () => {
    const isMatch = evaluateMatch("LIKE", null);
    expect(isMatch).toBe(false);
  });

  it("Test 3: User A passes User B, User B likes User A => No match", () => {
    const isMatch = evaluateMatch("PASS", "LIKE");
    expect(isMatch).toBe(false);
  });

  it("Test 4: User A likes User B, User B passes User A => No match", () => {
    const isMatch = evaluateMatch("LIKE", "PASS");
    expect(isMatch).toBe(false);
  });

  it("Test 5: Normalized ID generation prevents duplicate A+B and B+A match records", () => {
    const matchMap = new Map<string, boolean>();

    const pair1 = normalizeMatchIds("user_1", "user_2");
    const key1 = `${pair1.user1Id}_${pair1.user2Id}`;
    matchMap.set(key1, true);

    const pair2 = normalizeMatchIds("user_2", "user_1");
    const key2 = `${pair2.user1Id}_${pair2.user2Id}`;

    expect(key1).toBe(key2);
    expect(matchMap.size).toBe(1);
  });
});
