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
    <Card title="生辰八字信息" style={{ marginBottom: 24 }}>
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
      >
        <Form.Item
          name="birthDate"
          label="出生日期"
          rules={[{ required: true, message: '请选择出生日期' }]}
        >
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          name="birthTime"
          label="出生时间"
          rules={[{ required: true, message: '请选择出生时辰' }]}
        >
          <DatePicker.TimePicker
            style={{ width: '100%' }}
            format="HH:mm"
          />
        </Form.Item>

        <Form.Item
          name="gender"
          label="性别"
          rules={[{ required: true, message: '请选择性别' }]}
        >
          <Radio.Group>
            <Radio value="male">男</Radio>
            <Radio value="female">女</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            计算八字
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default BaziForm; 