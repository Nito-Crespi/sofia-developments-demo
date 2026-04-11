import { create } from "zustand";
import type { EmployeeRecord } from "../data/employeesDb";
import { EMPLOYEES_DB } from "../data/employeesDb";
import { STORAGE_KEYS } from "../constants";
import { generateEmployeeId } from "../utils/helpers";

export type EmployeeFormData = Omit<EmployeeRecord, "id">;

type EmployeesState = {
  employees: EmployeeRecord[];
  getAll: () => EmployeeRecord[];
  getById: (id: string) => EmployeeRecord | null;
  create: (data: EmployeeFormData) => EmployeeRecord;
  update: (id: string, data: Partial<EmployeeFormData>) => void;
  delete: (id: string) => void;
};

function loadEmployees(): EmployeeRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.EMPLOYEES);
    if (!raw) return structuredClone(EMPLOYEES_DB);
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as EmployeeRecord[]) : structuredClone(EMPLOYEES_DB);
  } catch {
    return structuredClone(EMPLOYEES_DB);
  }
}

function saveEmployees(employees: EmployeeRecord[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(employees));
  } catch (e) {
    console.error("Error saving employees:", e);
  }
}

export const useEmployeesStore = create<EmployeesState>((set, get) => ({
  employees: loadEmployees(),

  getAll: () => get().employees,

  getById: (id) => get().employees.find((e) => e.id === id) ?? null,

  create: (data) => {
    const record: EmployeeRecord = {
      ...data,
      id: generateEmployeeId(),
    };
    const updated = [...get().employees, record];
    saveEmployees(updated);
    set({ employees: updated });
    return record;
  },

  update: (id, data) => {
    const updated = get().employees.map((e) =>
      e.id === id ? { ...e, ...data } : e,
    );
    saveEmployees(updated);
    set({ employees: updated });
  },

  delete: (id) => {
    const updated = get().employees.filter((e) => e.id !== id);
    saveEmployees(updated);
    set({ employees: updated });
  },
}));
