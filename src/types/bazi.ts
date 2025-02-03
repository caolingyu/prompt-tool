export interface BaziPillar {
  stem: string;
  stemGod?: string;
  branch: string;
  branchGods: Array<[string, string]>;
  elements: [string, string];
  lifeStage?: string;
}

export interface BaziChart {
  yearPillar: BaziPillar;
  monthPillar: BaziPillar;
  dayPillar: BaziPillar;
  hourPillar: BaziPillar;
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

export interface DecadeFate {
  stem: string;
  stemGod: string;
  branch: string;
  branchGods: Array<[string, string]>;
  elements: [string, string];
  startAge: number;
  endAge: number;
  startYear: number;
  endYear: number;
} 