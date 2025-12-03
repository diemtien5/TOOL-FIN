import React, { useState } from 'react';
import { AmortizationRow } from '../types';
import { formatCurrency } from '../utils/loanCalculator';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface ScheduleTableProps {
  schedule: AmortizationRow[];
}

const ScheduleTable: React.FC<ScheduleTableProps> = ({ schedule }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex justify-between items-center bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        <span className="font-bold text-gray-800 text-lg">Bảng chi tiết trả nợ (Dư nợ giảm dần)</span>
        {isOpen ? <ChevronUp className="text-gray-500" /> : <ChevronDown className="text-gray-500" />}
      </button>
      
      {isOpen && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-600">
            <thead className="text-xs text-gray-700 uppercase bg-gray-100">
              <tr>
                <th scope="col" className="px-6 py-3">Kỳ</th>
                <th scope="col" className="px-6 py-3 text-right">Trả trong kỳ</th>
                <th scope="col" className="px-6 py-3 text-right text-feGreen">Gốc</th>
                <th scope="col" className="px-6 py-3 text-right text-feRed">Lãi</th>
                <th scope="col" className="px-6 py-3 text-right">Dư nợ còn lại</th>
              </tr>
            </thead>
            <tbody>
              {schedule.map((row) => (
                <tr key={row.month} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{row.month}</td>
                  <td className="px-6 py-4 text-right font-semibold">{formatCurrency(row.monthlyPayment)}</td>
                  <td className="px-6 py-4 text-right">{formatCurrency(row.principalPaid)}</td>
                  <td className="px-6 py-4 text-right text-feRed">{formatCurrency(row.interestPaid)}</td>
                  <td className="px-6 py-4 text-right">{formatCurrency(row.remainingBalance)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ScheduleTable;
