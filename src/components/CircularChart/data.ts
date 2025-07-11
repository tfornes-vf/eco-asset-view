import { ChartData } from './types';

export const innerData: ChartData[] = [
  { name: 'Directa', value: 47, color: 'hsl(25, 95%, 53%)', category: 'inner' },
  { name: 'Indirecta', value: 51, color: 'hsl(210, 40%, 70%)', category: 'inner' },
  { name: 'Efectivo', value: 2, color: 'hsl(210, 40%, 85%)', category: 'inner' }
];

export const middleData: ChartData[] = [
  { name: 'Fondos de inversión', value: 26, color: 'hsl(25, 95%, 53%)', category: 'middle' },
  { name: 'Fondos líquidos', value: 25, color: 'hsl(25, 85%, 60%)', category: 'middle' },
  { name: 'Propiedades inmobiliarias', value: 22, color: 'hsl(25, 75%, 65%)', category: 'middle' },
  { name: 'Valores negociables', value: 15, color: 'hsl(25, 65%, 70%)', category: 'middle' },
  { name: 'Hedge funds', value: 10, color: 'hsl(25, 55%, 75%)', category: 'middle' },
  { name: 'Mixtos', value: 2, color: 'hsl(25, 45%, 80%)', category: 'middle' }
];

export const outerData: ChartData[] = [
  { name: 'Renta fija', value: 13, color: 'hsl(25, 95%, 53%)', category: 'outer' },
  { name: 'Private equity', value: 10, color: 'hsl(25, 85%, 58%)', category: 'outer' },
  { name: 'Renta variable', value: 9, color: 'hsl(25, 75%, 63%)', category: 'outer' },
  { name: 'Empresas no cotizadas y proyectos', value: 6, color: 'hsl(25, 65%, 68%)', category: 'outer' },
  { name: 'Commodities', value: 6, color: 'hsl(25, 55%, 73%)', category: 'outer' },
  { name: 'Venture capital', value: 6, color: 'hsl(25, 45%, 78%)', category: 'outer' },
  { name: 'Deuda privada', value: 3, color: 'hsl(25, 35%, 83%)', category: 'outer' },
  { name: 'Infraestructura', value: 2, color: 'hsl(25, 25%, 88%)', category: 'outer' },
  { name: 'Inmobiliario', value: 2, color: 'hsl(25, 15%, 93%)', category: 'outer' },
  { name: 'Obras de arte, joyas etc.', value: 2, color: 'hsl(210, 40%, 70%)', category: 'outer' }
];