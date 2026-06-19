export async function createLink({
  userId,
  title,
  url,
}: {
  userId: string;
  title: string;
  url: string;
}) {
  // Replace with Supabase insert
  return { id: Date.now().toString(), title, url, icon: null };
}
