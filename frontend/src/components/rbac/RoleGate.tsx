"use client";

import React from "react";
import { useAuthStore, type SystemRole } from "@/store/use-auth-store";

interface RoleGateProps {
  roles: SystemRole | SystemRole[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function RoleGate({ roles, children, fallback = null }: RoleGateProps) {
  const hasRole = useAuthStore((state) => state.hasRole(roles));

  if (!hasRole) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
