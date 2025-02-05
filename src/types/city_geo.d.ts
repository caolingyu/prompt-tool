declare module '*.json' {
  const value: {
    province: string;
    city: string;
    area: string;
    lat: string;
    lng: string;
    country: string;
  }[];
  export default value;
} 