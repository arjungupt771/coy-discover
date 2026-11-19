import { prisma } from "@/lib/prisma";
import { CURRENT_USER_ID } from "@/lib/constants";
import { Profile } from "@/types/profile";

export async function getFeedProfiles(): Promise<{
  profiles: Profile[];
  totalRemaining: number;
}> {
  // Get all profiles the current user has already swiped on
  const swipedProfiles = await prisma.swipe.findMany({
    where: { fromUserId: CURRENT_USER_ID },
    select: { toUserId: true },
  });

  const swipedIds = swipedProfiles.map((s) => s.toUserId);

  // Get profiles excluding current user and already-swiped profiles
  const profiles = await prisma.user.findMany({
    where: {
      id: {
        notIn: [CURRENT_USER_ID, ...swipedIds],
      },
    },
    include: {
      interests: {
        include: {
          interest: true,
        },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  const formattedProfiles: Profile[] = profiles.map((p) => ({
    id: p.id,
    name: p.name,
    age: p.age,
    photo: p.photo,
    bio: p.bio,
    city: p.city,
    college: p.college,
    interests: p.interests.map((ui) => ui.interest.name),
  }));

  return {
    profiles: formattedProfiles,
    totalRemaining: formattedProfiles.length,
  };
}
