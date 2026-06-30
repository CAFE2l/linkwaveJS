import { getAdminThemes } from "@/lib/actions/admin";
import { AdminThemesTable } from "@/components/admin/themes-table";

export const metadata = { title: "Temas | Admin" };

export default async function AdminThemesPage() {
  const themes = await getAdminThemes();

  return (
    <div className="space-y-6 admin-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-[#0a1626] tracking-tight">Temas</h1>
        <p className="mt-1 text-sm text-[rgba(10,22,38,0.6)]">{themes.length} usuário(s) com personalização ativa.</p>
      </div>

      <div className="admin-card overflow-hidden">
        <AdminThemesTable themes={themes} />
      </div>
    </div>
  );
}
