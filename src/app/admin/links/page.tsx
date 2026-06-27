import { getAdminLinks } from "@/lib/actions/admin";
import { AdminLinksTable } from "@/components/admin/links-table";

export const metadata = { title: "Links | Admin" };

export default async function AdminLinksPage() {
  const links = await getAdminLinks();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-ocean">Gerenciamento de links</h1>
        <p className="mt-1 text-sm font-semibold text-ocean/60">{links.length} link(s) mais recentes na plataforma.</p>
      </div>

      <div className="glass-card-strong overflow-hidden">
        <AdminLinksTable links={links} />
      </div>
    </div>
  );
}
