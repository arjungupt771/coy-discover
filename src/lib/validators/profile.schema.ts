import { z } from "zod";

export const profileSchema = z.object({
  name: z.string().min(1),
  age: z.number().int().min(18).max(100),
  photo: z.string().min(1),
  bio: z.string().min(1),
  city: z.string().min(1),
  college: z.string().nullable().optional(),
  interests: z.array(z.string()).min(1),
});

export type ProfileInput = z.infer<typeof profileSchema>;
