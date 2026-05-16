export type METRIC_COLOR_TYPE = "green" | "red" | "black";

export type METRICS_CARD_PROPS = {
  id?: number;
  label?: string;
  title?: string;
  currency?: string;
  subtitle?: string;
  type?: METRIC_COLOR_TYPE;
};

export const METRIC_COLOR_MAP: Record<METRIC_COLOR_TYPE, string> = {
  green: "#10A372",
  red: "#FF4D4F",
  black: "#000000",
};
