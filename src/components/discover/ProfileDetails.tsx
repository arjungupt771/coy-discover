"use client";

import { MapPin, GraduationCap } from "lucide-react";
import { Profile } from "@/types/profile";

interface ProfileDetailsProps {
  profile: Profile;
}

export default function ProfileDetails({ profile }: ProfileDetailsProps) {
  return (
    <div className="space-y-3 p-4">
      <h2 className="text-2xl font-bold text-gray-900">
        {profile.name}, {profile.age}
      </h2>

      <div className="flex items-center gap-1.5 text-gray-500">
        <MapPin className="h-4 w-4" />
        <span className="text-sm">{profile.city}</span>
      </div>

      {profile.college && (
        <div className="flex items-center gap-1.5 text-gray-500">
          <GraduationCap className="h-4 w-4" />
          <span className="text-sm">{profile.college}</span>
        </div>
      )}

      <p className="text-sm text-gray-600 leading-relaxed">{profile.bio}</p>

      <div className="flex flex-wrap gap-2">
        {profile.interests.map((interest) => (
          <span
            key={interest}
            className="rounded-full bg-pink-50 px-3 py-1.5 text-xs font-medium text-pink-600"
          >
            {interest}
          </span>
        ))}
      </div>
    </div>
  );
}
