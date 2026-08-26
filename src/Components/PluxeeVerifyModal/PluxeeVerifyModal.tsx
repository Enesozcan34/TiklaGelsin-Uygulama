import { useState } from 'react';
import { FaChevronDown, FaXmark } from 'react-icons/fa6';

const formatPluxeeCode = (value: string): string =>
  value
    .replace(/\D/g, '')
    .slice(0, 6)
    .replace(/(.{3})/g, '$1 ')
    .trim();

interface PluxeeVerifyModalProps {
  phone: string;
  expectedCode: string;
  onClose: () => void;
  onVerified: () => void;
}

const PluxeeVerifyModal = ({ phone, expectedCode, onClose, onVerified }: PluxeeVerifyModalProps) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const digitsOnly = code.replace(/\D/g, '');
  const isComplete = digitsOnly.length === 6;

  const handleSubmit = () => {
    if (!isComplete) return;
    if (digitsOnly === expectedCode) {
      setError('');
      onVerified();
    } else {
      setError('Girdiğiniz ödeme kodu hatalı. Lütfen tekrar deneyin.');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl w-full max-w-sm flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-gray-100 shrink-0">
          <h2 className="text-gray-800 text-lg">Yemek Kartı</h2>
          <button
            type="button"
            aria-label="Kapat"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 -mt-1 -mr-1"
          >
            <FaXmark className="w-4 h-4" />
          </button>
        </div>

        <div className="px-5 py-5 flex flex-col gap-4">
          <div className="border border-gray-100 rounded-2xl px-5 py-6 flex flex-col items-center gap-1">
            <span className="text-2xl font-bold text-[#0a0a5c] tracking-tight">pluxee</span>
            <span className="text-[11px] text-gray-400">a sodexo company</span>
          </div>

          <div>
            <h3 className="text-gray-800 text-base">Pluxee'ye Giriş Yap</h3>
            <p className="text-xs text-gray-500 leading-relaxed mt-1">
              Pluxee kartınızla online ödeme yapabilmek için Pluxee Mobil uygulaması üzerinden "Ödeme Yap" butonuna
              basarak mobil ödeme kodunuzu almanız gerekmektedir!
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative shrink-0">
              <span className="absolute left-4 top-0 -translate-y-1/2 bg-white px-1 text-[11px] text-gray-300">
                Telefon Numarası
              </span>
              <div className="border border-gray-200 bg-gray-100 rounded-full h-full px-4 pt-4 pb-2.5 text-sm text-gray-400 flex items-center gap-1.5">
                +90 <FaChevronDown className="w-2.5 h-2.5" />
              </div>
            </div>
            <div className="flex-1 min-w-0 border border-gray-200 bg-gray-100 rounded-full px-5 pt-4 pb-2.5 text-sm text-gray-400 truncate">
              {phone || '5xx xxx xx xx'}
            </div>
          </div>

          <div>
            <div className="relative">
              <span className="absolute left-4 top-0 -translate-y-1/2 bg-white px-1 text-[11px] text-gray-500">
                Ödeme kodun
              </span>
              <input
                type="text"
                inputMode="numeric"
                value={code}
                onChange={(event) => {
                  setCode(formatPluxeeCode(event.target.value));
                  setError('');
                }}
                placeholder="000 000"
                className="w-full border border-gray-200 rounded-full pl-5 pr-5 pt-4 pb-2.5 text-sm text-gray-700 outline-none focus:border-[#E91D34] transition-colors tracking-widest"
              />
            </div>
            {error && <p className="text-xs text-[#E91D34] mt-1.5">{error}</p>}
          </div>

          <button
            type="button"
            disabled={!isComplete}
            onClick={handleSubmit}
            className="bg-[#E91D34] text-white text-sm font-semibold rounded-full py-3.5 hover:bg-[#CA192D] transition-colors disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed disabled:hover:bg-gray-200"
          >
            Devam Et
          </button>
        </div>
      </div>
    </div>
  );
};

export default PluxeeVerifyModal;
