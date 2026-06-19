"use client";
import React, { useState } from "react";
import NewLinkForm from "./NewLinkForm";
import LinkCard from "./LinkCard";

interface Link {
  id: string;
  title: string;
  url: string;
  icon?: string | null;
}

interface User {
  id: string;
  username: string;
  nome?: string;
  avatar?: string;
}

interface DashboardClientProps {
  user: User;
  links: Link[];
}

export default function DashboardClient({
  user,
  links: initialLinks,
}: DashboardClientProps) {
  const [links, setLinks] = useState<Link[]>(initialLinks);

  return (
    <main className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Profile Card */}
      <div className="glass p-6 mb-8 flex flex-col md:flex-row items-center gap-6">
        <img
          src={
            user.avatar ??
            `https://ui-avatars.com/api/?name=${user.nome ?? "User"}`
          }
          alt="Avatar"
          className="w-20 h-20 rounded-full avatar-ring"
        />
        <div>
          <h2 className="font-black text-2xl">@{user.username}</h2>
          <p>{user.nome ?? "Seu nome"}</p>
        </div>
      </div>

      {/* Grid: New Link Form + Link List */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <NewLinkForm user={user} links={links} setLinks={setLinks} />
        </div>
        <div className="lg:col-span-2 space-y-4">
          {links.map((link) => (
            <LinkCard key={link.id} link={link} />
          ))}
        </div>
      </div>
    </main>
  );
}
