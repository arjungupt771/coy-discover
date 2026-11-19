export const appConfig = {
  name: "Coy Discover",
  description: "A swipe-based social discovery application",
  currentUserId: "demo-user",
  feed: {
    batchSize: 10,
  },
  swipe: {
    threshold: 100,
    animationDuration: 0.3,
    exitDistance: 1000,
    exitRotation: 20,
    elasticity: 0.8,
  },
  card: {
    nextCardScale: 0.95,
    nextCardOpacity: 0.8,
    nextCardYOffset: 10,
  },
} as const;
