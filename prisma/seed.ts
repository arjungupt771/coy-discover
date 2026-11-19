import { PrismaClient, SwipeDirection } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();

const CURRENT_USER_ID = "demo-user";

const PALETTES = [
  { bg1: "#FF6B6B", bg2: "#FFE66D", accent: "#4ECDC4" },
  { bg1: "#6C5CE7", bg2: "#a29bfe", accent: "#FD79A8" },
  { bg1: "#00b894", bg2: "#55efc4", accent: "#ffeaa7" },
  { bg1: "#e17055", bg2: "#fab1a0", accent: "#74b9ff" },
  { bg1: "#fd79a8", bg2: "#e84393", accent: "#fdcb6e" },
  { bg1: "#0984e3", bg2: "#74b9ff", accent: "#55efc4" },
  { bg1: "#d63031", bg2: "#ff7675", accent: "#a29bfe" },
  { bg1: "#6c5ce7", bg2: "#fd79a8", accent: "#ffeaa7" },
  { bg1: "#10b981", bg2: "#3b82f6", accent: "#f59e0b" },
  { bg1: "#ec4899", bg2: "#8b5cf6", accent: "#06b6d4" },
];

function generateSvgAvatar(name: string, index: number): string {
  const palette = PALETTES[index % PALETTES.length];
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 533" width="400" height="533">
  <defs>
    <linearGradient id="grad-${index}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${palette.bg1}" />
      <stop offset="100%" stop-color="${palette.bg2}" />
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="8" stdDeviation="16" flood-opacity="0.3"/>
    </filter>
  </defs>
  <rect width="400" height="533" fill="url(#grad-${index})" />
  <circle cx="200" cy="180" r="90" fill="white" opacity="0.2" />
  <circle cx="200" cy="180" r="70" fill="white" opacity="0.3" filter="url(#shadow)" />
  <text x="200" y="200" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="52" font-weight="bold" fill="#ffffff" text-anchor="middle" dominant-baseline="middle">${initials}</text>
  <path d="M 100 460 C 100 340, 300 340, 300 460 Z" fill="white" opacity="0.25" />
  <circle cx="340" cy="80" r="40" fill="${palette.accent}" opacity="0.4" />
  <circle cx="60" cy="420" r="30" fill="${palette.accent}" opacity="0.3" />
</svg>`;
}

const PROFILES_DATA = [
  // Delhi (8)
  {
    id: "profile_001",
    name: "Aarav Sharma",
    age: 22,
    city: "Delhi",
    college: "University of Delhi",
    bio: "Coffee enthusiast, amateur photographer and always looking for a new street food joint to explore.",
    interests: ["Photography", "Travel", "Music", "Coffee"],
  },
  {
    id: "profile_002",
    name: "Ananya Roy",
    age: 21,
    city: "Delhi",
    college: "Lady Shri Ram College",
    bio: "Literature major who quotes classics at odd hours. Let's debate plot twists over iced chai.",
    interests: ["Books", "Writing", "Art", "Coffee"],
  },
  {
    id: "profile_003",
    name: "Rohan Gupta",
    age: 24,
    city: "Delhi",
    college: "Delhi Technological University",
    bio: "Tech nerd by day, indie-rock guitarist by night. Looking for someone to attend gigs with.",
    interests: ["Music", "Coding", "Concerts", "Gaming"],
  },
  {
    id: "profile_004",
    name: "Meera Patel",
    age: 23,
    city: "Delhi",
    college: "Jawaharlal Nehru University",
    bio: "Passionate about policy, hiking, and finding the calmest parks in the middle of chaos.",
    interests: ["Hiking", "Politics", "Yoga", "Nature"],
  },
  {
    id: "profile_005",
    name: "Kabir Mehta",
    age: 22,
    city: "Delhi",
    college: "Shaheed Sukhdev College",
    bio: "Aspiring entrepreneur and tennis player. Always up for 6 AM weekend sprints.",
    interests: ["Fitness", "Tennis", "Startups", "Podcasts"],
  },
  {
    id: "profile_006",
    name: "Diya Sengupta",
    age: 20,
    city: "Delhi",
    college: "Miranda House",
    bio: "Documenting heritage walks across Old Delhi. Curator of vintage playlists.",
    interests: ["History", "Photography", "Art", "Foodie"],
  },
  {
    id: "profile_007",
    name: "Siddharth Rao",
    age: 25,
    city: "Delhi",
    college: "Faculty of Management Studies",
    bio: "Consultant learning to cook Italian. Tell me your top 3 comfort movies.",
    interests: ["Cooking", "Cinema", "Running", "Travel"],
  },
  {
    id: "profile_008",
    name: "Riya Verma",
    age: 21,
    city: "Delhi",
    college: "Amity University",
    bio: "Fashion design student obsessing over pastel colors and pottery workshops.",
    interests: ["Fashion", "Pottery", "Design", "Music"],
  },

  // Mumbai (5)
  {
    id: "profile_009",
    name: "Priya Deshmukh",
    age: 22,
    city: "Mumbai",
    college: "St. Xavier's College",
    bio: "Marine Drive sunsets, jazz bars, and monsoon walks. Looking for spontaneous soul.",
    interests: ["Jazz", "Beaches", "Poetry", "Cinema"],
  },
  {
    id: "profile_010",
    name: "Aditya Joshi",
    age: 24,
    city: "Mumbai",
    college: "VJTI Mumbai",
    bio: "Fintech engineer, vinyl collector, and competitive board gamer. Bring your Catan skills.",
    interests: ["Board Games", "Tech", "Vinyl", "Coffee"],
  },
  {
    id: "profile_011",
    name: "Tanvi Kulkarni",
    age: 23,
    city: "Mumbai",
    college: "NMIMS Mumbai",
    bio: "Brand strategist who lives for weekend bake-offs and stand-up comedy specials.",
    interests: ["Baking", "Comedy", "Marketing", "Travel"],
  },
  {
    id: "profile_012",
    name: "Varun Merchant",
    age: 25,
    city: "Mumbai",
    college: "HR College of Commerce",
    bio: "Scuba certified, sneakerhead, and trying to master sourdough baking. Say hi!",
    interests: ["Scuba Diving", "Sneakers", "Baking", "Fitness"],
  },
  {
    id: "profile_013",
    name: "Natasha Fernandez",
    age: 22,
    city: "Mumbai",
    college: "Sophia College",
    bio: "Visual artist sketching everyday Bandra life. Dog lover (will pet every dog).",
    interests: ["Art", "Illustration", "Dogs", "Cafes"],
  },

  // Bangalore (5)
  {
    id: "profile_014",
    name: "Vikram Nair",
    age: 23,
    city: "Bangalore",
    college: "IIIT Bangalore",
    bio: "Building distributed systems and cycling through Cubbon Park on Sunday mornings.",
    interests: ["Cycling", "Coding", "Open Source", "Craft Beer"],
  },
  {
    id: "profile_015",
    name: "Ishita Hegde",
    age: 21,
    city: "Bangalore",
    college: "Christ University",
    bio: "Psychology student, passionate about mental health advocacy and filter coffee culture.",
    interests: ["Psychology", "Yoga", "Reading", "Coffee"],
  },
  {
    id: "profile_016",
    name: "Karthik Reddy",
    age: 24,
    city: "Bangalore",
    college: "BMS College of Engineering",
    bio: "Product designer, bad ukulele player, and weekend camper. Let's swap Spotify blends.",
    interests: ["UI/UX", "Ukulele", "Camping", "Design"],
  },
  {
    id: "profile_017",
    name: "Shreya Sundaram",
    age: 22,
    city: "Bangalore",
    college: "Mount Carmel College",
    bio: "Contemporary dancer and plant mom. Can probably beat you in badminton.",
    interests: ["Dance", "Badminton", "Gardening", "Music"],
  },
  {
    id: "profile_018",
    name: "Nikhil Bhat",
    age: 25,
    city: "Bangalore",
    college: "RV College of Engineering",
    bio: "Full stack developer running marathons. Believes pineapple on pizza is underrated.",
    interests: ["Running", "Marathon", "Tech", "Cooking"],
  },

  // Chennai (3)
  {
    id: "profile_019",
    name: "Madhav Raman",
    age: 23,
    city: "Chennai",
    college: "IIT Madras",
    bio: "Aerospace engineer dreaming of rockets. Carnatic music and chess on lazy weekends.",
    interests: ["Space", "Chess", "Classical Music", "Science"],
  },
  {
    id: "profile_020",
    name: "Deepa Subramanian",
    age: 22,
    city: "Chennai",
    college: "Stella Maris College",
    bio: "Food stylist and photographer. Marina Beach walks and spicy podi dosa enthusiast.",
    interests: ["Food Photography", "Beaches", "Writing", "Foodie"],
  },
  {
    id: "profile_021",
    name: "Ashwin Balaji",
    age: 24,
    city: "Chennai",
    college: "Anna University",
    bio: "Architect who loves sustainable building and pottery. Seeking fellow gallery hoppers.",
    interests: ["Architecture", "Pottery", "Sustainability", "Art"],
  },

  // Pune (3)
  {
    id: "profile_022",
    name: "Sanjana Gokhale",
    age: 21,
    city: "Pune",
    college: "Fergusson College",
    bio: "Trekking through Sahyadris every monsoon. Acoustic covers and warm chai.",
    interests: ["Trekking", "Guitar", "Singing", "Nature"],
  },
  {
    id: "profile_023",
    name: "Neil Kadam",
    age: 23,
    city: "Pune",
    college: "COEP Pune",
    bio: "Robotics geek, motorsport fan, and Formula 1 fanatic. Sunday race days are sacred.",
    interests: ["Motorsport", "Robotics", "Formula 1", "Gaming"],
  },
  {
    id: "profile_024",
    name: "Pooja Sawant",
    age: 24,
    city: "Pune",
    college: "Symbiosis Institute",
    bio: "Journalist telling untold city stories. Big fan of thrifting and indie bookstores.",
    interests: ["Journalism", "Thrifting", "Books", "Travel"],
  },

  // Hyderabad (3)
  {
    id: "profile_025",
    name: "Tarun Varma",
    age: 24,
    city: "Hyderabad",
    college: "BITS Pilani Hyderabad",
    bio: "Data scientist trying to teach AI good humor. Biryani connoisseur and squash player.",
    interests: ["Data Science", "Squash", "Biryani", "AI"],
  },
  {
    id: "profile_026",
    name: "Keerthi Rao",
    age: 22,
    city: "Hyderabad",
    college: "Osmania University",
    bio: "Biotech researcher, avid stargazer, and classical violinist.",
    interests: ["Astronomy", "Violin", "Science", "Nature"],
  },
  {
    id: "profile_027",
    name: "Pranav Raju",
    age: 23,
    city: "Hyderabad",
    college: "CBIT Hyderabad",
    bio: "Game developer building retro pixel games. Coffee snob and synthwave collector.",
    interests: ["Game Dev", "Retro Gaming", "Coffee", "Synthwave"],
  },

  // Other cities (3)
  {
    id: "profile_028",
    name: "Alisha Khan",
    age: 22,
    city: "Kolkata",
    college: "St. Xavier's Kolkata",
    bio: "Documentary filmmaker roaming around Park Street. Chai, conversations, and jazz.",
    interests: ["Cinema", "Documentary", "Photography", "Jazz"],
  },
  {
    id: "profile_029",
    name: "Rahul Das",
    age: 24,
    city: "Jaipur",
    college: "MNIT Jaipur",
    bio: "Civil engineer, heritage conservationist, and desert camper under the stars.",
    interests: ["Camping", "History", "Heritage", "Travel"],
  },
  {
    id: "profile_030",
    name: "Maya Chawla",
    age: 21,
    city: "Chandigarh",
    college: "Panjab University",
    bio: "Urban planner, skateboarder, and matcha latte lover. Exploring geometric architecture.",
    interests: ["Skateboarding", "Architecture", "Design", "Urbanism"],
  },
];

// Predetermined incoming likes to current user:
// Profile 3, 8, 15, 21, 29
const INCOMING_LIKES_PROFILE_IDS = [
  "profile_003", // Rohan Gupta
  "profile_008", // Riya Verma
  "profile_015", // Ishita Hegde
  "profile_021", // Ashwin Balaji
  "profile_029", // Rahul Das
];

async function main() {
  console.log("🌱 Starting Coy Discover database seeding...");

  // 1. Ensure public/profiles directory exists and write avatars
  const profilesDir = path.join(process.cwd(), "public", "profiles");
  if (!fs.existsSync(profilesDir)) {
    fs.mkdirSync(profilesDir, { recursive: true });
  }

  // Create demo user avatar
  fs.writeFileSync(
    path.join(profilesDir, "profile-demo.svg"),
    generateSvgAvatar("Alex Morgan", 0)
  );

  // Create avatars for each profile
  PROFILES_DATA.forEach((profile, idx) => {
    const filename = `profile-${String(idx + 1).padStart(2, "0")}.svg`;
    fs.writeFileSync(
      path.join(profilesDir, filename),
      generateSvgAvatar(profile.name, idx + 1)
    );
  });
  console.log("📸 Generated 31 local SVG profile avatars in public/profiles/");

  // 2. Upsert Demo User
  await prisma.user.upsert({
    where: { id: CURRENT_USER_ID },
    update: {
      name: "Alex Morgan",
      age: 23,
      photo: "/profiles/profile-demo.svg",
      bio: "Exploring the world one coffee shop and book at a time.",
      city: "Delhi",
      college: "IIT Delhi",
    },
    create: {
      id: CURRENT_USER_ID,
      name: "Alex Morgan",
      age: 23,
      photo: "/profiles/profile-demo.svg",
      bio: "Exploring the world one coffee shop and book at a time.",
      city: "Delhi",
      college: "IIT Delhi",
    },
  });
  console.log("👤 Created/updated demo user (demo-user)");

  // 3. Upsert Interests
  const allInterests = Array.from(
    new Set(PROFILES_DATA.flatMap((p) => p.interests))
  );

  const interestMap = new Map<string, string>();
  for (const name of allInterests) {
    const interest = await prisma.interest.upsert({
      where: { name },
      update: {},
      create: { name },
    });
    interestMap.set(name, interest.id);
  }
  console.log(`🏷️  Upserted ${allInterests.length} unique interests`);

  // 4. Upsert Profiles and their Interests
  for (let i = 0; i < PROFILES_DATA.length; i++) {
    const data = PROFILES_DATA[i];
    const photoUrl = `/profiles/profile-${String(i + 1).padStart(2, "0")}.svg`;

    const user = await prisma.user.upsert({
      where: { id: data.id },
      update: {
        name: data.name,
        age: data.age,
        photo: photoUrl,
        bio: data.bio,
        city: data.city,
        college: data.college,
      },
      create: {
        id: data.id,
        name: data.name,
        age: data.age,
        photo: photoUrl,
        bio: data.bio,
        city: data.city,
        college: data.college,
      },
    });

    // Delete existing interests for this user and recreate for idempotency
    await prisma.userInterest.deleteMany({
      where: { userId: user.id },
    });

    for (const interestName of data.interests) {
      const interestId = interestMap.get(interestName);
      if (interestId) {
        await prisma.userInterest.create({
          data: {
            userId: user.id,
            interestId,
          },
        });
      }
    }
  }
  console.log(`👥 Upserted ${PROFILES_DATA.length} profiles with interests`);

  // 5. Seed predetermined incoming likes to the current user
  for (const profileId of INCOMING_LIKES_PROFILE_IDS) {
    await prisma.swipe.upsert({
      where: {
        fromUserId_toUserId: {
          fromUserId: profileId,
          toUserId: CURRENT_USER_ID,
        },
      },
      update: {
        direction: SwipeDirection.LIKE,
      },
      create: {
        fromUserId: profileId,
        toUserId: CURRENT_USER_ID,
        direction: SwipeDirection.LIKE,
      },
    });
  }
  console.log(
    `❤️  Seeded ${INCOMING_LIKES_PROFILE_IDS.length} predetermined incoming likes to ${CURRENT_USER_ID}`
  );

  console.log("✅ Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
