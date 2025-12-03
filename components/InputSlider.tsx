
import React from 'react';
import { formatCurrency } from '../utils/loanCalculator';

interface InputSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (val: number) => void;
  unit?: string;
  isCurrency?: boolean;
}

const InputSlider: React.FC<InputSliderProps> = ({ 
  label, value, min, max, step, onChange, unit, isCurrency 
}) => {
  return (
    <div className="mb-6">
      <div className="flex justify-between items-end mb-2">
        <label className="text-gray-700 font-semibold">{label}</label>
        <div className="text-blue-600 font-bold text-xl">
          {isCurrency ? formatCurrency(value) : value}
          {unit && <span className="text-sm text-gray-500 ml-1 font-normal">{unit}</span>}
        </div>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
      />
      <div className="flex justify-between text-xs text-gray-400 mt-1">
        <span>{isCurrency ? formatCurrency(min) : `${min} ${unit}`}</span>
        <span>{isCurrency ? formatCurrency(max) : `${max} ${unit}`}</span>
      </div>
    </div>
  );
};

export default InputSlider;
