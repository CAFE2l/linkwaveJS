"use client";
import React, { useState } from "react";
import NewLinkForm from "./NewLinkForm";
import LinkCard from "./LinkCard";

export default function DashboardClient({ user, links: initialLinks }) {
  const [links, setLinks] = useState(initialLinks);

  return (
    <main className="container mx-auto px-4 py-8 max-w-6xl">
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
