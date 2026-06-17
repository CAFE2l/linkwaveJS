import { Trash2 } from "lucide-react";
import { getAdminLinks } from "@/lib/actions/admin";
import { AdminLinksTable } from "@/components/admin/links-table";

export const metadata = { title: "Links | Admin" };

export default async function AdminLinksPage() {
  const links = await getAdminLinks();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-foreground">Links</h1>
        <p className="mt-1 text-sm text-muted">{links.length} link(s) criado(s) na plataforma.</p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-[rgba(0,180,255,0.06)] dark:bg-[rgba(3,10,25,0.5)]">
        <AdminLinksTable links={links} />
      </div>
    </div>
  );
}
