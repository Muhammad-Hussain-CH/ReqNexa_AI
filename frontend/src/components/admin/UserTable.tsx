import { useEffect, useState } from "react";
import { useAdminStore } from "../../stores/admin.store";

export default function UserTable() {
  const { users, usersLoading, usersError, loadUsers, changeUserRole, changeUserStatus } = useAdminStore();
  const [q, setQ] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => { loadUsers({ q, role, status }); }, [q, role, status, loadUsers]);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <input className="px-3 py-2 border rounded" placeholder="Search users" value={q} onChange={(e) => setQ(e.target.value)} />
        <select className="px-3 py-2 border rounded" value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="manager">Manager</option>
          <option value="developer">Developer</option>
          <option value="qa">QA</option>
          <option value="client">Client</option>
        </select>
        <select className="px-3 py-2 border rounded" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>
      <div className="rounded border bg-white overflow-x-auto">
        {usersLoading && <div className="p-4">Loading...</div>}
        {usersError && !usersLoading && <div className="p-4 text-red-600">{usersError}</div>}
        {!usersLoading && !usersError && (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="p-2 text-left">Name</th>
                <th className="p-2 text-left">Email</th>
                <th className="p-2 text-left">Role</th>
                <th className="p-2 text-left">Status</th>
                <th className="p-2 text-left">Projects</th>
                <th className="p-2 text-left">Created</th>
                <th className="p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b">
                  <td className="p-2">{u.name}</td>
                  <td className="p-2">{u.email}</td>
                  <td className="p-2">
                    <select className="px-2 py-1 border rounded" value={u.role} onChange={(e) => changeUserRole(u.id, e.target.value)}>
                      <option value="admin">Admin</option>
                      <option value="manager">Manager</option>
                      <option value="developer">Developer</option>
                      <option value="qa">QA</option>
                      <option value="client">Client</option>
                    </select>
                  </td>
                  <td className="p-2">
                    <label className="inline-flex items-center gap-2 text-sm">
                      <input type="checkbox" checked={u.status === "active"} onChange={(e) => changeUserStatus(u.id, e.target.checked)} />
                      {u.status === "active" ? "Active" : "Inactive"}
                    </label>
                  </td>
                  <td className="p-2">{u.project_count}</td>
                  <td className="p-2">{new Date(u.created_at).toLocaleDateString()}</td>
                  <td className="p-2">
                    <button className="px-3 py-1 rounded border">View Activity</button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr><td className="p-4 text-center text-gray-600" colSpan={7}>No users found</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

