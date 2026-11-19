import { prisma } from "@/lib/prisma";
import { CURRENT_USER_ID } from "@/lib/constants";
import { Match } from "@/types/match";

export async function getMatches(): Promise<Match[]> {
  const matches = await prisma.match.findMany({
    where: {
      OR: [
        { user1Id: CURRENT_USER_ID },
        { user2Id: CURRENT_USER_ID },
      ],
    },
    orderBy: { createdAt: "desc" },
  });

  const matchResults: Match[] = [];

  for (const match of matches) {
    const otherUserId =
      match.user1Id === CURRENT_USER_ID ? match.user2Id : match.user1Id;

    const otherUser = await prisma.user.findUnique({
      where: { id: otherUserId },
      include: {
        interests: {
          include: {
            interest: true,
          },
        },
      },
    });

    if (otherUser) {
      matchResults.push({
        id: match.id,
        matchedAt: match.createdAt.toISOString(),
        profile: {
          id: otherUser.id,
          name: otherUser.name,
          age: otherUser.age,
          photo: otherUser.photo,
          city: otherUser.city,
          bio: otherUser.bio,
          interests: otherUser.interests.map((ui) => ui.interest.name),
        },
      });
    }
  }

  return matchResults;
}
