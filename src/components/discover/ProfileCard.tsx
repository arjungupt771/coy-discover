"use client";

import { useState } from "react";
import { MapPin, GraduationCap } from "lucide-react";
import { Profile } from "@/types/profile";

interface ProfileCardProps {
  profile: Profile;
  className?: string;
}

export default function ProfileCard({ profile, className = "" }: ProfileCardProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <div
      className={`relative overflow-hidden rounded-3xl bg-white shadow-xl ${className}`}
      style={{ aspectRatio: "3/4" }}
    >
      {/* Profile Image */}
      <div className="absolute inset-0">
        {!imageError ? (
          <img
            src={profile.photo}
            alt={profile.name}
            className="h-full w-full object-cover"
            onError={() => setImageError(true)}
            draggable={false}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-pink-300 to-purple-400">
            <span className="text-6xl font-bold text-white/80">
              {profile.name.charAt(0)}
            </span>
          </div>
        )}
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

      {/* Profile Info */}
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <div className="mb-2">
          <h2 className="text-2xl font-bold text-white">
            {profile.name}, {profile.age}
          </h2>
        </div>

        {/* Location */}
        <div className="mb-1 flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5 text-white/70" />
          <span className="text-sm text-white/80">{profile.city}</span>
        </div>

        {/* College */}
        {profile.college && (
          <div className="mb-3 flex items-center gap-1.5">
            <GraduationCap className="h-3.5 w-3.5 text-white/70" />
            <span className="text-sm text-white/80">{profile.college}</span>
          </div>
        )}

        {/* Bio */}
        <p className="mb-3 text-sm leading-relaxed text-white/90 line-clamp-2">
          {profile.bio}
        </p>

        {/* Interests */}
        <div className="flex flex-wrap gap-1.5">
          {profile.interests.slice(0, 5).map((interest) => (
            <span
              key={interest}
              className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm"
            >
              {interest}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
