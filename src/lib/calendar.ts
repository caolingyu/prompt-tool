import type { HeavenlyStem, EarthlyBranch } from './constants';
import type { PillarInfo } from './types';
import { HEAVENLY_STEMS, EARTHLY_BRANCHES } from './constants';
import { getFiveElements, getStemGod, getBranchGods, getLifeStage } from './bazi';
import { Solar, Lunar } from 'lunar-javascript';
import dayjs from 'dayjs';

export interface SolarDate {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
}

// 从干支字符串中分离天干地支
function splitGanZhi(ganZhi: string): [HeavenlyStem, EarthlyBranch] {
  return [ganZhi[0] as HeavenlyStem, ganZhi[1] as EarthlyBranch];
}

// 计算年柱，以立春为界
export function getYearPillar(date: SolarDate, dayStem: HeavenlyStem): PillarInfo {
  const solar = Solar.fromYmdHms(date.year, date.month, date.day, date.hour, date.minute, 0);
  const lunar = Lunar.fromSolar(solar);
  
  // 获取年干支
  const yearGanZhi = lunar.getYearInGanZhi();
  const [stem, branch] = splitGanZhi(yearGanZhi);
  
  const stemGod = getStemGod(dayStem, stem);
  const branchGods = getBranchGods(dayStem, branch);
  
  console.log('八字年柱计算:', {
    年干支: yearGanZhi,
    年干: stem,
    年支: branch,
    日干: dayStem,
    十神: stemGod,
    藏干: branchGods,
    五行: getFiveElements(stem, branch)
  });
  
  return {
    stem,
    stemGod,
    branch,
    branchGods,
    elements: getFiveElements(stem, branch),
    lifeStage: getLifeStage(dayStem, branch)
  };
}

// 计算月柱
export function getMonthPillar(date: SolarDate, yearStem: HeavenlyStem, dayStem: HeavenlyStem): PillarInfo {
  const solar = Solar.fromYmdHms(date.year, date.month, date.day, date.hour, date.minute, 0);
  const lunar = Lunar.fromSolar(solar);
  
  // 获取月干支
  const monthGanZhi = lunar.getMonthInGanZhi();
  const [stem, branch] = splitGanZhi(monthGanZhi);
  
  const stemGod = getStemGod(dayStem, stem);
  const branchGods = getBranchGods(dayStem, branch);
  
  console.log('八字月柱计算:', {
    月干支: monthGanZhi,
    月干: stem,
    月支: branch,
    日干: dayStem,
    十神: stemGod,
    藏干: branchGods,
    五行: getFiveElements(stem, branch)
  });
  
  return {
    stem,
    stemGod,
    branch,
    branchGods,
    elements: getFiveElements(stem, branch),
    lifeStage: getLifeStage(dayStem, branch)
  };
}

// 计算日柱
export function getDayPillar(date: SolarDate): PillarInfo {
  const solar = Solar.fromYmdHms(date.year, date.month, date.day, date.hour, date.minute, 0);
  const lunar = Lunar.fromSolar(solar);
  
  // 获取日干支
  const dayGanZhi = lunar.getDayInGanZhi();
  const [stem, branch] = splitGanZhi(dayGanZhi);
  
  const branchGods = getBranchGods(stem, branch);
  
  console.log('八字日柱计算:', {
    日干支: dayGanZhi,
    日干: stem,
    日支: branch,
    藏干: branchGods,
    五行: getFiveElements(stem, branch)
  });
  
  return {
    stem,
    stemGod: undefined, // 日主本身没有十神
    branch,
    branchGods,
    elements: getFiveElements(stem, branch),
    lifeStage: getLifeStage(stem, branch)
  };
}

