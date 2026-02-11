import React from 'react';
import { ChartProps } from '@/types/components';

export const Chart: React.FC<ChartProps> = ({
  type,
  data,
  title,
  height = 300,
}) => {
  const maxValue = Math.max(...data.map(d => d.value));

  const renderBarChart = () => (
    <div className="flex items-end justify-around h-full gap-2 px-4">
      {data.map((point, index) => (
        <div key={index} className="flex flex-col items-center gap-2 flex-1">
          <div
            className="w-full bg-primary-500 rounded-t transition-all hover:bg-primary-600"
            style={{
              height: `${(point.value / maxValue) * 100}%`,
              backgroundColor: point.color || undefined,
            }}
          />
          <span className="text-xs text-neutral-600 text-center">{point.label}</span>
        </div>
      ))}
    </div>
  );

  const renderLineChart = () => (
    <div className="relative h-full px-4">
      <svg width="100%" height="100%" className="overflow-visible">
        {data.map((point, index) => {
          if (index === 0) return null;
          const prevPoint = data[index - 1];
          const x1 = ((index - 1) / (data.length - 1)) * 100;
          const y1 = 100 - (prevPoint.value / maxValue) * 100;
          const x2 = (index / (data.length - 1)) * 100;
          const y2 = 100 - (point.value / maxValue) * 100;
          
          return (
            <line
              key={index}
              x1={`${x1}%`}
              y1={`${y1}%`}
              x2={`${x2}%`}
              y2={`${y2}%`}
              stroke="#3b82f6"
              strokeWidth="2"
            />
          );
        })}
        {data.map((point, index) => {
          const x = (index / (data.length - 1)) * 100;
          const y = 100 - (point.value / maxValue) * 100;
          
          return (
            <circle
              key={index}
              cx={`${x}%`}
              cy={`${y}%`}
              r="4"
              fill="#3b82f6"
            />
          );
        })}
      </svg>
      <div className="flex justify-around mt-2">
        {data.map((point, index) => (
          <span key={index} className="text-xs text-neutral-600">{point.label}</span>
        ))}
      </div>
    </div>
  );

  const renderPieChart = () => {
    const total = data.reduce((sum, point) => sum + point.value, 0);
    let currentAngle = 0;

    return (
      <div className="flex items-center justify-center h-full">
        <svg width="200" height="200" viewBox="0 0 200 200">
          {data.map((point, index) => {
            const percentage = point.value / total;
            const angle = percentage * 360;
            const startAngle = currentAngle;
            currentAngle += angle;

            const x1 = 100 + 80 * Math.cos((startAngle - 90) * Math.PI / 180);
            const y1 = 100 + 80 * Math.sin((startAngle - 90) * Math.PI / 180);
            const x2 = 100 + 80 * Math.cos((currentAngle - 90) * Math.PI / 180);
            const y2 = 100 + 80 * Math.sin((currentAngle - 90) * Math.PI / 180);
            const largeArc = angle > 180 ? 1 : 0;

            const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];
            const color = point.color || colors[index % colors.length];

            return (
              <path
                key={index}
                d={`M 100 100 L ${x1} ${y1} A 80 80 0 ${largeArc} 1 ${x2} ${y2} Z`}
                fill={color}
              />
            );
          })}
        </svg>
        <div className="ml-6">
          {data.map((point, index) => {
            const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];
            const color = point.color || colors[index % colors.length];
            return (
              <div key={index} className="flex items-center gap-2 mb-1">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: color }} />
                <span className="text-sm text-neutral-700">{point.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white border border-neutral-200 rounded-lg p-6">
      {title && (
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">{title}</h3>
      )}
      <div style={{ height: `${height}px` }}>
        {type === 'bar' && renderBarChart()}
        {type === 'line' && renderLineChart()}
        {type === 'pie' && renderPieChart()}
      </div>
    </div>
  );
};