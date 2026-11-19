export interface ApiError {
  error: string;
}

export interface FeedResponse {
  profiles: import("./profile").Profile[];
  totalRemaining: number;
}

export type ApiResponse<T> = T | ApiError;
