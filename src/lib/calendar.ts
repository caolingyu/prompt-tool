import type { HeavenlyStem, EarthlyBranch } from './constants';
import type { PillarInfo } from './types';
import { HEAVENLY_STEMS, EARTHLY_BRANCHES } from './constants';
import { getFiveElements, getStemGod, getBranchGods, getLifeStage } from './bazi';
import { Solar, Lunar } from 'lunar-javascript';

export interface SolarDate {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
}

// 计算年柱，以立春为界
export function getYearPillar(date: SolarDate, dayStem: HeavenlyStem): PillarInfo {
  const solar = Solar.fromYmdHms(date.year, date.month, date.day, date.hour, date.minute, 0);
  const lunar = Lunar.fromSolar(solar);
  
  // 获取节气信息
  const jieqi = lunar.getJieQi();
  let year = date.year;
  
  // 如果在立春前，年柱还要算前一年
  if (jieqi.startsWith("立春") && lunar.getMonth() === 1) {
    year -= 1;
  }
  
  const stemIndex = (year - 4) % 10;
  const branchIndex = (year - 4) % 12;
  
  const stem = HEAVENLY_STEMS[stemIndex] as HeavenlyStem;
  const branch = EARTHLY_BRANCHES[branchIndex] as EarthlyBranch;
  
  return {
    stem,
    stemGod: getStemGod(dayStem, stem),
    branch,
    branchGods: getBranchGods(dayStem, branch),
    elements: getFiveElements(stem, branch),
    lifeStage: getLifeStage(dayStem, branch)
  };
}

// 计算月柱，需要考虑节气
export function getMonthPillar(date: SolarDate, yearStem: HeavenlyStem, dayStem: HeavenlyStem): PillarInfo {
  const solar = Solar.fromYmdHms(date.year, date.month, date.day, date.hour, date.minute, 0);
  const lunar = Lunar.fromSolar(solar);
  
  // 使用月份的干支信息
  const monthGanZhi = lunar.getMonthInGanZhi();
  const branch = monthGanZhi[1] as EarthlyBranch;
  const branchIndex = EARTHLY_BRANCHES.indexOf(branch);
  
  // 月干公式：年干 * 2 + 月支索引，超过10从头开始
  const baseStemIndex = HEAVENLY_STEMS.indexOf(yearStem) * 2 % 10;
  const stemIndex = (baseStemIndex + branchIndex) % 10;
  const stem = HEAVENLY_STEMS[stemIndex] as HeavenlyStem;
  
  return {
    stem,
    stemGod: getStemGod(dayStem, stem),
    branch,
    branchGods: getBranchGods(dayStem, branch),
    elements: getFiveElements(stem, branch),
    lifeStage: getLifeStage(dayStem, branch)
  };
}

// 计算日柱
export function getDayPillar(date: SolarDate): PillarInfo {
  const solar = Solar.fromYmdHms(date.year, date.month, date.day, date.hour, date.minute, 0);
  const lunar = Lunar.fromSolar(solar);
  const dayGanZhi = lunar.getDayInGanZhi();
  
  const stem = dayGanZhi[0] as HeavenlyStem;
  const branch = dayGanZhi[1] as EarthlyBranch;
  
  return {
    stem,
    stemGod: null, // 日主本身没有十神
    branch,
    branchGods: getBranchGods(stem, branch),
    elements: getFiveElements(stem, branch),
    lifeStage: getLifeStage(stem, branch)
  };
}

// 计算时柱
export function getHourPillar(date: SolarDate, dayStem: HeavenlyStem): PillarInfo {
  // 时干根据日干推算
  const dayStemIndex = HEAVENLY_STEMS.indexOf(dayStem);
  const baseStemIndex = (dayStemIndex * 2) % 10;
  
  // 子时（23:00-1:00）开始
  let hour = date.hour;
  if (hour === 23) {
    hour = 0;
  }
  
  const branchIndex = Math.floor((hour + 1) / 2) % 12;
  const stemIndex = (baseStemIndex + branchIndex) % 10;
  
  const stem = HEAVENLY_STEMS[stemIndex] as HeavenlyStem;
  const branch = EARTHLY_BRANCHES[branchIndex] as EarthlyBranch;
  
  return {
    stem,
    stemGod: getStemGod(dayStem, stem),
    branch,
    branchGods: getBranchGods(dayStem, branch),
    elements: getFiveElements(stem, branch),
    lifeStage: getLifeStage(dayStem, branch)
  };
}

// 计算大运
export interface DecadeFate {
  stem: HeavenlyStem;
  stemGod: string;
  branch: EarthlyBranch;
  branchGods: [HeavenlyStem, string][];
  elements: [string, string];
  startAge: number;
  endAge: number;
  startYear: number;
  endYear: number;
}

