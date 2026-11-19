import { prisma } from "@/lib/prisma";
import { Profile } from "@/types/profile";

export async function getProfileById(id: string): Promise<Profile | null> {
  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      interests: {
        include: {
          interest: true,
        },
      },
    },
  });

  if (!user) return null;

  return {
    id: user.id,
    name: user.name,
    age: user.age,
    photo: user.photo,
    bio: user.bio,
    city: user.city,
    college: user.college,
    interests: user.interests.map((ui) => ui.interest.name),
  };
}
