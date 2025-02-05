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

  const stemElement = fiveElements[stem] || "";
  const branchElement = fiveElements[branch] || "";

  // console.log('五行计算:', {
  //   输入天干: stem,
  //   输入地支: branch,
  //   天干五行: stemElement,
  //   地支五行: branchElement,
  //   天干是否存在: stem in fiveElements,
  //   地支是否存在: branch in fiveElements,
  //   五行对照表: fiveElements
  // });

  return [stemElement, branchElement];
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

  // console.log('地支藏干计算:', {
  //   输入地支: branch,
  //   藏干: hiddenStems[branch]
  // });

  return hiddenStems[branch];
}

// 获取天干十神
export function getStemGod(dayStem: HeavenlyStem, targetStem: HeavenlyStem): string {
  const [dayElement] = getFiveElements(dayStem, "");
  const [targetElement] = getFiveElements(targetStem, "");
  
  // console.log('计算十神:', {
  //   日干: dayStem,
  //   目标干: targetStem,
  //   日干五行: dayElement,
  //   目标五行: targetElement,
  //   日干索引: HEAVENLY_STEMS.indexOf(dayStem),
  //   目标干索引: HEAVENLY_STEMS.indexOf(targetStem),
  //   日干阴阳: HEAVENLY_STEMS.indexOf(dayStem) % 2 === 0 ? "阳" : "阴",
  //   目标干阴阳: HEAVENLY_STEMS.indexOf(targetStem) % 2 === 0 ? "阳" : "阴",
  //   五行关系: dayElement && targetElement ? FIVE_ELEMENTS_RELATIONS[dayElement][targetElement] : undefined
  // });
  
  if (!dayElement || !targetElement) {
    // console.log('五行计算失败:', { dayElement, targetElement });
    return "";
  }
  
  const baseGod = FIVE_ELEMENTS_RELATIONS[dayElement][targetElement];
  const isTargetYang = HEAVENLY_STEMS.indexOf(targetStem) % 2 === 0;
  
  // console.log('十神计算过程:', {
  //   基础十神: baseGod,
  //   目标阴阳: isTargetYang ? "阳" : "阴",
  //   最终十神: baseGod in YIN_YANG_GODS ? YIN_YANG_GODS[baseGod][isTargetYang ? "阳" : "阴"] : baseGod,
  //   五行关系表: FIVE_ELEMENTS_RELATIONS[dayElement],
  //   阴阳对应表: YIN_YANG_GODS[baseGod]
  // });
  
  if (baseGod in YIN_YANG_GODS) {
    const result = YIN_YANG_GODS[baseGod][isTargetYang ? "阳" : "阴"];
    // console.log('十神计算结果:', result);
    return result;
  }
  // console.log('十神计算结果:', baseGod);
  return baseGod;
}

// 获取地支十神
export function getBranchGods(dayStem: HeavenlyStem, branch: EarthlyBranch): [HeavenlyStem, string][] {
  const hiddenStems = getBranchHiddenStems(branch);
  // console.log('计算地支藏干:', {
  //   日干: dayStem,
  //   地支: branch,
  //   藏干: hiddenStems
  // });
  
  const gods = hiddenStems.map(stem => {
    const god = getStemGod(dayStem, stem);
    // console.log('计算藏干十神:', {
    //   藏干: stem,
    //   十神: god
    // });
    return [stem, god] as [HeavenlyStem, string];
  });
  
  return gods;
}

// 获取十二长生
export function getLifeStage(dayStem: HeavenlyStem, branch: EarthlyBranch): string {
  if (dayStem in LIFE_STAGES) {
    const branchIndex = EARTHLY_BRANCHES.indexOf(branch);
    return LIFE_STAGES[dayStem as keyof typeof LIFE_STAGES][branchIndex];
  }
  return "";
} 