
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { LoanSummary } from '../types';

interface SummaryChartProps {
  data: LoanSummary;
}

const SummaryChart: React.FC<SummaryChartProps> = ({ data }) => {
  // data.totalPrincipal includes the insurance fee.
  // To visualize components properly, we subtract insurance from totalPrincipal to get "Net Principal"
  const netPrincipal = data.totalPrincipal - data.insuranceFee;

  const chartData = [
    { name: 'Tiền thực nhận', value: netPrincipal, color: '#EF3E42' }, // feRed
    { name: 'Phí bảo hiểm', value: data.insuranceFee, color: '#FFCC00' }, // feYellow
    { name: 'Lãi dự tính', value: data.totalInterest, color: '#009E60' }, // feGreen
  ];

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)}
            contentStyle={{ backgroundColor: 'white', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Legend verticalAlign="bottom" height={36} iconType="circle"/>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SummaryChart;
