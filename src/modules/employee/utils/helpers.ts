export function generateEmployeeId(): string {
  return `emp_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
}
