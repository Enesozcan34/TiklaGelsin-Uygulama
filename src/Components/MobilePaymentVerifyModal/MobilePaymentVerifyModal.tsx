import { useState } from 'react';
import { FaChevronDown, FaChevronLeft, FaXmark } from 'react-icons/fa6';

const formatPhoneNumber = (value: string): string => {
  const digits = value.replace(/\D/g, '').slice(0, 10);
  return [digits.slice(0, 3), digits.slice(3, 6), digits.slice(6, 8), digits.slice(8, 10)]
    .filter(Boolean)
    .join(' ');
};

interface MobilePaymentVerifyModalProps {
  title: string;
  heading: string;
  description: string;
  phone: string;
  onBack: () => void;
  onClose: () => void;
  onVerified: (phone: string) => void;
}

const MobilePaymentVerifyModal = ({
  title,
  heading,
  description,
  phone,
  onBack,
  onClose,
  onVerified,
}: MobilePaymentVerifyModalProps) => {
  const [phoneNumber, setPhoneNumber] = useState(() => formatPhoneNumber(phone));
  const [isPhoneFocused, setIsPhoneFocused] = useState(false);
  const digitsOnly = phoneNumber.replace(/\D/g, '');
  const isComplete = digitsOnly.length === 10;
  const isLabelFloating = isPhoneFocused || phoneNumber.length > 0;

  const handleSubmit = () => {
    if (!isComplete) return;
    onVerified(digitsOnly);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl w-full max-w-sm flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Geri"
              onClick={onBack}
              className="text-gray-400 hover:text-gray-600 p-1 -ml-1"
            >
              <FaChevronLeft className="w-4 h-4" />
            </button>
            <h2 className="text-gray-800 text-lg">{title}</h2>
          </div>
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
          <div>
            <h3 className="text-gray-800 text-base">{heading}</h3>
            <p className="text-xs text-gray-500 leading-relaxed mt-1">{description}</p>
          </div>

          <div className="flex items-center gap-2">
            <div className="border border-gray-200 bg-gray-100 rounded-full shrink-0 px-4 py-3 text-sm text-gray-400 flex items-center gap-1.5">
              +90 <FaChevronDown className="w-2.5 h-2.5" />
            </div>
            <div className="relative flex-1 min-w-0">
              <span
                className={`absolute left-5 bg-white px-1 text-gray-500 pointer-events-none transition-all duration-150 ${
                  isLabelFloating ? 'top-0 -translate-y-1/2 text-[11px]' : 'top-1/2 -translate-y-1/2 text-sm text-gray-400'
                }`}
              >
                Telefon Numarası
              </span>
              <input
                type="tel"
                inputMode="numeric"
                value={phoneNumber}
                onFocus={() => setIsPhoneFocused(true)}
                onBlur={() => setIsPhoneFocused(false)}
                onChange={(event) => setPhoneNumber(formatPhoneNumber(event.target.value))}
                className="w-full border border-gray-200 rounded-full pl-5 pr-5 pt-4 pb-2.5 text-sm text-gray-700 outline-none focus:border-[#E91D34] transition-colors"
              />
            </div>
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

export default MobilePaymentVerifyModal;
