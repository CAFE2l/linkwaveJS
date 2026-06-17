import { getAdminThemes } from "@/lib/actions/admin";
import { AdminThemesTable } from "@/components/admin/themes-table";

export const metadata = { title: "Temas | Admin" };

export default async function AdminThemesPage() {
  const themes = await getAdminThemes();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-foreground">Temas</h1>
        <p className="mt-1 text-sm text-muted">{themes.length} usuário(s) com tema personalizado.</p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-[rgba(0,180,255,0.06)] dark:bg-[rgba(3,10,25,0.5)]">
        <AdminThemesTable themes={themes} />
      </div>
    </div>
  );
}