// 计算时柱
export function getHourPillar(date: SolarDate, dayStem: HeavenlyStem): PillarInfo {
  // 将小时转换为时辰（二小时为一个时辰，从23:00-1:00开始为子时）
  let hour = date.hour;
  
  // 处理子时跨日的情况
  if (hour === 23) {
    hour = 0;  // 23:00-23:59 算作子时（第二天的开始）
  } else if (hour === 0) {
    hour = 0;  // 0:00-0:59 也算作子时
  }
  
  // 计算时辰地支
  // 子时是0点开始，所以要先加1，然后除以2
  const branchIndex = Math.floor((hour + 1) / 2) % 12;
  const branch = EARTHLY_BRANCHES[branchIndex] as EarthlyBranch;
  
  // 计算时干
  // 甲己日起甲时，乙庚日起丙时，丙辛日起戊时，丁壬日起庚时，戊癸日起壬时
  const dayStemIndex = HEAVENLY_STEMS.indexOf(dayStem);
  
  // 根据日干确定起始天干
  let startStem: number;
  switch (dayStem) {
    case '甲':
    case '己':
      startStem = 0;  // 甲
      break;
    case '乙':
    case '庚':
      startStem = 2;  // 丙
      break;
    case '丙':
    case '辛':
      startStem = 4;  // 戊
      break;
    case '丁':
    case '壬':
      startStem = 6;  // 庚
      break;
    case '戊':
    case '癸':
      startStem = 8;  // 壬
      break;
    default:
      startStem = 0;
  }
  
  const stemIndex = (startStem + Math.floor((hour + 1) / 2)) % 10;
  const stem = HEAVENLY_STEMS[stemIndex] as HeavenlyStem;
  
  const stemGod = getStemGod(dayStem, stem);
  const branchGods = getBranchGods(dayStem, branch);
  
  console.log('八字时柱计算:', {
    时干: stem,
    时支: branch,
    原始小时: date.hour,
    调整后小时: hour,
    日干: dayStem,
    起始天干: HEAVENLY_STEMS[startStem],
    时干序: stemIndex,
    时支序: branchIndex,
    十神: stemGod,
    藏干: branchGods,
    五行: getFiveElements(stem, branch)
  });
  
  return {
    stem,
    stemGod,
    branch,
    branchGods,
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
  
  // console.log('calculateDecadeFate result:', result);
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
    const solar = Solar.fromYmdHms(year, 1, 1, 0, 0, 0);
    const lunar = Lunar.fromSolar(solar);
    const yearGanZhi = lunar.getYearInGanZhi();
    const stem = yearGanZhi[0] as HeavenlyStem;
    const branch = yearGanZhi[1] as EarthlyBranch;
    
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

/**
 * 计算真太阳时
 * @param dateTime 北京时间
 * @param longitude 经度
 * @returns 真太阳时的dayjs对象
 */
export function calculateTrueSolarTime(dateTime: dayjs.Dayjs, longitude: number): dayjs.Dayjs {
  // 计算时差
  // 北京在东经120度，每差1度经度相差4分钟
  const beijingLongitude = 120;
  const timeDiffMinutes = (longitude - beijingLongitude) * 4;
  
  // 计算真太阳时
  const trueSolarTime = dateTime.add(timeDiffMinutes, 'minute');
  
  // console.log('真太阳时计算:', {
  //   originalTime: dateTime.format('YYYY-MM-DD HH:mm:ss'),
  //   longitude,
  //   timeDiffMinutes,
  //   trueSolarTime: trueSolarTime.format('YYYY-MM-DD HH:mm:ss')
  // });

  return trueSolarTime;
}

// 获取农历日期信息
export function getLunarDate(date: SolarDate): {
  year: number;
  month: number;
  day: number;
  yearInGanZhi: string;
  monthInGanZhi: string;
  dayInGanZhi: string;
} {
  const solar = Solar.fromYmdHms(date.year, date.month, date.day, date.hour, date.minute, 0);
  const lunar = Lunar.fromSolar(solar);
  
  return {
    year: lunar.getYear(),
    month: lunar.getMonth(),
    day: lunar.getDay(),
    yearInGanZhi: lunar.getYearInGanZhi(),
    monthInGanZhi: lunar.getMonthInGanZhi(),
    dayInGanZhi: lunar.getDayInGanZhi()
  };
} 