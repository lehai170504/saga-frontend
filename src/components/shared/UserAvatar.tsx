import React from "react";

interface UserAvatarProps {
  name: string;
  className?: string;
  bgColorClass?: string;
}

const getInitials = (name: string) => {
  const parts = name.split(" ");
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

export function UserAvatar({
  name,
  className = "w-9 h-9",
  bgColorClass = "bg-orange-500",
}: UserAvatarProps) {
  return (
    <div
      className={`rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 ${bgColorClass} ${className}`}
    >
      {getInitials(name)}
    </div>
  );
}
