import { getAdminUsers } from "@/lib/actions/admin";
import { AdminUsersTable } from "@/components/admin/users-table";

export const metadata = { title: "Usuários | Admin" };

export default async function AdminUsersPage() {
  const users = await getAdminUsers();

  return (
    <div className="space-y-6 admin-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-[#0a1626] tracking-tight">Usuários</h1>
        <p className="mt-1 text-sm text-[rgba(10,22,38,0.6)]">{users.length} conta(s) registrada(s) no sistema.</p>
      </div>

      <div className="admin-card overflow-hidden">
        <AdminUsersTable users={users} />
      </div>
    </div>
  );
}
