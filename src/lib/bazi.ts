import { 
  HEAVENLY_STEMS, EARTHLY_BRANCHES, LIFE_STAGES, FIVE_ELEMENTS_RELATIONS, YIN_YANG_GODS,
  type HeavenlyStem, type EarthlyBranch, type FiveElement
} from './constants';

// 获取五行属性
export function getFiveElements(stem: HeavenlyStem | "", branch: EarthlyBranch | ""): [FiveElement | "", FiveElement | ""] {
  const fiveElements: Record<string, FiveElement> = {
    "甲": "木", "乙": "木",
    "丙": "火", "丁": "火",
    "戊": "土", "己": "土",
    "庚": "金", "辛": "金",
    "壬": "水", "癸": "水",
    "子": "水", "亥": "水",
    "寅": "木", "卯": "木",
    "巳": "火", "午": "火",
    "辰": "土", "戌": "土", "丑": "土", "未": "土",
    "申": "金", "酉": "金"
  };

  return [fiveElements[stem] || "", fiveElements[branch] || ""];
}

// 获取地支藏干
export function getBranchHiddenStems(branch: EarthlyBranch): HeavenlyStem[] {
  const hiddenStems: Record<EarthlyBranch, HeavenlyStem[]> = {
    "子": ["癸"],
    "丑": ["己", "癸", "辛"],
    "寅": ["甲", "丙", "戊"],
    "卯": ["乙"],
    "辰": ["戊", "乙", "癸"],
    "巳": ["丙", "戊", "庚"],
    "午": ["丁", "己"],
    "未": ["己", "丁", "乙"],
    "申": ["庚", "壬", "戊"],
    "酉": ["辛"],
    "戌": ["戊", "辛", "丁"],
    "亥": ["壬", "甲"]
  };
  return hiddenStems[branch];
}

// 获取天干十神
export function getStemGod(dayStem: HeavenlyStem, targetStem: HeavenlyStem): string {
  const [dayElement, targetElement] = getFiveElements(dayStem, "");
  
  if (!dayElement || !targetElement) return "";
  
  const baseGod = FIVE_ELEMENTS_RELATIONS[dayElement][targetElement];
  const isTargetYang = HEAVENLY_STEMS.indexOf(targetStem) % 2 === 0;
  
  if (baseGod in YIN_YANG_GODS) {
    return YIN_YANG_GODS[baseGod][isTargetYang ? "阳" : "阴"];
  }
  return baseGod;
}

// 获取地支十神
export function getBranchGods(dayStem: HeavenlyStem, branch: EarthlyBranch): [HeavenlyStem, string][] {
  const hiddenStems = getBranchHiddenStems(branch);
  return hiddenStems.map(stem => [stem, getStemGod(dayStem, stem)]);
}

// 获取十二长生
export function getLifeStage(dayStem: HeavenlyStem, branch: EarthlyBranch): string {
  if (dayStem in LIFE_STAGES) {
    const branchIndex = EARTHLY_BRANCHES.indexOf(branch);
    return LIFE_STAGES[dayStem as keyof typeof LIFE_STAGES][branchIndex];
  }
  return "";
} 