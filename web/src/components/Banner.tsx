import React from 'react';

type BannerProps = {
  src?: string | null;
  height?: number;
};

export default function Banner({ src, height = 200 }: BannerProps) {
  const fallback = '/banner-fallback.jpg';
  return (
    <div style={{ height }} className="w-full overflow-hidden rounded-xl bg-gradient-to-r from-slate-800 to-slate-900">
      <img src={src ?? fallback} alt="Banner" className="w-full h-full object-cover" />
    </div>
  );
}
