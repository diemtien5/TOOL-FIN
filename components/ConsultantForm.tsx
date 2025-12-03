
import React, { useRef } from 'react';
import { ConsultantInfo } from '../types';
import { PARTNERS } from '../constants';
import { UserCircle, Phone, MessageCircle, Facebook, Camera, Building2 } from 'lucide-react';

interface ConsultantFormProps {
  info: ConsultantInfo;
  onChange: (info: ConsultantInfo) => void;
}

const ConsultantForm: React.FC<ConsultantFormProps> = ({ info, onChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (field: keyof ConsultantInfo, value: string) => {
    onChange({ ...info, [field]: value });
  };

  const handleBankChange = (bankId: string) => {
    const partner = PARTNERS.find(p => p.id === bankId);
    if (partner) {
        onChange({ 
            ...info, 
            bankId: bankId, 
            hotline: partner.hotline 
        });
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      onChange({ ...info, avatar: imageUrl });
    }
  };

  // Common input class for consistent styling
  const inputClass = "w-full pl-9 pr-3 py-2.5 text-sm font-medium text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-feGreen focus:border-transparent focus:bg-white outline-none transition-colors placeholder-gray-400";

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mt-6">
      <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2 text-sm uppercase tracking-wide">
        <UserCircle size={18} className="text-feGreen" />
        Thông tin nhân viên tư vấn
      </h3>
      
      <div className="mb-4">
        <label className="text-xs text-gray-500 mb-1 block font-semibold">Đơn vị tài chính</label>
        <div className="relative">
          <Building2 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <select
            value={info.bankId}
            onChange={(e) => handleBankChange(e.target.value)}
            className={inputClass}
          >
            {PARTNERS.map(partner => (
                <option key={partner.id} value={partner.id}>{partner.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex gap-4 items-start mb-4">
        {/* Avatar Upload */}
        <div className="flex-shrink-0">
          <div 
            className="w-20 h-24 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors overflow-hidden relative"
            onClick={() => fileInputRef.current?.click()}
          >
            {info.avatar ? (
              <img src={info.avatar} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <div className="text-center p-2">
                <Camera size={20} className="text-gray-400 mx-auto mb-1" />
                <span className="text-[10px] text-gray-500 font-medium leading-tight block">Tải ảnh</span>
              </div>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleImageUpload}
            />
          </div>
          {info.avatar && (
            <button 
              onClick={() => onChange({...info, avatar: undefined})}
              className="text-[10px] text-red-500 hover:text-red-700 font-medium mt-1 w-full text-center"
            >
              Xóa ảnh
            </button>
          )}
        </div>

        {/* Basic Info Inputs */}
        <div className="flex-grow space-y-3">
          <div>
            <label className="text-xs text-gray-500 mb-1 block font-semibold">Họ và tên</label>
            <div className="relative">
              <UserCircle size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                value={info.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Nhập họ tên..."
                className={inputClass}
              />
            </div>
          </div>
          <div>
             <label className="text-xs text-gray-500 mb-1 block font-semibold">Số điện thoại</label>
              <div className="relative">
                <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="tel"
                  value={info.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  placeholder="09xx..."
                  className={inputClass}
                />
              </div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block font-semibold">Zalo</label>
              <div className="relative">
                <MessageCircle size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  value={info.zalo}
                  onChange={(e) => handleChange('zalo', e.target.value)}
                  placeholder="Số Zalo"
                  className={inputClass}
                />
              </div>
            </div>
             <div>
              <label className="text-xs text-gray-500 mb-1 block font-semibold">Facebook</label>
              <div className="relative">
                <Facebook size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  value={info.facebook}
                  onChange={(e) => handleChange('facebook', e.target.value)}
                  placeholder="Tên hoặc Link FB"
                  className={inputClass}
                />
              </div>
            </div>
        </div>
        
        <div>
             <label className="text-xs text-gray-500 mb-1 block font-semibold">Hotline tổng đài (Tự động)</label>
              <div className="relative">
                <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  value={info.hotline}
                  onChange={(e) => handleChange('hotline', e.target.value)}
                  placeholder="1900xxxx"
                  className={inputClass}
                />
              </div>
          </div>
      </div>
    </div>
  );
};

export default ConsultantForm;
