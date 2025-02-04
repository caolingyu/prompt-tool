import React from 'react';
import { Form, DatePicker, Radio, Button, Card } from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { useBazi } from '../contexts/BaziContext';

interface BaziFormData {
  birthDate: Dayjs;
  birthTime: Dayjs;
  gender: 'male' | 'female';
}

const BaziForm: React.FC = () => {
  const [form] = Form.useForm();
  const { setBirthDateTime } = useBazi();

  const onFinish = (values: BaziFormData) => {
    const date = values.birthDate;
    const time = values.birthTime;
    
    // 合并日期和时间
    const birthDateTime = date.clone()
      .hour(time.hour())
      .minute(time.minute())
      .second(0);

    console.log('Form submitted:', {
      date: date.format('YYYY-MM-DD'),
      time: time.format('HH:mm'),
      combined: birthDateTime.format('YYYY-MM-DD HH:mm:ss')
    });

    setBirthDateTime(birthDateTime, values.gender);
  };

  return (
    <Card 
      title="生辰八字信息" 
      style={{ 
        marginBottom: 24,
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        borderRadius: '8px',
        background: 'rgba(255, 255, 255, 0.9)',
        border: '1px solid var(--border-color)'
      }}
    >
      <Form
        form={form}
        name="bazi_form"
        onFinish={onFinish}
        layout="vertical"
        initialValues={{
          gender: 'male',
          birthDate: dayjs(),
          birthTime: dayjs()
        }}
        style={{ padding: '16px' }}
      >
        <Form.Item
          name="birthDate"
          label={<span style={{ color: 'var(--text-primary)', fontSize: '16px' }}>出生日期</span>}
          rules={[{ required: true, message: '请选择出生日期' }]}
        >
          <DatePicker 
            style={{ 
              width: '100%',
              height: '40px'
            }}
            placeholder="选择出生日期"
          />
        </Form.Item>

        <Form.Item
          name="birthTime"
          label={<span style={{ color: 'var(--text-primary)', fontSize: '16px' }}>出生时间</span>}
          rules={[{ required: true, message: '请选择出生时辰' }]}
        >
          <DatePicker.TimePicker
            style={{ 
              width: '100%',
              height: '40px'
            }}
            format="HH:mm"
            placeholder="选择出生时间"
          />
        </Form.Item>

        <Form.Item
          name="gender"
          label={<span style={{ color: 'var(--text-primary)', fontSize: '16px' }}>性别</span>}
          rules={[{ required: true, message: '请选择性别' }]}
        >
          <Radio.Group style={{ display: 'flex', gap: '32px' }}>
            <Radio value="male" style={{ fontSize: '16px' }}>男</Radio>
            <Radio value="female" style={{ fontSize: '16px' }}>女</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item style={{ marginBottom: 0, marginTop: '24px' }}>
          <Button 
            type="primary" 
            htmlType="submit" 
            block
            size="large"
            style={{
              height: '48px',
              fontSize: '18px',
              fontWeight: 500,
              letterSpacing: '4px',
              transition: 'all 0.3s'
            }}
          >
            计算八字
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default BaziForm; 