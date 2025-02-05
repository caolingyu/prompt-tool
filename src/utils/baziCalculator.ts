import { HEAVENLY_STEMS, EARTHLY_BRANCHES, FIVE_ELEMENTS, FIVE_ELEMENTS_RELATIONS, YIN_YANG_GODS, BRANCH_HIDDEN_STEMS } from '../constants/bazi';
import type { BaziPillar } from '../types/bazi';
import dayjs from 'dayjs';
import { Solar, Lunar } from 'lunar-javascript';
import { getFiveElements, getStemGod, getBranchGods } from '../lib/bazi';

export function getYearStemBranch(date: dayjs.Dayjs): [string, string] {
  // 使用lunar-javascript计算节气
  const solar = Solar.fromYmdHms(date.year(), date.month() + 1, date.date(), date.hour(), date.minute(), 0);
  const lunar = Lunar.fromSolar(solar);
  
  // 获取节气信息
  const jieqi = lunar.getJieQi();
  let year = date.year();
  
  // 如果在立春前，年柱还要算前一年
  if (jieqi.startsWith("立春") && lunar.getMonth() === 1) {
    year -= 1;
  }
  
  const stemIndex = (year - 4) % 10;
  const branchIndex = (year - 4) % 12;
  
  return [HEAVENLY_STEMS[stemIndex], EARTHLY_BRANCHES[branchIndex]];
}

export function getMonthStemBranch(yearStem: string, date: dayjs.Dayjs): [string, string] {
  // 使用lunar-javascript计算节气
  const solar = Solar.fromYmdHms(date.year(), date.month() + 1, date.date(), date.hour(), date.minute(), 0);
  const lunar = Lunar.fromSolar(solar);
  
  // 使用月份的干支信息
  const monthGanZhi = lunar.getMonthInGanZhi();
  const branch = monthGanZhi[1];
  const branchIndex = EARTHLY_BRANCHES.indexOf(branch);
  
  // 月干公式：年干 * 2 + 月支索引，超过10从头开始
  const baseStemIndex = HEAVENLY_STEMS.indexOf(yearStem) * 2 % 10;
  const stemIndex = (baseStemIndex + branchIndex) % 10;
  
  return [HEAVENLY_STEMS[stemIndex], EARTHLY_BRANCHES[branchIndex]];
}

export function getDayStemBranch(date: dayjs.Dayjs): [string, string] {
  // 使用lunar-javascript计算日柱
  const solar = Solar.fromYmdHms(date.year(), date.month() + 1, date.date(), date.hour(), date.minute(), 0);
  const lunar = Lunar.fromSolar(solar);
  const dayGanZhi = lunar.getDayInGanZhi();
  
  return [dayGanZhi[0], dayGanZhi[1]];
}

export function getHourStemBranch(dayStem: string, hour: number): [string, string] {
  // 子时（23:00-1:00）开始
  if (hour === 23) hour = 0;
  
  // 计算时辰地支
  const branchIndex = Math.floor((hour + 1) / 2) % 12;
  
  // 根据日干推算时干
  const dayStemIndex = HEAVENLY_STEMS.indexOf(dayStem);
  const baseStemIndex = (dayStemIndex * 2) % 10;
  const stemIndex = (baseStemIndex + branchIndex) % 10;
  
  return [HEAVENLY_STEMS[stemIndex], EARTHLY_BRANCHES[branchIndex]];
}

export function getBranchHiddenStems(branch: string): string[] {
  return BRANCH_HIDDEN_STEMS[branch] || [];
}

export function calculateBaziChart(birthDate: dayjs.Dayjs): {
  yearPillar: BaziPillar;
  monthPillar: BaziPillar;
  dayPillar: BaziPillar;
  hourPillar: BaziPillar;
} {
  // 计算四柱
  const [yearStem, yearBranch] = getYearStemBranch(birthDate);
  const [monthStem, monthBranch] = getMonthStemBranch(yearStem, birthDate);
  const [dayStem, dayBranch] = getDayStemBranch(birthDate);
  const [hourStem, hourBranch] = getHourStemBranch(dayStem, birthDate.hour());
  
  return {
    yearPillar: {
      stem: yearStem,
      stemGod: getStemGod(dayStem, yearStem),
      branch: yearBranch,
      branchGods: getBranchGods(dayStem, yearBranch),
      elements: getFiveElements(yearStem, yearBranch)
    },
    monthPillar: {
      stem: monthStem,
      stemGod: getStemGod(dayStem, monthStem),
      branch: monthBranch,
      branchGods: getBranchGods(dayStem, monthBranch),
      elements: getFiveElements(monthStem, monthBranch)
    },
    dayPillar: {
      stem: dayStem,
      branch: dayBranch,
      branchGods: getBranchGods(dayStem, dayBranch),
      elements: getFiveElements(dayStem, dayBranch)
    },
    hourPillar: {
      stem: hourStem,
      stemGod: getStemGod(dayStem, hourStem),
      branch: hourBranch,
      branchGods: getBranchGods(dayStem, hourBranch),
      elements: getFiveElements(hourStem, hourBranch)
    }
  };
}

// 更多计算函数将在后续实现... 