export function calculateDecadeFate(
  date: SolarDate,
  gender: 'male' | 'female',
  monthStem: HeavenlyStem,
  monthBranch: EarthlyBranch,
  dayStem: HeavenlyStem
): { startingAge: number; fates: DecadeFate[] } {
  const solar = Solar.fromYmdHms(date.year, date.month, date.day, date.hour, date.minute, 0);
  const lunar = Lunar.fromSolar(solar);
  
  // 获取年干判断阴阳年
  const yearGanZhi = lunar.getYearInGanZhi();
  const yearStem = yearGanZhi[0] as HeavenlyStem;
  const isYearYang = HEAVENLY_STEMS.indexOf(yearStem) % 2 === 0;
  
  // 判断大运顺逆
  const isGenderYang = gender === 'male';
  const isForward = (isYearYang && isGenderYang) || (!isYearYang && !isGenderYang);
  
  // 获取节气表
  const jieqiTable = lunar.getJieQiTable();
  
  // 将节气表转换为有序列表，只保留节（不要气）
  const JIEQI_NAMES = ['立春', '惊蛰', '清明', '立夏', '芒种', '小暑', '立秋', '白露', '寒露', '立冬', '大雪', '小寒'];
  const jieqiList: Array<[string, Solar]> = [];
  
  for (const [name, date] of Object.entries(jieqiTable)) {
    if (JIEQI_NAMES.includes(name)) {
      jieqiList.push([name, date as Solar]);
    }
  }
  
  // 按日期排序
  jieqiList.sort((a, b) => a[1].getJulianDay() - b[1].getJulianDay());
  
  // 找到相邻的节气
  const birthJulianDay = solar.getJulianDay();
  let targetJieqi: Solar | null = null;
  
  for (let i = 0; i < jieqiList.length; i++) {
    const [, jieqiDate] = jieqiList[i];
    if (isForward) { // 阳年男命或阴年女命找下一个节
      if (jieqiDate.getJulianDay() > birthJulianDay) {
        targetJieqi = jieqiDate;
        break;
      }
    } else { // 阴年男命或阳年女命找上一个节
      if (jieqiDate.getJulianDay() > birthJulianDay && i > 0) {
        targetJieqi = jieqiList[i-1][1];
        break;
      }
    }
  }
  
  // 计算起运年龄
  let startingAge = 0;
  if (targetJieqi) {
    const dayDiff = isForward ? 
      targetJieqi.getJulianDay() - birthJulianDay :
      birthJulianDay - targetJieqi.getJulianDay();
    
    startingAge = dayDiff / 3; // 每3天为1年
  } else {
    startingAge = 6.2; // 默认值
  }
  
  // 计算大运
  const fates: DecadeFate[] = [];
  const monthStemIdx = HEAVENLY_STEMS.indexOf(monthStem);
  const monthBranchIdx = EARTHLY_BRANCHES.indexOf(monthBranch);
  
  for (let i = 0; i < 8; i++) {
    let newStemIdx: number;
    let newBranchIdx: number;
    
    if (isForward) {
      // 顺排
      newStemIdx = (monthStemIdx + i + 1) % 10;
      newBranchIdx = (monthBranchIdx + i + 1) % 12;
    } else {
      // 逆排
      newStemIdx = (monthStemIdx - (i + 1) + 10) % 10;
      newBranchIdx = (monthBranchIdx - (i + 1) + 12) % 12;
    }
    
    const stem = HEAVENLY_STEMS[newStemIdx] as HeavenlyStem;
    const branch = EARTHLY_BRANCHES[newBranchIdx] as EarthlyBranch;
    
    // 计算年龄范围
    const startAge = Math.ceil(startingAge) + i * 10;
    const endAge = startAge + 9;
    
    // 计算年份范围
    const startYear = date.year + Math.ceil(startingAge) + i * 10;
    const endYear = startYear + 9;
    
    fates.push({
      stem,
      stemGod: getStemGod(dayStem, stem),
      branch,
      branchGods: getBranchGods(dayStem, branch),
      elements: getFiveElements(stem, branch),
      startAge,
      endAge,
      startYear,
      endYear
    });
  }
  
  // 确保返回正确的数据结构
  const result = {
    startingAge: Math.round(startingAge * 10) / 10,
    fates: fates
  };
  
  console.log('calculateDecadeFate result:', result);
  return result;
}

// 添加流年计算函数
export interface YearFate extends Omit<DecadeFate, 'startAge' | 'endAge' | 'startYear' | 'endYear'> {
  year: number;
}

export function calculateYearFate(
  startYear: number,
  endYear: number,
  dayStem: HeavenlyStem
): YearFate[] {
  const yearFates: YearFate[] = [];
  
  for (let year = startYear; year <= endYear; year++) {
    const stemIndex = (year - 4) % 10;
    const branchIndex = (year - 4) % 12;
    
    const stem = HEAVENLY_STEMS[stemIndex] as HeavenlyStem;
    const branch = EARTHLY_BRANCHES[branchIndex] as EarthlyBranch;
    
    yearFates.push({
      year,
      stem,
      stemGod: getStemGod(dayStem, stem),
      branch,
      branchGods: getBranchGods(dayStem, branch),
      elements: getFiveElements(stem, branch)
    });
  }
  
  return yearFates;
} 