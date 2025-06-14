import React from 'react';
import { ResponsiveLine } from '@nivo/line';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { DailyMetric } from '../../types/wellness';

interface LineChartProps {
  data: DailyMetric[];
  color: string;
  title: string;
  height?: number;
}

const LineChart: React.FC<LineChartProps> = ({ data, color, title, height = 300 }) => {
  const chartData = [{
    id: title,
    data: data.map(d => ({
      x: format(new Date(d.date), 'dd MMM', { locale: es }),
      y: d.value
    }))
  }];

  return (
    <div style={{ height }}>
      <ResponsiveLine
        data={chartData}
        margin={{ top: 20, right: 20, bottom: 50, left: 50 }}
        xScale={{ type: 'point' }}
        yScale={{ 
          type: 'linear',
          min: 0,
          max: 10,
          stacked: false
        }}
        curve="monotoneX"
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: -45,
          legend: 'Fecha',
          legendOffset: 45,
          legendPosition: 'middle'
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'Valor',
          legendOffset: -40,
          legendPosition: 'middle',
          format: value => Number(value).toFixed(1)
        }}
        enableGridX={false}
        enablePoints={true}
        pointSize={8}
        pointColor={color}
        pointBorderWidth={2}
        pointBorderColor={{ from: 'serieColor' }}
        pointLabelYOffset={-12}
        useMesh={true}
        enableArea={true}
        areaOpacity={0.1}
        colors={[color]}
        theme={{
          axis: {
            ticks: {
              text: {
                fill: '#666'
              }
            },
            legend: {
              text: {
                fill: '#666',
                fontSize: 12
              }
            }
          },
          grid: {
            line: {
              stroke: '#ddd',
              strokeWidth: 1
            }
          }
        }}
        tooltip={({ point }) => (
          <div
            style={{
              background: 'white',
              padding: '9px 12px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            <strong>{point.data.x}</strong>
            <br />
            Valor: {point.data.y}
          </div>
        )}
      />
    </div>
  );
};

export default LineChart; 