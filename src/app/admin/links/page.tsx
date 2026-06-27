import { getAdminLinks } from "@/lib/actions/admin";
import { AdminLinksTable } from "@/components/admin/links-table";

export const metadata = { title: "Links | Admin" };

export default async function AdminLinksPage() {
  const links = await getAdminLinks();

  return (
    <div className="space-y-6 admin-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Links</h1>
        <p className="mt-1 text-sm text-slate-400">{links.length} link(s) mais recentes na plataforma.</p>
      </div>

      <div className="admin-card overflow-hidden">
        <AdminLinksTable links={links} />
      </div>
    </div>
  );
}
