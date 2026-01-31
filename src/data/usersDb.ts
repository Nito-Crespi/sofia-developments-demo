export type UserRole = "admin" | "finance" | "engineer";

export type MenuKey =
  | "dashboard"
  | "finance"
  | "projects"
  | "users"
  | "settings";

export type UserRecord = {
  username: string;
  password: string;
  role: UserRole;
  displayName: string;
  menus: MenuKey[]; // top-level permisos
};

export const USERS_DB: UserRecord[] = [
  {
    username: "nito",
    password: "root",
    role: "admin",
    displayName: "Admin",
    menus: ["dashboard", "finance", "projects", "users", "settings"],
  },
  {
    username: "toto",
    password: "root",
    role: "finance",
    displayName: "Finance",
    menus: ["dashboard", "finance", "users", "settings"],
  },
  {
    username: "santi",
    password: "root",
    role: "engineer",
    displayName: "Engineer",
    menus: ["dashboard", "projects", "settings"],
  },
];

export function findUser(username: string) {
  return USERS_DB.find((u) => u.username === username) ?? null;
}

export function validateCredentials(username: string, password: string) {
  const user = findUser(username);
  if (!user) return null;
  if (user.password !== password) return null;
  return user;
}
