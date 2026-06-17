import { getAdminUsers } from "@/lib/actions/admin";
import { AdminUsersTable } from "@/components/admin/users-table";

export const metadata = { title: "Usuários | Admin" };

export default async function AdminUsersPage() {
  const users = await getAdminUsers();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-foreground">Usuários</h1>
        <p className="mt-1 text-sm text-muted">{users.length} usuário(s) registrado(s).</p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-[rgba(0,180,255,0.06)] dark:bg-[rgba(3,10,25,0.5)]">
        <AdminUsersTable users={users} />
      </div>
    </div>
  );
}
