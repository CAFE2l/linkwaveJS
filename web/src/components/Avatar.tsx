import React from 'react';

type AvatarProps = {
  src?: string | null;
  alt?: string;
  size?: number;
};

export default function Avatar({ src, alt = 'Avatar', size = 96 }: AvatarProps) {
  const fallback = `https://ui-avatars.com/api/?name=${encodeURIComponent(alt)}&background=111827&color=93c5fd&size=128`;
  return (
    <div style={{ width: size, height: size }} className="rounded-full overflow-hidden shadow-lg">
      <img src={src ?? fallback} alt={alt} className="w-full h-full object-cover" />
    </div>
  );
}
