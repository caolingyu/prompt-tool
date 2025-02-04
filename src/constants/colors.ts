export const ELEMENT_COLORS = {
  '木': '#4CAF50', // 绿色
  '火': '#F44336', // 红色
  '土': '#795548', // 棕色
  '金': '#FFA726', // 橙色
  '水': '#2196F3', // 蓝色
};

export const STEM_COLORS: { [key: string]: string } = {
  '甲': ELEMENT_COLORS['木'],
  '乙': ELEMENT_COLORS['木'],
  '丙': ELEMENT_COLORS['火'],
  '丁': ELEMENT_COLORS['火'],
  '戊': ELEMENT_COLORS['土'],
  '己': ELEMENT_COLORS['土'],
  '庚': ELEMENT_COLORS['金'],
  '辛': ELEMENT_COLORS['金'],
  '壬': ELEMENT_COLORS['水'],
  '癸': ELEMENT_COLORS['水'],
};

export const BRANCH_COLORS: { [key: string]: string } = {
  '寅': ELEMENT_COLORS['木'],
  '卯': ELEMENT_COLORS['木'],
  '巳': ELEMENT_COLORS['火'],
  '午': ELEMENT_COLORS['火'],
  '辰': ELEMENT_COLORS['土'],
  '戌': ELEMENT_COLORS['土'],
  '丑': ELEMENT_COLORS['土'],
  '未': ELEMENT_COLORS['土'],
  '申': ELEMENT_COLORS['金'],
  '酉': ELEMENT_COLORS['金'],
  '亥': ELEMENT_COLORS['水'],
  '子': ELEMENT_COLORS['水'],
}; 