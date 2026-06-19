"use client";
import React, { useState } from "react";
import { createLink } from "@/lib/api";

export default function NewLinkForm({ user, links, setLinks }) {
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
        type="text"
        placeholder="Título"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="aero-input w-full"
        required
      />
      <input
        type="url"
        placeholder="https://..."
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="aero-input w-full"
        required
      />
      <button type="submit" className="btn-green w-full">
        Adicionar Link
      </button>
    </form>
  );
}
