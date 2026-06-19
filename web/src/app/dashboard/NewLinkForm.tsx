"use client";
import React, { useState } from "react";
import { createLink } from "@/lib/api";

interface Link {
  id: string;
  title: string;
  url: string;
  icon?: string | null;
}

interface User {
  id: string;
  username: string;
}

interface Props {
  user: User;
  links: Link[];
  setLinks: React.Dispatch<React.SetStateAction<Link[]>>;
}

export default function NewLinkForm({ user, links, setLinks }: Props) {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !url) return;

    const newLink = await createLink({ userId: user.id, title, url });
    setLinks([...links, newLink]);
    setTitle("");
    setUrl("");
  };

  return (
    <form onSubmit={handleSubmit} className="glass p-6 space-y-4">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Título"
        className="aero-input w-full"
        required
      />
      <input
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="https://..."
        className="aero-input w-full"
        required
      />
      <button type="submit" className="btn-green w-full">
        Adicionar Link
      </button>
    </form>
  );
}
