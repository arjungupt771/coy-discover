import { describe, it, expect } from "vitest";
import { swipeSchema } from "@/lib/validators/swipe.schema";
import { profileSchema } from "@/lib/validators/profile.schema";

describe("Swipe Request Validation", () => {
  it("accepts valid LIKE swipe request", () => {
    const valid = swipeSchema.safeParse({
      profileId: "profile_001",
      direction: "LIKE",
    });
    expect(valid.success).toBe(true);
  });

  it("accepts valid PASS swipe request", () => {
    const valid = swipeSchema.safeParse({
      profileId: "profile_002",
      direction: "PASS",
    });
    expect(valid.success).toBe(true);
  });

  it("rejects invalid direction", () => {
    const invalid = swipeSchema.safeParse({
      profileId: "profile_001",
      direction: "SUPERLIKE",
    });
    expect(invalid.success).toBe(false);
  });

  it("rejects missing profileId", () => {
    const invalid = swipeSchema.safeParse({
      direction: "LIKE",
    });
    expect(invalid.success).toBe(false);
  });

  it("rejects empty profileId string", () => {
    const invalid = swipeSchema.safeParse({
      profileId: "",
      direction: "PASS",
    });
    expect(invalid.success).toBe(false);
  });
});

describe("Profile Schema Validation", () => {
  it("validates standard profile structure", () => {
    const profile = {
      name: "Aarav Sharma",
      age: 22,
      photo: "/profiles/profile-01.svg",
      bio: "Coffee enthusiast",
      city: "Delhi",
      college: "University of Delhi",
      interests: ["Photography", "Travel"],
    };

    const res = profileSchema.safeParse(profile);
    expect(res.success).toBe(true);
  });

  it("rejects invalid age below 18", () => {
    const profile = {
      name: "Young Student",
      age: 16,
      photo: "/profiles/young.svg",
      bio: "High schooler",
      city: "Delhi",
      interests: ["Gaming"],
    };

    const res = profileSchema.safeParse(profile);
    expect(res.success).toBe(false);
  });
});
