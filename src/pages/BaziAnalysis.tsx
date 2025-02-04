import React, { useState } from 'react';
import { Form, DatePicker, Radio, Button, Card, Space } from 'antd';
import type { Dayjs } from 'dayjs';
import { FateDisplay } from '../components/FateDisplay';
import { PillarsDisplay } from '../components/PillarsDisplay';
import {
  SolarDate,
  getYearPillar,
  getMonthPillar,
  getDayPillar,
  getHourPillar,
  calculateDecadeFate,
  calculateYearFate,
  type DecadeFate,
  type YearFate
} from '../lib/calendar';
import type { PillarInfo } from '../lib/types';
import ErrorBoundary from '../components/ErrorBoundary';

interface FormValues {
  birthDate: Dayjs;
  gender: 'male' | 'female';
}

interface BaziResult {
  pillars: {
    year: PillarInfo;
    month: PillarInfo;
    day: PillarInfo;
    hour: PillarInfo;
  };
  decadeFate: {
    startingAge: number;
    fates: DecadeFate[];
  };
  yearFates: YearFate[];
}

const BaziAnalysis: React.FC = () => {
  const [form] = Form.useForm<FormValues>();
  const [baziResult, setBaziResult] = useState<BaziResult | null>(null);

  // 添加表单值变化监听
  const handleFormChange = () => {
    console.log('Form changed:', form.getFieldsValue());
  };

  // 添加提交按钮点击事件
  const handleSubmitClick = () => {
    console.log('Submit button clicked');
    form.submit();
  };

  const onFinish = (values: FormValues) => {
    console.log('Form values:', values);
    
    if (!values.birthDate || !values.gender) {
      console.error('Missing required values');
      return;
    }

    const solarDate: SolarDate = {
      year: values.birthDate.year(),
      month: values.birthDate.month() + 1, // Dayjs months are 0-based
      day: values.birthDate.date(),
      hour: values.birthDate.hour(),
      minute: values.birthDate.minute()
    };

    console.log('Solar date:', solarDate);

    try {
      // 计算八字
      const dayPillar = getDayPillar(solarDate);
      console.log('Day pillar:', dayPillar);

      const yearPillar = getYearPillar(solarDate, dayPillar.stem);
      console.log('Year pillar:', yearPillar);

      const monthPillar = getMonthPillar(solarDate, yearPillar.stem, dayPillar.stem);
      console.log('Month pillar:', monthPillar);

      const hourPillar = getHourPillar(solarDate, dayPillar.stem);
      console.log('Hour pillar:', hourPillar);

      // 计算大运
      const decadeFate = calculateDecadeFate(
        solarDate,
        values.gender,
        monthPillar.stem,
        monthPillar.branch,
        dayPillar.stem
      );
      console.log('Decade fate:', decadeFate);

      // 计算最近20年流年
      const currentYear = new Date().getFullYear();
      const yearFates = calculateYearFate(
        currentYear,
        currentYear + 20,
        dayPillar.stem
      );
      console.log('Year fates:', yearFates);

      const result: BaziResult = {
        pillars: {
          year: yearPillar,
          month: monthPillar,
          day: dayPillar,
          hour: hourPillar
        },
        decadeFate,
        yearFates
      };

      console.log('Setting bazi result:', result);
      setBaziResult(result);

    } catch (error) {
      console.error('Error calculating bazi:', error);
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.error('Form validation failed:', errorInfo);
  };

  // 在组件内添加一个测试按钮
  const testCalculation = () => {
    const testDate: SolarDate = {
      year: 2025,
      month: 2,
      day: 3,
      hour: 21,
      minute: 28
    };

    try {
      const dayPillar = getDayPillar(testDate);
      console.log('Test - Day pillar:', dayPillar);
      
      const yearPillar = getYearPillar(testDate, dayPillar.stem);
      console.log('Test - Year pillar:', yearPillar);
      
      // ... 其他测试代码
    } catch (error) {
      console.error('Test calculation error:', error);
    }
  };

  return (
    <ErrorBoundary>
      <div className="bazi-analysis">
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Card title="生辰信息">
            <Form<FormValues>
              form={form}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              onValuesChange={handleFormChange}
              layout="vertical"
            >
              <Form.Item
                label="出生日期时间"
                name="birthDate"
                rules={[{ required: true, message: '请选择出生日期时间' }]}
              >
                <DatePicker 
                  showTime={{ format: 'HH:mm' }}
                  format="YYYY-MM-DD HH:mm"
                  placeholder="选择日期和时间"
                  style={{ width: '100%' }}
                />
              </Form.Item>
              <Form.Item
                label="性别"
                name="gender"
                rules={[{ required: true, message: '请选择性别' }]}
              >
                <Radio.Group>
                  <Radio value="male">男</Radio>
                  <Radio value="female">女</Radio>
                </Radio.Group>
              </Form.Item>
              <Form.Item>
                <Button 
                  type="primary" 
                  htmlType="submit"
                  onClick={handleSubmitClick}
                >
                  计算
                </Button>
              </Form.Item>
            </Form>
          </Card>

          {/* 在表单下方添加测试按钮 */}
          <Button onClick={testCalculation} style={{ marginTop: 16 }}>
            测试计算
          </Button>

          {baziResult && (
            <>
              <Card title="八字排盘">
                <PillarsDisplay pillars={baziResult.pillars} />
              </Card>
              
              <FateDisplay
                startingAge={baziResult.decadeFate.startingAge}
                decadeFates={baziResult.decadeFate.fates}
                yearFates={baziResult.yearFates}
              />
            </>
          )}
        </Space>
      </div>
    </ErrorBoundary>
  );
};

export default BaziAnalysis; 