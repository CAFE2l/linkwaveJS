import React from 'react';
import { supabase } from '@/lib/supabaseClient';
import Avatar from '@/components/Avatar';
import Banner from '@/components/Banner';
import LinkButton from '@/components/LinkButton';

type Props = { params: { username: string } };

export default async function Page({ params }: Props) {
  const { username } = params;
  // Fetch profile
  const { data: profiles } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', username)
    .limit(1)
    .maybeSingle();

  if (!profiles) {
    return <div className="min-h-screen flex items-center justify-center">Perfil não encontrado</div>;
  }

  const { data: links } = await supabase
    .from('links')
    .select('*')
    .eq('user_id', profiles.id)
    .order('position', { ascending: true });

  return (
    <main className="min-h-screen bg-slate-900 text-white py-10">
      <div className="container mx-auto max-w-xl">
        <Banner src={profiles.banner_url} />
        <div className="-mt-12 text-center">
          <div className="mx-auto w-28 h-28">
            <Avatar src={profiles.avatar_url} alt={profiles.name ?? profiles.username} size={112} />
          </div>
          <h1 className="text-2xl font-bold mt-4">{profiles.name ?? profiles.username}</h1>
          <p className="text-slate-300 mt-2">{profiles.bio}</p>
        </div>

        <div className="mt-8 space-y-4">
          {links?.map((l: any) => (
            <LinkButton key={l.id} title={l.title} url={l.url} icon={l.icon} />
          ))}
        </div>
      </div>
    </main>
  );
}
