import React, { useState, useEffect } from 'react';
import { Form, DatePicker, Radio, Button, Card, Cascader, Checkbox } from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { useBazi } from '../contexts/BaziContext';
import cityGeoData from '../../city_geo.json';

interface BaziFormData {
  birthDate: Dayjs;
  birthTime: Dayjs;
  gender: 'male' | 'female';
  birthPlace: [string, string, string?];  // [省, 市, 区]
  useTrueSolarTime: boolean;
}

interface CascaderOption {
  value: string;
  label: string;
  children?: CascaderOption[];
}

const BaziForm: React.FC = () => {
  const [form] = Form.useForm();
  const { setBirthDateTime } = useBazi();
  const [options, setOptions] = useState<CascaderOption[]>([]);
  const [useTrueSolarTime, setUseTrueSolarTime] = useState(false);

  // 构建级联选择器的选项
  useEffect(() => {
    const provinces = Array.from(new Set(cityGeoData.map(item => item.province)));
    const cascaderOptions = provinces.map(province => {
      const cities = Array.from(
        new Set(
          cityGeoData
            .filter(item => item.province === province)
            .map(item => item.city)
        )
      );

      return {
        value: province,
        label: province,
        children: cities.map(city => {
          const areas = cityGeoData
            .filter(
              item => item.province === province && item.city === city
            )
            .map(item => ({
              value: item.area,
              label: item.area
            }));

          return {
            value: city,
            label: city,
            children: areas
          };
        })
      };
    });

    setOptions(cascaderOptions);
  }, []);

  const onFinish = (values: BaziFormData) => {
    // console.log('Form submitted with values:', values);
    const date = values.birthDate;
    const time = values.birthTime;
    
    // 合并日期和时间
    const birthDateTime = date.clone()
      .hour(time.hour())
      .minute(time.minute())
      .second(0);

    // console.log('Combined birth date time:', birthDateTime.format('YYYY-MM-DD HH:mm:ss'));

    // 只在使用真太阳时时获取地理信息
    let location: { lng: number; lat: number; } | undefined = undefined;
    if (values.useTrueSolarTime && values.birthPlace) {
      const selectedLocation = cityGeoData.find(item => 
        item.province === values.birthPlace[0] &&
        item.city === values.birthPlace[1] &&
        (values.birthPlace[2] ? item.area === values.birthPlace[2] : true)
      );

      if (selectedLocation) {
        location = { 
          lng: parseFloat(selectedLocation.lng), 
          lat: parseFloat(selectedLocation.lat) 
        };
        // console.log('Selected location:', location);
      } else {
        console.error('未找到选中地点的经纬度信息');
        return;
      }
    }

    setBirthDateTime(
      birthDateTime, 
      values.gender,
      location,
      values.useTrueSolarTime
    );
  };

  // 处理真太阳时选项变化
  const handleTrueSolarTimeChange = (e: any) => {
    setUseTrueSolarTime(e.target.checked);
    // 如果取消选中真太阳时，清空出生地点
    if (!e.target.checked) {
      form.setFieldValue('birthPlace', undefined);
    }
  };

  return (
    <Card 
      title="生辰信息" 
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
          birthTime: dayjs(),
          useTrueSolarTime: false
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
          name="useTrueSolarTime"
          valuePropName="checked"
        >
          <Checkbox onChange={handleTrueSolarTimeChange}>使用真太阳时</Checkbox>
        </Form.Item>

        <Form.Item
          name="birthPlace"
          label={<span style={{ color: 'var(--text-primary)', fontSize: '16px' }}>出生地点</span>}
          rules={[{ 
            required: useTrueSolarTime, 
            message: '使用真太阳时时必须选择出生地点' 
          }]}
          style={{ display: useTrueSolarTime ? 'block' : 'none' }}
        >
          <Cascader
            options={options}
            placeholder="选择出生地点"
            style={{ width: '100%' }}
            showSearch={{
              filter: (inputValue, path) => {
                return path.some(option => 
                  option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1
                );
              }
            }}
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
            生成咒语
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default BaziForm; 