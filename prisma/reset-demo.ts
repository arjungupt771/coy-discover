import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const CURRENT_USER_ID = "demo-user";

async function resetDemo() {
  console.log("Resetting Coy Discover demo...");

  // Delete matches involving demo user
  await prisma.match.deleteMany({
    where: {
      OR: [
        { user1Id: CURRENT_USER_ID },
        { user2Id: CURRENT_USER_ID },
      ],
    },
  });

  // Delete outgoing swipes from demo user
  await prisma.swipe.deleteMany({
    where: {
      fromUserId: CURRENT_USER_ID,
    },
  });

  console.log("Demo state reset successfully.");
  console.log("Incoming likes have been preserved.");
  console.log("Feed is ready for a fresh demo.");
}

resetDemo()
  .catch((error) => {
    console.error("Failed to reset demo:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
