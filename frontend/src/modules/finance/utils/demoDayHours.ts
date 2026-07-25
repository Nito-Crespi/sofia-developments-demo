import type { Dayjs } from "dayjs";

export const STANDARD_DAY_HOURS = 8;

/** Time assumed lost due to workers eating */
export const MEAL_DEDUCTION_HOURS = 0.5;

/** Time assumed lost due to early leave(TODO replace this w a func) */
export const RAIN_EARLY_LEAVE_HOURS = 2;

export type DemoDayHoursInput = {
  start: Dayjs;
  end: Dayjs;
  rain: boolean;
  mealUsed: boolean;
};

export type DemoDayHoursResult = {
  rawHours: number;
  afterRainHours: number;
  rainApplied: boolean;
  afterMealHours: number;
  mealApplied: boolean;
  regularHours: number;
  overtimeHours: number;
};

function clampNonNegative(n: number): number {
  return Math.max(0, n);
}

export function computeDemoDayHours(input: DemoDayHoursInput): DemoDayHoursResult {
  const { start, end, rain, mealUsed } = input;
  const rawMinutes = end.diff(start, "minute");
  const rawHours = clampNonNegative(rawMinutes / 60);

  const afterRainHours = rain
    ? clampNonNegative(rawHours - RAIN_EARLY_LEAVE_HOURS)
    : rawHours;

  const afterMealHours = mealUsed
    ? clampNonNegative(afterRainHours - MEAL_DEDUCTION_HOURS)
    : afterRainHours;

  const regularHours = Math.min(afterMealHours, STANDARD_DAY_HOURS);
  const overtimeHours = Math.max(0, afterMealHours - STANDARD_DAY_HOURS);

  return {
    rawHours,
    afterRainHours,
    rainApplied: rain,
    afterMealHours,
    mealApplied: mealUsed,
    regularHours,
    overtimeHours,
  };
}
