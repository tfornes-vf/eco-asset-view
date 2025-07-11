import React from 'react';

export const renderMiddleLabel = (entry: any, radius: number): React.ReactElement | null => {
  const RADIAN = Math.PI / 180;
  const midAngle = (entry.startAngle + entry.endAngle) / 2;
  const x = entry.cx + radius * Math.cos(-midAngle * RADIAN);
  const y = entry.cy + radius * Math.sin(-midAngle * RADIAN);

  if (entry.value < 3) return null; // Don't show labels for very small segments

  return React.createElement('text', {
    x: x,
    y: y,
    fill: 'hsl(var(--foreground))',
    textAnchor: x > entry.cx ? 'start' : 'end',
    dominantBaseline: 'central',
    fontSize: '11',
    fontWeight: '600',
    className: 'drop-shadow-md',
    style: {
      filter: 'drop-shadow(1px 1px 2px hsl(var(--background)))',
      stroke: 'hsl(var(--background))',
      strokeWidth: '0.5px',
      paintOrder: 'stroke fill'
    }
  }, entry.name);
};

export const renderOuterLabel = (entry: any, radius: number): React.ReactElement | null => {
  const RADIAN = Math.PI / 180;
  const midAngle = (entry.startAngle + entry.endAngle) / 2;
  const x = entry.cx + radius * Math.cos(-midAngle * RADIAN);
  const y = entry.cy + radius * Math.sin(-midAngle * RADIAN);
  
  // Line end points
  const lineEndX = entry.cx + (radius + 25) * Math.cos(-midAngle * RADIAN);
  const lineEndY = entry.cy + (radius + 25) * Math.sin(-midAngle * RADIAN);
  
  // Text position
  const textX = entry.cx + (radius + 35) * Math.cos(-midAngle * RADIAN);
  const textY = entry.cy + (radius + 35) * Math.sin(-midAngle * RADIAN);

  if (entry.value < 2) return null;

  return React.createElement('g', {}, [
    React.createElement('line', {
      key: 'line',
      x1: x,
      y1: y,
      x2: lineEndX,
      y2: lineEndY,
      stroke: 'hsl(var(--foreground))',
      strokeWidth: '1.5',
      opacity: '0.7'
    }),
    React.createElement('text', {
      key: 'text',
      x: textX,
      y: textY,
      fill: 'hsl(var(--foreground))',
      textAnchor: textX > entry.cx ? 'start' : 'end',
      dominantBaseline: 'central',
      fontSize: '10',
      fontWeight: '600',
      style: {
        filter: 'drop-shadow(1px 1px 2px hsl(var(--background)))',
        stroke: 'hsl(var(--background))',
        strokeWidth: '0.5px',
        paintOrder: 'stroke fill'
      }
    }, `${entry.name} ${entry.value}%`)
  ]);
};