export interface ElementScore {
  score: number;
  strength: 'weak' | 'average' | 'strong' | '很弱';
}

export interface Pattern {
  name: string;
  analysis: string;
  influence: string;
}

export interface TenGodInfluence {
  personality: string;
  career: string;
  wealth: string;
  marriage: string;
  family: string;
}

export interface TenGod {
  name: string;
  element: string;
  strength: ElementScore['strength'];
  location: string;
  analysis: string;
  influence: TenGodInfluence;
}

export interface HiddenRelationship {
  type: string;
  branches: string[];
  analysis: string;
}

export interface Personality {
  traits: string[];
  strengths: string[];
  weaknesses: string[];
}

export interface BaziAnalysis {
  fiveElements: Record<string, ElementScore>;
  pattern: Pattern;
  tenGods: TenGod[];
  hiddenRelationships: HiddenRelationship[];
  favorableElements: string[];
  unfavorableElements: string[];
  personality: Personality;
  health: Record<string, string[]>;
}

export interface PillarInfo {
  stem: string;
  stemGod?: string;
  branch: string;
  branchGods: [string, string][];
  elements: [string, string];
  lifeStage: string;
}

export interface BaziInfo {
  yearPillar: PillarInfo;
  monthPillar: PillarInfo;
  dayPillar: PillarInfo;
  hourPillar: PillarInfo;
  gender: 'male' | 'female';
  lunarDate: {
    year: number;
    month: number;
    day: number;
    yearInGanZhi: string;
    monthInGanZhi: string;
    dayInGanZhi: string;
  };
} 