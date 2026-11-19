export interface MatchProfile {
  id: string;
  name: string;
  age: number;
  photo: string;
  city: string;
  bio: string;
  interests: string[];
}

export interface Match {
  id: string;
  matchedAt: string;
  profile: MatchProfile;
}

export interface MatchesResponse {
  matches: Match[];
}
