
import React, { useRef, useState } from 'react';
import { LoanInput, LoanSummary, ConsultantInfo } from '../types';
import { formatCurrency } from '../utils/loanCalculator';
import Logo from './Logo';
import { X, Download, Phone, User, Loader2 } from 'lucide-react';
import { PARTNERS } from '../constants';
import html2canvas from 'html2canvas';

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  summary: LoanSummary;
  input: LoanInput;
  consultant: ConsultantInfo;
}

const ReceiptModal: React.FC<ReceiptModalProps> = ({ isOpen, onClose, summary, input, consultant }) => {
  const receiptRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showInsurance, setShowInsurance] = useState(true);

  if (!isOpen) return null;

  const now = new Date();
  const currentDate = now.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
  const currentTime = now.toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const partner = PARTNERS.find(p => p.id === consultant.bankId) || PARTNERS[0];

  const handleDownload = async () => {
    if (!receiptRef.current) return;
    
    setIsDownloading(true);
    try {
        // Wait for a brief moment to ensure all styles are settled
        await new Promise(resolve => setTimeout(resolve, 100));

        const canvas = await html2canvas(receiptRef.current, {
            useCORS: true,
            scale: 3, // High resolution
            backgroundColor: '#ffffff',
            logging: false,
            scrollY: -window.scrollY,
            width: 350, // Force the capture width to match the element width
            windowWidth: 350, // Simulate a mobile window width
            ignoreElements: (element) => {
                return element.hasAttribute('data-html2canvas-ignore');
            }
        });
        
        const image = canvas.toDataURL("image/png");
        const link = document.createElement('a');
        link.href = image;
        link.download = `Phieu_Tam_Tinh_${consultant.bankId}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (error) {
        console.error("Error generating image:", error);
        alert("Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
        setIsDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative animate-in fade-in zoom-in duration-300">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute -top-12 right-0 md:-right-10 text-white hover:text-gray-200 transition-colors bg-white/10 p-2 rounded-full backdrop-blur-md"
        >
          <X size={24} />
        </button>

        {/* --- RECEIPT CONTAINER --- */}
        {/* CRITICAL: Fixed width (w-[350px]) ensures the download matches the screen exactly. */}
        <div 
            ref={receiptRef} 
            className="bg-white text-gray-800 rounded-none md:rounded-xl overflow-hidden shadow-2xl relative mx-auto"
            style={{ width: '350px', minWidth: '350px', maxWidth: '350px' }} 
        >
          
          {/* Top Bar Color */}
          <div className="h-1.5 w-full" style={{ backgroundColor: partner.color }}></div>

          <div className="p-5 pb-4 relative">
            
            {/* --- HEADER SECTION --- */}
            {/* Flex-col ensures Logo and Title are stacked and cannot overlap */}
            <div className="mb-4 flex flex-col gap-2">
                
                {/* 1. Logo Block (Top Left) */}
                <div className="w-full flex justify-start">
                   {/* Explicit height 'h-8' (32px) ensures proper spacing in flow */}
                   <Logo height="h-10" bankId={consultant.bankId} justify="start" />
                </div>

                {/* 2. Title & Date Centered (Below Logo) */}
                <div className="text-center border-b border-dashed border-gray-200 pb-3 mb-3">
                    <h2 className="font-black text-gray-800 text-lg uppercase tracking-tight leading-snug px-2">
                         ƯỚC TÍNH SƠ BỘ KHOẢN VAY
                    </h2>
                    <p className="text-[10px] text-gray-400 font-medium mt-0.5">
                        Ngày {currentDate} - {currentTime}
                    </p>
                </div>

                {/* 3. Details Block (Compact Group) */}
                <div className="bg-gray-50 rounded-lg border border-gray-100 p-3 space-y-2">
                    {/* Amount Row */}
                    <div className="flex justify-between items-center text-xs">
                         <span className="text-gray-500 font-semibold">Số tiền vay</span>
                         <span className="font-bold text-gray-900 text-sm">{formatCurrency(input.amount)}</span>
                    </div>
                    
                    {/* Divider */}
                    <div className="border-t border-dashed border-gray-200"></div>

                    {/* Duration Row */}
                     <div className="flex justify-between items-center text-xs">
                         <span className="text-gray-500 font-semibold">Thời hạn vay</span>
                         <span className="font-bold text-gray-900 text-sm">{input.months} tháng</span>
                    </div>
                </div>
            </div>

            {/* --- BODY SECTION --- */}
            <div className="space-y-3">
              
              {/* Monthly Payment (Blue Block) */}
              <div className="bg-blue-50 py-4 px-4 rounded-xl border border-blue-100 text-center relative overflow-hidden">
                <div className="absolute -right-6 -top-6 w-20 h-20 bg-blue-100/50 rounded-full blur-xl"></div>
                
                <span className="text-blue-600 text-[10px] font-bold uppercase tracking-widest block mb-1 relative z-10">
                    Kết quả ước tính mỗi tháng
                </span>
                <span className="text-3xl font-extrabold text-blue-700 block tracking-tight leading-none my-1 relative z-10 drop-shadow-sm">
                    {formatCurrency(summary.monthlyPayment)}
                </span>
                <span className="text-[10px] text-blue-500 font-medium relative z-10 block mt-1">
                    (Đã bao gồm gốc + lãi)
                </span>
              </div>

              {/* Insurance Row (Conditional) */}
              {showInsurance && (
                  <div className="flex justify-between items-center px-2 py-1.5 bg-yellow-50/50 rounded border border-yellow-100/50">
                    <span className="text-gray-600 text-[11px] font-medium flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-yellow-400"></span>
                        Bảo hiểm khoản vay ({input.insuranceRate}%)
                    </span>
                    <span className="text-xs font-bold text-gray-700">{formatCurrency(summary.insuranceFee)}</span>
                  </div>
              )}

              {/* Toggle (Visible only in UI) */}
              <div className="flex justify-center pt-1" data-html2canvas-ignore="true">
                  <label className="flex items-center gap-2 cursor-pointer group px-3 py-1.5 hover:bg-gray-100 rounded-md transition-colors">
                      <div className="relative inline-block w-7 h-4 align-middle select-none">
                          <input 
                              type="checkbox" 
                              checked={showInsurance}
                              onChange={() => setShowInsurance(!showInsurance)}
                              className="absolute block w-3 h-3 rounded-full bg-white border-2 appearance-none cursor-pointer transition-all duration-300 top-0.5 left-0.5"
                              style={{ 
                                  transform: showInsurance ? 'translateX(100%)' : 'translateX(0)',
                                  borderColor: showInsurance ? '#3b82f6' : '#d1d5db'
                              }}
                          />
                          <div className={`block overflow-hidden h-4 rounded-full cursor-pointer transition-colors duration-300 ${showInsurance ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                      </div>
                      <span className="text-[10px] font-medium text-gray-400 group-hover:text-blue-500 transition-colors">
                          Hiện phí bảo hiểm
                      </span>
                  </label>
              </div>

              {/* Disclaimer */}
              <div className="text-[9px] text-gray-400 text-justify leading-snug px-1">
                * Kết quả tính toán mang tính chất tham khảo sơ bộ. Số liệu thực tế có thể chênh lệch nhỏ tùy thuộc hồ sơ thẩm định và lịch sử tín dụng
              </div>
            </div>
          </div>

          {/* --- FOOTER: Consultant Info --- */}
          <div className="bg-white border-t-4 border-gray-100 p-4">
             <div className="flex items-start gap-3">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <div className="w-10 h-12 bg-gray-100 rounded border border-gray-200 overflow-hidden flex items-center justify-center">
                    {consultant.avatar ? (
                      <img src={consultant.avatar} alt="Avatar" className="w-full h-full object-cover" crossOrigin="anonymous" />
                    ) : (
                      <User className="text-gray-300" size={20} />
                    )}
                  </div>
                </div>

                {/* Info Text */}
                <div className="flex-grow">
                   <p className="text-[9px] text-gray-400 uppercase tracking-wider font-bold mb-0.5">Tư vấn viên hỗ trợ</p>
                   {/* Name */}
                   <p className="font-bold text-gray-900 text-sm leading-snug break-words">
                        {consultant.name || 'Chưa cập nhật tên'}
                   </p>
                   
                   <div className="flex flex-col mt-1 space-y-0.5">
                       {/* Phone */}
                       <p className="font-bold text-xs flex items-center gap-1.5 whitespace-nowrap" style={{ color: partner.color }}>
                          <Phone size={10} style={{ fill: partner.color }} /> 
                          {consultant.phone || '---'}
                       </p>
                       
                       {/* Socials */}
                       {(consultant.zalo || consultant.facebook) && (
                           <div className="text-[10px] text-gray-500 leading-snug break-all">
                               {consultant.zalo && <span>Zalo: {consultant.zalo}</span>}
                               {consultant.zalo && consultant.facebook && <span className="mx-1">•</span>}
                               {consultant.facebook && <span>FB: {consultant.facebook}</span>}
                           </div>
                       )}
                   </div>
                </div>
             </div>

             {/* Bottom Bar: Hotline & Disclaimer */}
             <div className="mt-3 pt-2 border-t border-dashed border-gray-200">
                <div className="flex justify-between items-center">
                     <span className="text-[9px] text-gray-400 font-medium">Tổng đài hỗ trợ</span>
                     <span className="text-xs font-black" style={{ color: partner.color }}>{consultant.hotline}</span>
                </div>
                <div className="text-right mt-1">
                    <span className="text-[9px] text-gray-400 italic">Không hỗ trợ nợ xấu</span>
                </div>
             </div>
          </div>
        </div>

        {/* --- DOWNLOAD BUTTON --- */}
        <div className="mt-6 flex justify-center">
          <button 
            className="w-[350px] bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-blue-200 hover:from-blue-700 hover:to-indigo-700 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
            onClick={handleDownload}
            disabled={isDownloading}
          >
            {isDownloading ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
            {isDownloading ? 'Đang tạo ảnh...' : 'Tải Hóa Đơn'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default ReceiptModal;
