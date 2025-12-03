
import React, { useState, useMemo } from 'react';
import { calculateLoan, formatCurrency } from './utils/loanCalculator';
import { INTEREST_RATES, LOAN_LIMITS, INSURANCE_RATES, PARTNERS } from './constants';
import { ConsultantInfo } from './types';
import Logo from './components/Logo';
import InputSlider from './components/InputSlider';
import ConsultantForm from './components/ConsultantForm';
import ReceiptModal from './components/ReceiptModal';
import { Calculator, ShieldCheck, AlertCircle, Receipt, Building2, ChevronRight } from 'lucide-react';

const App: React.FC = () => {
  const [amount, setAmount] = useState<number>(20000000);
  const [months, setMonths] = useState<number>(12);
  const [interestRate, setInterestRate] = useState<number>(44);
  const [insuranceRate, setInsuranceRate] = useState<number>(5.5);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  
  const [consultantInfo, setConsultantInfo] = useState<ConsultantInfo>({
    name: '',
    phone: '',
    zalo: '',
    facebook: '',
    bankId: 'fe',
    hotline: '1900 6535'
  });

  const loanSummary = useMemo(() => {
    return calculateLoan({ amount, months, interestRate, insuranceRate });
  }, [amount, months, interestRate, insuranceRate]);

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-12">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10 print:hidden">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <Logo bankId={consultantInfo.bankId} scale={0.9} />
          <div className="flex items-center text-xs text-gray-400 gap-1">
             <Calculator size={14} />
             <span>Ước tính khoản vay</span>
          </div>
        </div>
      </header>

      <main className="max-w-xl mx-auto px-3 py-4 print:hidden space-y-4">
        
        {/* Supported Partners Chips - Horizontal Scroll */}
        <div className="overflow-x-auto pb-2 -mx-3 px-3 scrollbar-hide">
            <div className="flex gap-2 w-max">
                {PARTNERS.map(p => (
                    <button 
                        key={p.id} 
                        onClick={() => setConsultantInfo({...consultantInfo, bankId: p.id, hotline: p.hotline})}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                            consultantInfo.bankId === p.id 
                            ? 'shadow-md scale-105' 
                            : 'opacity-70 grayscale'
                        }`}
                        style={{ 
                            backgroundColor: consultantInfo.bankId === p.id ? 'white' : '#f3f4f6', 
                            color: p.color,
                            borderColor: consultantInfo.bankId === p.id ? p.color : 'transparent'
                        }}
                    >
                        {p.shortName}
                    </button>
                ))}
            </div>
        </div>

        {/* MAIN CARD */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            
            {/* Input Section */}
            <div className="p-5 space-y-6">
              <InputSlider
                label="Số tiền thực nhận"
                value={amount}
                min={LOAN_LIMITS.minAmount}
                max={LOAN_LIMITS.maxAmount}
                step={LOAN_LIMITS.stepAmount}
                onChange={setAmount}
                isCurrency={true}
              />

              <InputSlider
                label="Thời hạn vay"
                value={months}
                min={LOAN_LIMITS.minMonths}
                max={LOAN_LIMITS.maxMonths}
                step={LOAN_LIMITS.stepMonths}
                onChange={setMonths}
                unit="tháng"
              />

              {/* Configurations */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  {/* Interest Rate */}
                  <div>
                    <label className="text-xs text-gray-500 font-semibold mb-2 block flex items-center gap-1">
                        Lãi suất (%/năm) <AlertCircle size={10} />
                    </label>
                    <div className="grid grid-cols-4 gap-1.5">
                      {INTEREST_RATES.map((rate) => (
                        <button
                          key={rate}
                          onClick={() => setInterestRate(rate)}
                          className={`py-1.5 px-0.5 rounded text-xs font-bold transition-all border ${
                            interestRate === rate
                              ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                              : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-blue-50'
                          }`}
                        >
                          {rate}%
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Insurance Rate */}
                  <div>
                     <label className="text-xs text-gray-500 font-semibold mb-2 block flex items-center justify-between">
                        <span>Bảo hiểm ({insuranceRate}%)</span>
                     </label>
                     <div className="grid grid-cols-5 gap-1.5">
                        {INSURANCE_RATES.map((rate) => (
                          <button
                            key={rate}
                            onClick={() => setInsuranceRate(rate)}
                            className={`py-1.5 px-0.5 rounded text-xs font-bold transition-all border ${
                              insuranceRate === rate
                                ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                                : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-blue-50'
                            }`}
                          >
                            {rate}
                          </button>
                        ))}
                     </div>
                  </div>
              </div>
            </div>

            {/* QUICK RESULT SECTION - Highlighted Blue Theme */}
            <div className="bg-gradient-to-b from-blue-50 to-white px-5 py-6 border-t border-blue-100">
                <div className="text-center mb-6">
                  <span className="text-blue-500 text-xs uppercase tracking-widest font-semibold block mb-1">Trả góp hàng tháng</span>
                  <span className="text-4xl font-extrabold text-blue-600 tracking-tighter drop-shadow-sm">
                    {formatCurrency(loanSummary.monthlyPayment)}
                  </span>
                  <p className="text-[10px] text-gray-400 mt-1">(Đã bao gồm gốc, lãi & phí bảo hiểm)</p>
                </div>

                {/* Compact Details Grid */}
                <div className="grid grid-cols-2 gap-3 text-sm mb-6">
                    <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                        <span className="text-gray-400 text-xs block mb-1">Tiền thực nhận</span>
                        <span className="font-bold text-gray-900 text-base">{formatCurrency(amount)}</span>
                    </div>
                     <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                        <span className="text-gray-400 text-xs block mb-1">Phí bảo hiểm</span>
                        <span className="font-bold text-yellow-600 text-base">{formatCurrency(loanSummary.insuranceFee)}</span>
                    </div>
                </div>

                {/* Total Payment Row (Simplified) */}
                <div className="flex justify-between items-center px-3 py-2 bg-gray-50 rounded-lg mb-4">
                     <span className="text-xs text-gray-500 font-medium">Tổng tiền phải trả (dự tính)</span>
                     <span className="text-sm font-bold text-gray-700">{formatCurrency(loanSummary.totalPayment)}</span>
                </div>

                {/* CTA BUTTON - Professional Blue Gradient */}
                <button 
                    onClick={() => setIsReceiptOpen(true)}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-[0.98] flex items-center justify-center gap-2 group"
                >
                    <Receipt size={18} className="group-hover:rotate-12 transition-transform" />
                    <span className="tracking-wide">Xuất Phiếu Tính Sơ Bộ</span>
                    <ChevronRight size={18} className="opacity-60 group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        </div>

        {/* Consultant Form */}
        <ConsultantForm info={consultantInfo} onChange={setConsultantInfo} />

        {/* Disclaimer */}
        <p className="text-center text-[10px] text-gray-400 px-4 pb-8">
            * Công cụ tính toán chỉ mang tính chất tham khảo. Số liệu thực tế có thể thay đổi tùy theo quy định của từng đơn vị tài chính tại thời điểm vay.
        </p>

      </main>

      <ReceiptModal 
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
        summary={loanSummary}
        input={{ amount, months, interestRate, insuranceRate }}
        consultant={consultantInfo}
      />
    </div>
  );
};

export default App;
