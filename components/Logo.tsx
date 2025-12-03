
import React, { useState } from 'react';
import { PARTNERS } from '../constants';

interface LogoProps {
  scale?: number;
  bankId?: string;
  justify?: 'start' | 'center' | 'end';
  height?: string; // e.g. "h-14", "h-8"
}

const Logo: React.FC<LogoProps> = ({ scale = 1, bankId = 'fe', justify = 'center', height = 'h-14' }) => {
  const [imageError, setImageError] = useState(false);
  
  // Only apply scale transform if scale is explicitly not 1
  // We disable transform if we are using a specific height in a flow layout (like receipt) to avoid bounding box issues
  const style = scale !== 1 ? {
    transform: `scale(${scale})`,
    transformOrigin: justify === 'start' ? 'left center' : justify === 'end' ? 'right center' : 'center center',
  } : {};

  const justifyClass = justify === 'start' ? 'justify-start' : justify === 'end' ? 'justify-end' : 'justify-center';
  const partner = PARTNERS.find(p => p.id === bankId) || PARTNERS[0];

  // If we have a logo URL and haven't encountered an error, render the image
  if (partner.logo && !imageError) {
    return (
      <div className={`flex items-center gap-2 select-none ${justifyClass}`} style={style}>
        <div className={`bg-white p-1 flex items-center ${justifyClass}`}>
            <img 
                src={partner.logo} 
                alt={`${partner.name} Logo`} 
                className={`${height} w-auto object-contain max-w-[200px]`} 
                onError={() => setImageError(true)}
                crossOrigin="anonymous"
            />
        </div>
      </div>
    );
  }

  // --- FALLBACK RENDERING (If image fails) ---
  // This section ensures the logo looks "drawn" and not "faked" by matching colors and fonts.
  return (
    <div className={`flex items-center gap-2 select-none ${justifyClass}`} style={style}>
      <div className="bg-white p-1 rounded border border-gray-100 flex items-center justify-center shadow-sm">
        <div className="flex flex-col items-center leading-none px-1">
          
          {bankId === 'shb' ? (
             <>
                <div className="flex items-baseline tracking-tighter">
                    <span className="font-extrabold text-3xl text-[#0054A6]">SHB</span>
                    <span className="font-extrabold text-3xl text-[#F37021]">Finance</span>
                </div>
                <span className="text-gray-500 font-bold text-[8px] tracking-widest uppercase mt-0.5">Tài chính tiêu dùng</span>
             </>
          ) : bankId === 'fe' ? (
             <>
                <div className="flex items-baseline tracking-tighter">
                    <span className="font-extrabold text-3xl text-[#EF3E42]">FE</span>
                    <span className="font-extrabold text-3xl text-[#009E60] ml-1">CREDIT</span>
                </div>
                <span className="text-gray-500 font-bold text-[8px] tracking-widest uppercase mt-0.5">Vay tiêu dùng tín chấp</span>
             </>
          ) : bankId === 'mirae' ? (
             <>
                <div className="relative">
                    <span className="font-extrabold text-2xl text-[#003764] italic">MIRAE ASSET</span>
                    {/* Orange accent line simulated */}
                    <div className="absolute -top-1 -right-2 w-3 h-3 border-t-2 border-r-2 border-[#F58220] rounded-tr-full"></div>
                </div>
                <span className="text-[#003764] font-medium text-[9px]">Finance Company</span>
             </>
          ) : bankId === 'hdbank' ? (
             <div className="flex items-center gap-1">
                <span className="font-bold text-2xl text-[#E60000]">HDBank</span>
                <div className="w-4 h-4 bg-[#FFCC00] rounded-tr-xl rounded-bl-xl"></div>
             </div>
          ) : bankId === 'tnex' ? (
             <div className="bg-[#00C2CB] rounded-lg px-2 py-1">
                <span className="font-bold text-2xl text-white font-sans">TNEX</span>
             </div>
          ) : bankId === 'vikki' ? (
             <div className="flex flex-col items-center">
                 {/* Gradient Text for Vikki */}
                 <span className="font-extrabold text-3xl bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-orange-500 pb-1">
                    Vikki
                 </span>
                 <span className="text-gray-500 font-bold text-[8px]">Digital Bank</span>
             </div>
          ) : bankId === 'cake' ? (
             <div className="bg-[#ff006e] rounded-xl px-2 py-0.5 flex flex-col items-center">
                <span className="font-black text-2xl text-white tracking-tighter" style={{ fontFamily: 'sans-serif' }}>CAKE</span>
                <span className="text-white font-medium text-[6px] tracking-wide -mt-1">by VPBank</span>
             </div>
          ) : bankId === 'lotte' ? (
             <div className="flex items-center gap-2 pl-1">
                {/* Lotte Red Diamond Symbol */}
                <div className="w-6 h-6 bg-[#DA291C] rounded-md transform rotate-45 flex items-center justify-center mb-1">
                    <span className="text-white font-serif text-lg italic font-bold -rotate-45 pb-0.5 pr-0.5">ℓ</span>
                </div>
                <span className="font-extrabold text-2xl text-[#DA291C] tracking-tight ml-1">LOTTE FINANCE</span>
             </div>
          ) : (
            // Generic Fallback
            <>
                <span 
                    className="font-extrabold text-3xl tracking-tighter whitespace-nowrap"
                    style={{ color: partner.color }}
                >
                    {partner.shortName}
                </span>
                <span className="text-gray-400 font-bold text-[8px] tracking-widest uppercase">Finance</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Logo;
