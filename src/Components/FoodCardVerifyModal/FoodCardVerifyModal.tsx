import { useState } from 'react';
import { FaChevronLeft, FaXmark } from 'react-icons/fa6';

const formatCardNumber = (value: string): string =>
  value
    .replace(/\D/g, '')
    .slice(0, 16)
    .replace(/(.{4})/g, '$1 ')
    .trim();

interface FoodCardVerifyModalProps {
  brandName: string;
  logoLabel: string;
  logoColor: string;
  onBack: () => void;
  onClose: () => void;
  onVerified: (cardNumber: string) => void;
}

const FoodCardVerifyModal = ({ brandName, logoLabel, logoColor, onBack, onClose, onVerified }: FoodCardVerifyModalProps) => {
  const [cardNumber, setCardNumber] = useState('');
  const [isCardNumberFocused, setIsCardNumberFocused] = useState(false);
  const digitsOnly = cardNumber.replace(/\D/g, '');
  const isComplete = digitsOnly.length === 16;
  const isLabelFloating = isCardNumberFocused || cardNumber.length > 0;

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
            <h2 className="text-gray-800 text-lg">Yemek Kartı</h2>
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
          <div className="border border-gray-100 rounded-2xl px-5 py-6 flex items-center justify-center">
            <span className="text-2xl font-bold tracking-tight" style={{ color: logoColor }}>
              {logoLabel}
            </span>
          </div>

          <div>
            <h3 className="text-gray-800 text-base">{brandName} Online</h3>
            <p className="text-xs text-gray-500 leading-relaxed mt-1">
              {brandName} kartınızla online ödeme yapabilmek için {brandName} mobil uygulamasında kayıtlı olan
              kartını eklemen gerekmektedir. {brandName} mobil uygulamasında kayıtlı olan kartlarını görüntülemek ve
              eklemek için kart numaranı aşağıdaki alana yazmalısın.
            </p>
          </div>

          <div>
            <div className="relative">
              <span
                className={`absolute left-4 bg-white px-1 text-gray-500 pointer-events-none transition-all duration-150 ${
                  isLabelFloating ? 'top-0 -translate-y-1/2 text-[11px]' : 'top-1/2 -translate-y-1/2 text-sm text-gray-400'
                }`}
              >
                Kart Numaran
              </span>
              <input
                type="text"
                inputMode="numeric"
                value={cardNumber}
                onFocus={() => setIsCardNumberFocused(true)}
                onBlur={() => setIsCardNumberFocused(false)}
                onChange={(event) => setCardNumber(formatCardNumber(event.target.value))}
                className="w-full border border-gray-200 rounded-full pl-5 pr-5 pt-4 pb-2.5 text-sm text-gray-700 outline-none focus:border-[#E91D34] transition-colors tracking-widest"
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

export default FoodCardVerifyModal;
