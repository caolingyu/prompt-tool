declare module 'lunar-javascript' {
  class Solar {
    static fromYmd(year: number, month: number, day: number): Solar;
    static fromYmdHms(year: number, month: number, day: number, hour: number, minute: number, second: number): Solar;
    static fromDate(date: Date): Solar;
    static fromJulianDay(julianDay: number): Solar;
    static fromBaZi(yearGanZhi: string, monthGanZhi: string, dayGanZhi: string, timeGanZhi: string): Solar[];
    getYear(): number;
    getMonth(): number;
    getDay(): number;
    getHour(): number;
    getMinute(): number;
    getSecond(): number;
    getJulianDay(): number;
    getLunar(): Lunar;
    toString(): string;
    toYmd(): string;
    toYmdHms(): string;
    nextYear(years: number): Solar;
    nextMonth(months: number): Solar;
    nextDay(days: number): Solar;
    nextHour(hours: number): Solar;
  }

  class Lunar {
    static fromYmdHms(year: number, month: number, day: number, hour: number, minute: number, second: number): Lunar;
    static fromYmd(year: number, month: number, day: number): Lunar;
    static fromSolar(solar: Solar): Lunar;
    static fromDate(date: Date): Lunar;
    getYear(): number;
    getMonth(): number;
    getDay(): number;
    getHour(): number;
    getMinute(): number;
    getSecond(): number;
    getTimeZone(): number;
    getYearInGanZhi(): string;
    getMonthInGanZhi(): string;
    getDayInGanZhi(): string;
    getHourInGanZhi(): string;
    getJieQi(): string;
    getJieQiTable(): Record<string, Solar>;
  }

  export const Solar: typeof Solar;
  export const Lunar: typeof Lunar;
} 