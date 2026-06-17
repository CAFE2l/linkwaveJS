import React from 'react';

type LinkButtonProps = {
  title: string;
  url: string;
  icon?: string | null;
};

export default function LinkButton({ title, url, icon }: LinkButtonProps) {
  return (
    <a href={url} target="_blank" rel="noreferrer" className="block w-full rounded-lg p-4 bg-slate-900/60 backdrop-blur-md border border-slate-700 hover:scale-[1.02] transition">
      <div className="flex items-center gap-4">
        {icon ? <img src={icon} alt="icon" className="w-10 h-10 object-contain rounded" /> : <div className="w-10 h-10 rounded bg-slate-700" />}
        <span className="text-white font-medium">{title}</span>
      </div>
    </a>
  );
}
