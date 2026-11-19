export interface Profile {
  id: string;
  name: string;
  age: number;
  photo: string;
  bio: string;
  city: string;
  college: string | null;
  interests: string[];
}

export interface ProfileWithInterests {
  id: string;
  name: string;
  age: number;
  photo: string;
  bio: string;
  city: string;
  college: string | null;
  interests: {
    interest: {
      id: string;
      name: string;
    };
  }[];
}
