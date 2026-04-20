const TOKEN_KEY = "datavex_auth_token";
const USER_KEY = "datavex_auth_user";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  employeeId?: string;
};

export type DatabaseUser = AuthUser & {
  createdAt: string;
  isActive: boolean;
};

export const getBackendBaseUrl = (): string =>
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

export const authStorage = {
  getToken(): string | null {
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem(TOKEN_KEY);
  },
  setSession(token: string, user: AuthUser): void {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(TOKEN_KEY, token);
    window.localStorage.setItem(USER_KEY, JSON.stringify(user));
  },
  clearSession(): void {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(TOKEN_KEY);
    window.localStorage.removeItem(USER_KEY);
  },
  getUser(): AuthUser | null {
    if (typeof window === "undefined") return null;
    const raw = window.localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as AuthUser;
    } catch {
      return null;
    }
  }
};

export const fetchMe = async (): Promise<AuthUser | null> => {
  const token = authStorage.getToken();
  if (!token) return null;

  try {
    const response = await fetch(`${getBackendBaseUrl()}/api/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if (!response.ok) return null;
    const data = await response.json();
    return data.user as AuthUser;
  } catch {
    return null;
  }
};

export const fetchUsers = async (): Promise<DatabaseUser[]> => {
  const token = authStorage.getToken();
  if (!token) {
    throw new Error("Please sign in to view database users");
  }

  const response = await fetch(`${getBackendBaseUrl()}/api/auth/users`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to load users");
  }

  return data.users as DatabaseUser[];
};

export const createEmployee = async (employeeData: {
  employeeId: string;
  name: string;
  email: string;
  password: string;
}): Promise<any> => {
  const token = authStorage.getToken();
  if (!token) {
    throw new Error("Please sign in as admin");
  }

  const response = await fetch(`${getBackendBaseUrl()}/api/auth/employees`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(employeeData),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to create employee");
  }

  return data;
};

export const deleteEmployee = async (employeeId: string): Promise<void> => {
  const token = authStorage.getToken();
  if (!token) {
    throw new Error("Please sign in as admin");
  }

  const response = await fetch(`${getBackendBaseUrl()}/api/auth/employees/${employeeId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to delete employee");
  }
};

