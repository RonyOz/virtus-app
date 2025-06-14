import React from 'react';
import { ResponsiveRadar } from '@nivo/radar';
import { WellnessData } from '../../types/wellness';

interface RadarChartProps {
  data: WellnessData;
  height?: number;
}

const RadarChart: React.FC<RadarChartProps> = ({ data, height = 400 }) => {
  const chartData = [
    {
      metric: 'Estado de ánimo',
      value: data.mood,
      category: 'mood'
    },
    {
      metric: 'Energía',
      value: data.energy,
      category: 'energy'
    },
    {
      metric: 'Estrés',
      value: data.stress,
      category: 'stress'
    },
    {
      metric: 'Sueño',
      value: data.sleep,
      category: 'sleep'
    },
    {
      metric: 'Hidratación',
      value: data.water,
      category: 'water'
    },
    {
      metric: 'Ansiedad',
      value: data.anxiety,
      category: 'anxiety'
    }
  ];

  return (
    <div style={{ height }}>
      <ResponsiveRadar
        data={chartData}
        keys={['value']}
        indexBy="metric"
        maxValue={10}
        margin={{ top: 70, right: 80, bottom: 40, left: 80 }}
        borderColor={{ from: 'color' }}
        gridLevels={5}
        gridShape="circular"
        gridLabelOffset={20}
        enableDots={true}
        dotSize={8}
        dotColor={{ theme: 'background' }}
        dotBorderWidth={2}
        dotBorderColor={{ from: 'color' }}
        enableDotLabel={true}
        dotLabel="value"
        dotLabelYOffset={-12}
        colors={{ scheme: 'nivo' }}
        fillOpacity={0.25}
        blendMode="multiply"
        animate={true}
        motionConfig="gentle"
        theme={{
          background: 'transparent',
          text: {
            fontSize: 12,
            fill: '#666'
          },
          grid: {
            line: {
              stroke: '#ddd',
              strokeWidth: 1
            }
          }
        }}
        tooltip={({ index, value }) => (
          <div
            style={{
              background: 'white',
              padding: '9px 12px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            <strong>{index}</strong>
            <br />
            Valor: {value}
          </div>
        )}
      />
    </div>
  );
};

export default RadarChart; 