import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaChevronLeft,
  FaChevronRight,
  FaCircleExclamation,
  FaCreditCard,
  FaFileLines,
  FaPaperPlane,
  FaPlus,
  FaStar,
  FaWallet,
  FaXmark,
} from 'react-icons/fa6';
import useStore from '../store/useStore';

const formatBalance = (value: number): string =>
  `${value.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL`;

const PRESET_AMOUNTS = [150, 250, 500];

const TopUpView = ({ onClose }: { onClose: () => void }) => {
  const navigate = useNavigate();
  const { userName, savedCardsByUser, selectedCardIdByUser, topUpWallet } = useStore();
  const savedCards = userName ? savedCardsByUser[userName] ?? [] : [];
  const selectedCard = userName ? savedCards.find((card) => card.id === selectedCardIdByUser[userName]) : undefined;

  const [amount, setAmount] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'error' | 'success'; message: string } | null>(null);

  const numericAmount = Number(amount);
  const isAmountValid = amount.trim().length > 0 && numericAmount > 0;

  const handlePresetClick = (preset: number) => {
    setAmount(String(preset));
    setFeedback(null);
  };

  const handleSubmit = () => {
    if (!isAmountValid) {
      setFeedback({ type: 'error', message: 'Geçerli bir tutar gir.' });
      return;
    }
    const result = topUpWallet(numericAmount);
    setFeedback({ type: result.success ? 'success' : 'error', message: result.message });
    if (result.success) {
      setAmount('');
      setTimeout(onClose, 1000);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start w-full">
      <div className="bg-white rounded-2xl p-5 flex flex-col gap-4 w-full lg:w-[340px] lg:shrink-0">
        <div className="flex items-center gap-3">
          <button type="button" onClick={onClose} aria-label="Geri dön" className="text-gray-400 hover:text-gray-600 p-1 -ml-1">
            <FaChevronLeft className="w-3.5 h-3.5" />
          </button>
          <FaWallet className="w-4 h-4 text-gray-700" />
          <h2 className="text-gray-800 text-base">Para Yükle</h2>
        </div>
        <div className="flex flex-col gap-3 pl-1">
          <span className="text-sm text-gray-400">Havale/EFT ile</span>
          <span className="text-sm text-[#E91D34] font-semibold">Kredi/Banka Kartı ile</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-5 flex flex-col gap-4 w-full flex-1">
        <h2 className="text-gray-800 text-base">Ödeme Yöntemi</h2>

        {selectedCard ? (
          <div className="flex items-center justify-between gap-3 border border-gray-100 rounded-2xl px-4 py-3">
            <div className="flex items-center gap-3 min-w-0">
              <FaCreditCard className="w-4 h-4 text-gray-700 shrink-0" />
              <div className="min-w-0">
                <p className="text-sm text-gray-800 truncate">{selectedCard.cardHolderName}</p>
                <p className="text-xs text-gray-400">**** **** **** {selectedCard.last4}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => navigate('/profilim', { state: { tab: 'cards' } })}
              className="bg-[#E91D34] text-white text-xs font-semibold rounded-full px-4 py-2 hover:bg-[#CA192D] transition-colors shrink-0"
            >
              Değiştir
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => navigate('/profilim', { state: { tab: 'cards' } })}
            className="flex items-center justify-between gap-3 border border-gray-100 rounded-2xl px-4 py-3 text-left hover:bg-gray-50 transition-colors"
          >
            <span className="flex items-center gap-3 text-sm text-gray-500">
              <FaCreditCard className="w-4 h-4 text-gray-400 shrink-0" />
              Kredi/Banka kartı ekle
            </span>
            <FaChevronRight className="text-gray-400 w-3.5 h-3.5 shrink-0" />
          </button>
        )}

        <p className="text-sm text-gray-800">Para Yükle</p>
        <div className="flex flex-col sm:flex-row gap-3">
          {PRESET_AMOUNTS.map((preset) => {
            const isSelected = amount === String(preset);
            return (
              <button
                key={preset}
                type="button"
                onClick={() => handlePresetClick(preset)}
                className={`flex-1 rounded-full border py-3.5 text-sm transition-colors ${
                  isSelected
                    ? 'bg-[#E91D34] border-[#E91D34] text-white'
                    : 'border-gray-200 text-gray-700 hover:border-gray-300'
                }`}
              >
                {preset} TL
              </button>
            );
          })}
        </div>

        <div className="relative">
          <input
            type="text"
            inputMode="numeric"
            placeholder="Tutarı kendin belirle"
            value={amount}
            onChange={(event) => {
              // Sadece rakamları al, girilen yeni değerle eski hata/başarı mesajını temizle
              setAmount(event.target.value.replace(/[^\d]/g, ''));
              setFeedback(null);
            }}
            className="w-full border border-gray-200 rounded-full px-5 py-3.5 pr-11 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-[#E91D34] transition-colors"
          />
          {amount.length > 0 && (
            <button
              type="button"
              aria-label="Tutarı temizle"
              onClick={() => setAmount('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <FaXmark className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {feedback && (
          <p className={`text-xs ${feedback.type === 'success' ? 'text-green-600' : 'text-[#E91D34]'}`}>
            {feedback.message}
          </p>
        )}

        <button
          type="button"
          disabled={!isAmountValid}
          onClick={handleSubmit}
          className="bg-[#E91D34] text-white text-sm rounded-full py-3.5 hover:bg-[#CA192D] transition-colors disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
        >
          Para Yükle
        </button>
      </div>
    </div>
  );
};

