import { getAdminUsers } from "@/lib/actions/admin";
import { AdminUsersTable } from "@/components/admin/users-table";

export const metadata = { title: "Usuários | Admin" };

export default async function AdminUsersPage() {
  const users = await getAdminUsers();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-ocean">Gerenciamento de usuários</h1>
        <p className="mt-1 text-sm font-semibold text-ocean/60">{users.length} conta(s) registrada(s) no sistema.</p>
      </div>

      <div className="glass-card-strong overflow-hidden">
        <AdminUsersTable users={users} />
      </div>
    </div>
  );
}
