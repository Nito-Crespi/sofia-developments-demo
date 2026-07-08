import type { UserRole } from "../../../data/usersDb";

export type EmployeeRecord = {
  id: string;
  fullName: string;
  username: string;
  role: UserRole;
  email: string;
  phone: string;
  department: string;
  position: string;
};

export const EMPLOYEES_DB: EmployeeRecord[] = [
  {
    id: "emp-001",
    fullName: "Nicolas Perez",
    username: "nito",
    role: "admin",
    email: "nicolas.perez@company.local",
    phone: "+54 11 5555 1001",
    department: "Management",
    position: "Administrator",
  },
  {
    id: "emp-002",
    fullName: "Tomas Gomez",
    username: "toto",
    role: "finance",
    email: "tomas.gomez@company.local",
    phone: "+54 11 5555 1002",
    department: "Finance",
    position: "Finance Analyst",
  },
  {
    id: "emp-003",
    fullName: "Santiago Diaz",
    username: "santi",
    role: "engineer",
    email: "santiago.diaz@company.local",
    phone: "+54 11 5555 1003",
    department: "Engineering",
    position: "Site Engineer",
  },
];

export function getEmployees() {
  return EMPLOYEES_DB;
}

export function getEmployeeById(id: string) {
  return EMPLOYEES_DB.find((employee) => employee.id === id) ?? null;
}
