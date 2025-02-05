import React, { createContext, useContext, useState } from 'react';
import type dayjs from 'dayjs';
import type { BaziChart } from '../types/bazi';
import { calculateTrueSolarTime, type SolarDate, type DecadeFate, type YearFate, getDayPillar, getYearPillar, getMonthPillar, getHourPillar, calculateDecadeFate, calculateYearFate, getLunarDate } from '../lib/calendar';
import { getStemGod } from '../lib/bazi';

interface LogMessage {
  text: string;
  timestamp: number;
  type: 'info' | 'error';
}

interface BaziContextType {
  baziData: BaziChart | null;
  decadeFate: { startingAge: number; fates: DecadeFate[] } | null;
  yearFates: YearFate[];
  logs: LogMessage[];
  setBirthDateTime: (date: dayjs.Dayjs, gender: 'male' | 'female', birthPlace?: { lng: number; lat: number }, useTrueSolarTime?: boolean) => void;
}

const BaziContext = createContext<BaziContextType | null>(null);

export function useBazi() {
  const context = useContext(BaziContext);
  if (!context) {
    throw new Error('useBazi must be used within a BaziProvider');
  }
  return context;
}

export function BaziProvider({ children }: { children: React.ReactNode }) {
  const [baziData, setBaziData] = useState<BaziChart | null>(null);
  const [decadeFate, setDecadeFate] = useState<{ startingAge: number; fates: DecadeFate[] } | null>(null);
  const [yearFates, setYearFates] = useState<YearFate[]>([]);
  const [logs, setLogs] = useState<LogMessage[]>([]);

  const addLog = (message: string, type: 'info' | 'error' = 'info') => {
    setLogs(prev => [...prev, { text: message, timestamp: Date.now(), type }]);
  };

  const setBirthDateTime = (
    date: dayjs.Dayjs, 
    gender: 'male' | 'female',
    birthPlace?: { lng: number; lat: number },
    useTrueSolarTime?: boolean
  ) => {
    try {
      // 清除之前的日志
      setLogs([]);
      
      addLog('开始计算八字...');

      // 如果需要使用真太阳时且提供了出生地信息
      let calculationTime = date;
      if (useTrueSolarTime && birthPlace) {
        addLog(`计算真太阳时 (经度: ${birthPlace.lng})`);
        calculationTime = calculateTrueSolarTime(date, birthPlace.lng);
        addLog(`真太阳时计算结果: ${calculationTime.format('YYYY-MM-DD HH:mm:ss')}`);
      }

      const solarDate: SolarDate = {
        year: calculationTime.year(),
        month: calculationTime.month() + 1,
        day: calculationTime.date(),
        hour: calculationTime.hour(),
        minute: calculationTime.minute()
      };

      addLog('计算日柱...');
      const dayPillar = getDayPillar(solarDate);
      addLog('计算年柱...');
      const yearPillar = getYearPillar(solarDate, dayPillar.stem);
      addLog('计算月柱...');
      const monthPillar = getMonthPillar(solarDate, yearPillar.stem, dayPillar.stem);
      addLog('计算时柱...');
      const hourPillar = getHourPillar(solarDate, dayPillar.stem);
      
      const lunarInfo = getLunarDate(solarDate);
      addLog('八字计算完成');
      
      // 重新计算十神
      const yearStemGod = getStemGod(dayPillar.stem, yearPillar.stem);
      const monthStemGod = getStemGod(dayPillar.stem, monthPillar.stem);
      const hourStemGod = getStemGod(dayPillar.stem, hourPillar.stem);
      
      console.log('十神计算结果:', {
        年柱十神: yearStemGod,
        月柱十神: monthStemGod,
        日柱十神: undefined, // 日主本身没有十神
        时柱十神: hourStemGod,
        日干: dayPillar.stem
      });
      
      // 设置八字数据
      const baziData = {
        yearPillar: {
          ...yearPillar,
          stemGod: yearStemGod
        },
        monthPillar: {
          ...monthPillar,
          stemGod: monthStemGod
        },
        dayPillar: {
          ...dayPillar,
          stemGod: undefined // 日主本身没有十神
        },
        hourPillar: {
          ...hourPillar,
          stemGod: hourStemGod
        },
        gender,
        lunarDate: lunarInfo
      };
      
      console.log('设置八字数据:', baziData);
      setBaziData(baziData);

      // 计算大运
      addLog('开始计算大运...');
      const fate = calculateDecadeFate(
        solarDate,
        gender,
        monthPillar.stem,
        monthPillar.branch,
        dayPillar.stem
      );
      setDecadeFate(fate);
      addLog('大运计算完成');

      // 计算最近20年流年
      addLog('开始计算流年...');
      const currentYear = new Date().getFullYear();
      const yFates = calculateYearFate(
        currentYear,
        currentYear + 20,
        dayPillar.stem
      );
      setYearFates(yFates);
      addLog('流年计算完成');
      addLog('所有计算已完成');

    } catch (error) {
      console.error('八字计算出错:', error);
      addLog(`计算出错: ${error}`, 'error');
    }
  };

  return (
    <BaziContext.Provider value={{ baziData, decadeFate, yearFates, logs, setBirthDateTime }}>
      {children}
    </BaziContext.Provider>
  );
} 