import { z } from "zod";

export const swipeSchema = z.object({
  profileId: z.string().min(1, "Profile ID is required"),
  direction: z.enum(["LIKE", "PASS"]),
});

export type SwipeInput = z.infer<typeof swipeSchema>;
