// AdminAuthProvider.tsx

"use client"

import { createContext, useContext, type ReactNode } from "react";
import { ADMIN_ROLES, ROLE_PERMISSIONS } from "@/app/fxt/admin/dashboard/components/admin-users";

type AdminAuthContextType = {
  user: AdminUser | null;
  permissions: AdminPermissions; // Use the type we defined earlier
};

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children, user }: { children: ReactNode; user: AdminUser | null }) {
  const permissions = user ? ROLE_PERMISSIONS[user.role] : ROLE_PERMISSIONS[ADMIN_ROLES.VIEWER];

  return (
    <AdminAuthContext.Provider value={{ user, permissions }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  }
  return context;
}
