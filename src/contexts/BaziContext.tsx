import React, { createContext, useContext, useState } from 'react';
import type { BaziChart } from '../types/bazi';
import dayjs from 'dayjs';
import { calculateBaziChart } from '../utils/baziCalculator';
import { calculateDecadeFate, calculateYearFate, type DecadeFate, type YearFate } from '../lib/calendar';

interface LogMessage {
  timestamp: Date;
  message: string;
  type: 'info' | 'error';
}

interface BaziContextType {
  baziData: BaziChart | null;
  decadeFate: { startingAge: number; fates: DecadeFate[] } | null;
  yearFates: YearFate[] | null;
  logs: LogMessage[];
  setBirthDateTime: (date: dayjs.Dayjs, gender: 'male' | 'female') => void;
}

const BaziContext = createContext<BaziContextType | undefined>(undefined);

export function BaziProvider({ children }: { children: React.ReactNode }) {
  const [baziData, setBaziData] = useState<BaziChart | null>(null);
  const [decadeFate, setDecadeFate] = useState<{ startingAge: number; fates: DecadeFate[] } | null>(null);
  const [yearFates, setYearFates] = useState<YearFate[] | null>(null);
  const [logs, setLogs] = useState<LogMessage[]>([]);

  const addLog = (message: string, type: 'info' | 'error' = 'info') => {
    setLogs(prev => [...prev, { timestamp: new Date(), message, type }]);
  };

  const setBirthDateTime = (date: dayjs.Dayjs, gender: 'male' | 'female') => {
    try {
      // 清除之前的日志
      setLogs([]);
      
      addLog('开始计算八字...');
      const chart = calculateBaziChart(date);
      addLog('八字计算完成');
      
      // 计算八字数据
      setBaziData({
        ...chart,
        gender,
        lunarDate: {
          year: date.year(),
          month: date.month() + 1,
          day: date.date(),
          yearInGanZhi: `${chart.yearPillar.stem}${chart.yearPillar.branch}`,
          monthInGanZhi: `${chart.monthPillar.stem}${chart.monthPillar.branch}`,
          dayInGanZhi: `${chart.dayPillar.stem}${chart.dayPillar.branch}`
        }
      });

      // 计算大运
      addLog('开始计算大运...');
      const solarDate = {
        year: date.year(),
        month: date.month() + 1,
        day: date.date(),
        hour: date.hour(),
        minute: date.minute()
      };

      const fate = calculateDecadeFate(
        solarDate,
        gender,
        chart.monthPillar.stem,
        chart.monthPillar.branch,
        chart.dayPillar.stem
      );
      setDecadeFate(fate);
      addLog('大运计算完成');

      // 计算最近20年流年
      addLog('开始计算流年...');
      const currentYear = new Date().getFullYear();
      const yFates = calculateYearFate(
        currentYear,
        currentYear + 20,
        chart.dayPillar.stem
      );
      setYearFates(yFates);
      addLog('流年计算完成');
      addLog('所有计算已完成');

    } catch (err) {
      console.error('计算错误:', err);
      const errorMessage = err && typeof err === 'object' && 'message' in err 
        ? String(err.message)
        : '计算过程中发生未知错误';
      addLog(errorMessage, 'error');
    }
  };

  return (
    <BaziContext.Provider value={{ baziData, decadeFate, yearFates, logs, setBirthDateTime }}>
      {children}
    </BaziContext.Provider>
  );
}

export function useBazi() {
  const context = useContext(BaziContext);
  if (context === undefined) {
    throw new Error('useBazi must be used within a BaziProvider');
  }
  return context;
} 