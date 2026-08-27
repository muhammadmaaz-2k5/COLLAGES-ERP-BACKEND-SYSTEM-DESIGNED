const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export class AuthAPI {
  static async login(email: string, password = "Password123!") {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    return res.json();
  }

  static async getMe(token: string) {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.json();
  }

  static async getRoles(token: string) {
    const res = await fetch(`${API_BASE}/rbac/roles`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.json();
  }

  static async getPermissions(token: string) {
    const res = await fetch(`${API_BASE}/rbac/permissions`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.json();
  }

  static async grantPermission(token: string, roleCode: string, permissionCode: string) {
    const res = await fetch(`${API_BASE}/rbac/permissions/grant`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ roleCode, permissionCode }),
    });
    return res.json();
  }

  static async revokePermission(token: string, roleCode: string, permissionCode: string) {
    const res = await fetch(`${API_BASE}/rbac/permissions/revoke`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ roleCode, permissionCode }),
    });
    return res.json();
  }

  static async getAuditLogs(token: string) {
    const res = await fetch(`${API_BASE}/rbac/audit-logs?limit=50`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.json();
  }
}
