export type SwipeDirection = "LIKE" | "PASS";

export interface SwipeRequest {
  profileId: string;
  direction: SwipeDirection;
}

export interface SwipeResponse {
  success: boolean;
  swipe: {
    direction: SwipeDirection;
  };
  matched: boolean;
  match?: {
    id: string;
    profile: {
      id: string;
      name: string;
      age: number;
      photo: string;
    };
  };
}