const TiklapayWalletPage = () => {
  const navigate = useNavigate();
  const { userName, walletBalanceByUser, savedCardsByUser, selectedCardIdByUser } = useStore();
  const walletBalance = userName ? walletBalanceByUser[userName] ?? 0 : 0;
  const savedCards = userName ? savedCardsByUser[userName] ?? [] : [];
  const selectedCard = userName ? savedCards.find((card) => card.id === selectedCardIdByUser[userName]) : undefined;

  const [showTopUp, setShowTopUp] = useState(false);

  const handleYukleClick = () => {
    if (selectedCard) {
      setShowTopUp(true);
    } else {
      navigate('/profilim', { state: { tab: 'cards' } });
    }
  };

  if (showTopUp) {
    return <TopUpView onClose={() => setShowTopUp(false)} />;
  }

  return (
    <div className="flex flex-col gap-5 w-full">
      <div className="flex flex-col lg:flex-row gap-6 items-start w-full">
        <div className="flex flex-col gap-4 w-full lg:w-[340px] lg:shrink-0">
          <button
            type="button"
            onClick={() => navigate('/profilim', { state: { tab: 'user' } })}
            className="flex items-center justify-between gap-3 bg-red-50 rounded-2xl px-5 py-4 text-left hover:bg-red-100 transition-colors"
          >
            <span className="flex items-center gap-2 text-[#E91D34] text-sm">
              <FaCircleExclamation className="w-4 h-4 shrink-0" />
              Limitini artırmak için hesabını doğrula
            </span>
            <FaChevronRight className="text-[#E91D34] w-3.5 h-3.5 shrink-0" />
          </button>

          <div className="bg-white rounded-2xl p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-gray-800 text-base">Cüzdan Bakiyem</h2>
              <span className="text-xs text-gray-400">Hesap no: 1123627462</span>
            </div>
            <p className="text-3xl text-gray-900">{formatBalance(walletBalance)}</p>
            <div className="flex flex-col gap-2.5">
              <button
                type="button"
                onClick={handleYukleClick}
                className="flex items-center justify-center gap-2 bg-[#E91D34] text-white text-sm rounded-full py-3.5 hover:bg-[#CA192D] transition-colors"
              >
                <FaPlus className="w-3.5 h-3.5" /> Yükle
              </button>
              <button
                type="button"
                className="flex items-center justify-center gap-2 border border-[#E91D34] text-[#E91D34] text-sm rounded-full py-3.5 hover:bg-red-50 transition-colors"
              >
                <FaPaperPlane className="w-3.5 h-3.5" /> Gönder / İste
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 flex flex-col gap-4">
            <button type="button" className="flex items-center justify-between gap-3 text-left">
              <span className="flex items-center gap-2 text-gray-800 text-base">
                <FaStar className="text-[#E91D34] w-4 h-4" /> Tıkla Param
              </span>
              <FaChevronRight className="text-gray-400 w-3.5 h-3.5 shrink-0" />
            </button>
            <p className="text-3xl text-gray-900">1.171,00 TP</p>

            <div className="border border-red-100 bg-red-50 rounded-2xl p-4 flex flex-col gap-3">
              <p className="flex items-center gap-2 text-xs text-gray-600">
                <FaCircleExclamation className="text-[#E91D34] w-3.5 h-3.5 shrink-0" />
                Cüzdan kullanıcılarına özel %25'e varan indirimden faydalan.
              </p>
              <button
                type="button"
                className="bg-[#E91D34] text-white text-sm rounded-full py-3 hover:bg-[#CA192D] transition-colors"
              >
                Tıkla Para Satın Al
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 w-full flex-1">
          <div className="bg-white rounded-2xl p-6 flex flex-col gap-4">
            <h2 className="text-gray-800 text-lg">Hesap Hareketleri</h2>

            <div className="flex flex-col items-center justify-center gap-4 py-16">
              <FaFileLines className="text-gray-300 w-16 h-16" />
              <p className="text-gray-500">Hesap hareketleri bulunamadı!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TiklapayWalletPage;
