import dayjs from "dayjs";

/**
 * Formatea un número como moneda en formato USD con localización española
 * @param value - Valor numérico a formatear
 * @returns String formateado como moneda
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(value);
}

/**
 * Formatea una fecha ISO a formato DD/MM/YYYY
 * @param date - Fecha en formato ISO string
 * @returns String formateado como fecha
 */
export function formatDate(date: string): string {
  return dayjs(date).format("DD/MM/YYYY");
}

/**
 * Formatea una fecha ISO a formato DD/MM/YYYY HH:mm
 * @param date - Fecha en formato ISO string
 * @returns String formateado como fecha y hora
 */
export function formatDateTime(date: string): string {
  return dayjs(date).format("DD/MM/YYYY HH:mm");
}
