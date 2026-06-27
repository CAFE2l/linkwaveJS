import { getAdminThemes } from "@/lib/actions/admin";
import { AdminThemesTable } from "@/components/admin/themes-table";

export const metadata = { title: "Temas | Admin" };

export default async function AdminThemesPage() {
  const themes = await getAdminThemes();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-ocean">Temas personalizados</h1>
        <p className="mt-1 text-sm font-semibold text-ocean/60">{themes.length} usuário(s) com personalização ativa.</p>
      </div>

      <div className="glass-card-strong overflow-hidden">
        <AdminThemesTable themes={themes} />
      </div>
    </div>
  );
}
