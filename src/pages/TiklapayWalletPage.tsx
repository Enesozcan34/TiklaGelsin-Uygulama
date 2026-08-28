import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaCheck,
  FaChevronDown,
  FaChevronLeft,
  FaChevronRight,
  FaChevronUp,
  FaCircleExclamation,
  FaCircleInfo,
  FaCreditCard,
  FaFileLines,
  FaGift,
  FaMagnifyingGlass,
  FaPaperPlane,
  FaPercent,
  FaPlus,
  FaStar,
  FaUserPlus,
  FaWallet,
  FaXmark,
} from 'react-icons/fa6';
import useStore, { type TiklaParaTransaction } from '../store/useStore';
import CardFormModal from '../Components/CardFormModal/CardFormModal';

const formatBalance = (value: number): string =>
  `${value.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL`;

const formatTp = (value: number): string =>
  `${value.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TP`;

const formatTransactionDate = (iso: string): string =>
  new Date(iso).toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' });

const PRESET_AMOUNTS = [150, 250, 500];

interface TiklaParaPackage {
  id: string;
  tlAmount: number;
  tpAmount: number;
  popular?: boolean;
}

const TIKLA_PARA_PACKAGES: TiklaParaPackage[] = [
  { id: 'tp-4', tlAmount: 4, tpAmount: 5 },
  { id: 'tp-500', tlAmount: 500, tpAmount: 560, popular: true },
  { id: 'tp-200', tlAmount: 200, tpAmount: 250 },
];

const TIKLA_PARA_NOTES = [
  "Satın alınan Tıkla Para'lar iptal veya iade edilemez.",
  "Satın alınan Tıkla Para'ların harcanmasında sepette alt limit kuralı uygulanır.",
  "Satın alınan Tıkla Para'ların geçerlilik süresi satın alma tarihinden itibaren 1 yıldır.",
];

const TIKLA_PARA_TYPE_FILTERS: { id: string; label: string }[] = [
  { id: 'all', label: 'Tüm İşlemler' },
  { id: 'earn', label: 'TP Kazanma' },
  { id: 'spend', label: 'TP Harcama' },
  { id: 'expired', label: 'Süresi Dolan TP' },
];

const TIKLA_PARA_DATE_FILTERS: { id: string; label: string; months?: number }[] = [
  { id: 'all', label: 'Tüm Tarihler' },
  { id: '1m', label: 'Son 1 Ay', months: 1 },
  { id: '3m', label: 'Son 3 Ay', months: 3 },
  { id: '6m', label: 'Son 6 Ay', months: 6 },
  { id: '1y', label: 'Son 1 Yıl', months: 12 },
];

const TIKLA_PARA_TYPE_META: Record<TiklaParaTransaction['type'], { caption: string; colorClass: string }> = {
  earn: { caption: 'Tıkla Para Kazanma', colorClass: 'text-green-600' },
  spend: { caption: 'Tıkla Para Harcama', colorClass: 'text-[#E91D34]' },
  expired: { caption: 'Süresi Dolan TP', colorClass: 'text-gray-500' },
};

const FilterDropdown = ({
  value,
  options,
  placeholder,
  onChange,
}: {
  value: string;
  options: { id: string; label: string }[];
  placeholder: string;
  onChange: (value: string) => void;
}) => {
  const [open, setOpen] = useState(false);
  const selected = options.find((option) => option.id === value);

  return (
    <div className="relative flex-1 min-w-0">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="w-full flex items-center justify-between gap-2 border border-gray-200 rounded-full px-4 py-2.5 text-sm text-gray-600 hover:border-gray-300 transition-colors"
      >
        <span className="truncate">{selected?.label ?? placeholder}</span>
        <FaChevronDown className="text-gray-400 w-3 h-3 shrink-0" />
      </button>
      {open && (
        <>
          <button
            type="button"
            aria-label="Filtreyi kapat"
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-10 cursor-default"
          />
          <div className="absolute left-0 top-full mt-2 z-20 w-full bg-white rounded-2xl border border-gray-100 shadow-lg py-2">
            {options.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => {
                  onChange(option.id);
                  setOpen(false);
                }}
                className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                  option.id === value ? 'text-gray-800 font-semibold bg-gray-50' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

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

const TiklaParaPurchaseView = ({ onClose }: { onClose: () => void }) => {
  const navigate = useNavigate();
  const { userName, savedCardsByUser, selectedCardIdByUser, tiklaParaBalanceByUser, buyTiklaPara } = useStore();
  const savedCards = userName ? savedCardsByUser[userName] ?? [] : [];
  const selectedCard = userName ? savedCards.find((card) => card.id === selectedCardIdByUser[userName]) : undefined;
  const tiklaParaBalance = userName ? tiklaParaBalanceByUser[userName] ?? 0 : 0;

  const [selectedPackageId, setSelectedPackageId] = useState(
    TIKLA_PARA_PACKAGES.find((pkg) => pkg.popular)?.id ?? TIKLA_PARA_PACKAGES[0].id,
  );
  const [showAddCard, setShowAddCard] = useState(false);
  const [showTpInfo, setShowTpInfo] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'error' | 'success'; message: string } | null>(null);

  const selectedPackage = TIKLA_PARA_PACKAGES.find((pkg) => pkg.id === selectedPackageId);
  const canConfirm = Boolean(selectedPackage && selectedCard);

  const handleConfirm = () => {
    if (!selectedPackage || !selectedCard) return;
    const result = buyTiklaPara(selectedPackage.tlAmount, selectedPackage.tpAmount);
    setFeedback({ type: result.success ? 'success' : 'error', message: result.message });
    if (result.success) {
      setTimeout(onClose, 1000);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start w-full">
      <div className="flex flex-col gap-4 w-full lg:w-[340px] lg:shrink-0">
        <div className="bg-white rounded-2xl p-3 flex flex-col gap-2 relative">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-2 text-gray-600 text-[17px] font-bold leading-none flex-1">
              <FaStar className="text-[#E91D34] w-4 h-4" /> Tıkla Param
            </span>
            <button
              type="button"
              aria-label="Tıkla Para hakkında bilgi"
              onClick={() => setShowTpInfo((prev) => !prev)}
              className="text-gray-300 hover:text-gray-400 shrink-0"
            >
              <FaCircleInfo className="w-4 h-4" />
            </button>
          </div>
          <p className="text-2xl text-gray-600 font-bold leading-none ml-6">{formatTp(tiklaParaBalance)}</p>

          {showTpInfo && (
            <>
              <button
                type="button"
                aria-label="Bilgi kutusunu kapat"
                onClick={() => setShowTpInfo(false)}
                className="fixed inset-0 z-10 cursor-default"
              />
              <div className="absolute right-5 top-9 z-20 bg-white rounded-lg shadow-md px-3 py-1.5">
                <p className="text-xs text-[#E91D34] font-normal whitespace-nowrap">1 Tıkla Para = 1 TL</p>
              </div>
            </>
          )}
        </div>

        <div className="bg-white rounded-2xl p-3">
          <div className="bg-green-50 rounded-xl p-3 flex items-center gap-3">
            <span className="border border-green-200 text-green-600 rounded-full p-1.5 shrink-0">
              <FaPercent className="w-3.5 h-3.5" />
            </span>
            <p className="text-xs text-green-700">%25'e varan indirimle Tıkla Para satın al, siparişinde avantaj kazan!</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 w-full flex-1">
        <div className="bg-white rounded-2xl p-5 flex flex-col gap-3">
          <h2 className="text-gray-800 text-[17px]">Tıkla Para Paketleri</h2>
          <div className="flex flex-col gap-3">
            {TIKLA_PARA_PACKAGES.map((pkg) => {
              const isSelected = pkg.id === selectedPackageId;
              const bonus = pkg.tpAmount - pkg.tlAmount;
              return (
                <div
                  key={pkg.id}
                  className={`rounded-2xl border transition-colors ${
                    isSelected ? 'border-green-500 bg-green-50' : 'border-gray-100'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedPackageId(pkg.id);
                      setFeedback(null);
                    }}
                    className="w-full flex items-center justify-between gap-3 px-4 py-3.5 text-left"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                          isSelected ? 'bg-green-500 border-green-500' : 'border-gray-300'
                        }`}
                      >
                        {isSelected && <FaCheck className="text-white w-2.5 h-2.5" />}
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm text-gray-800 font-bold">
                          {pkg.tlAmount.toLocaleString('tr-TR')} TL öde,{' '}
                          <span className="text-[#E91D34]">{pkg.tpAmount.toLocaleString('tr-TR')} TP Satın Al</span>
                        </p>
                        <p className="text-xs text-green-600">Kazancın +{bonus.toLocaleString('tr-TR')} TP</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {pkg.popular && (
                        <span className="bg-green-500 text-white text-[10px] font-bold rounded-full px-2.5 py-1">
                          Popüler
                        </span>
                      )}
                      {isSelected ? (
                        <FaChevronUp className="text-gray-400 w-3.5 h-3.5" />
                      ) : (
                        <FaChevronDown className="text-gray-400 w-3.5 h-3.5" />
                      )}
                    </div>
                  </button>
                  {isSelected && (
                    <ul className="px-4 pb-4 -mt-1 flex flex-col gap-1">
                      {TIKLA_PARA_NOTES.map((note) => (
                        <li key={note} className="text-xs text-gray-500 list-disc ml-4">
                          {note}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 flex flex-col gap-4">
          <h2 className="text-gray-800 text-[17px]">Ödeme Yöntemi</h2>

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
            <div className="border border-red-200 bg-red-50 rounded-2xl p-4 flex flex-col gap-3">
              <div className="bg-white rounded-xl flex items-center justify-between gap-3 px-4 py-3">
                <span className="flex items-center gap-3 text-sm text-gray-800 font-semibold">
                  <FaCreditCard className="w-4 h-4 text-gray-500 shrink-0" />
                  Kredi / Banka Kartı ile Öde
                </span>
                <button
                  type="button"
                  onClick={() => setShowAddCard(true)}
                  className="bg-[#E91D34] text-white text-xs font-semibold rounded-full px-4 py-2 hover:bg-[#CA192D] transition-colors shrink-0"
                >
                  Ekle
                </button>
              </div>
              <p className="flex items-start gap-2 text-xs text-gray-600">
                <FaCircleInfo className="text-gray-400 w-3.5 h-3.5 shrink-0 mt-0.5" />
                Tıklapay avantajlarından faydalanmak için kartını <span className="font-semibold">Tıklapay Cüzdanına</span>{' '}
                kaydetmelisin.
              </p>
            </div>
          )}

          {feedback && (
            <p className={`text-xs ${feedback.type === 'success' ? 'text-green-600' : 'text-[#E91D34]'}`}>
              {feedback.message}
            </p>
          )}

          <button
            type="button"
            disabled={!canConfirm}
            onClick={handleConfirm}
            className="bg-[#E91D34] text-white text-sm rounded-full py-3.5 hover:bg-[#CA192D] transition-colors disabled:bg-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            Ödemeyi Onayla
          </button>
        </div>
      </div>

      {showAddCard && <CardFormModal mode="add" onClose={() => setShowAddCard(false)} />}
    </div>
  );
};

const TiklaParaEkstreView = () => {
  const { userName, tiklaParaBalanceByUser, tiklaParaTransactionsByUser } = useStore();
  const tiklaParaBalance = userName ? tiklaParaBalanceByUser[userName] ?? 0 : 0;
  const transactions = userName ? tiklaParaTransactionsByUser[userName] ?? [] : [];

  const [typeFilter, setTypeFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  const dateFilterMeta = TIKLA_PARA_DATE_FILTERS.find((option) => option.id === dateFilter);
  const cutoffDate = (() => {
    if (!dateFilterMeta?.months) return null;
    const cutoff = new Date();
    cutoff.setMonth(cutoff.getMonth() - dateFilterMeta.months);
    return cutoff;
  })();

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesType = typeFilter === 'all' || transaction.type === typeFilter;
    const matchesDate = !cutoffDate || new Date(transaction.date) >= cutoffDate;
    return matchesType && matchesDate;
  });

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start w-full">
      <div className="flex flex-col gap-4 w-full lg:w-[340px] lg:shrink-0">
        <div className="bg-white rounded-2xl p-4 flex flex-col gap-2 relative">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-2 text-gray-600 text-[17px] font-bold leading-none flex-1">
              <FaStar className="text-[#E91D34] w-4 h-4" /> Tıkla Param
            </span>
            <FaCircleInfo className="text-gray-300 w-4 h-4 shrink-0" />
          </div>
          <p className="text-2xl text-gray-600 font-bold leading-none ml-6">{formatTp(tiklaParaBalance)}</p>
        </div>

        <div className="bg-white rounded-2xl p-5 flex flex-col gap-3">
          <h2 className="text-gray-800 text-[17px]">Avantajlar</h2>
          <p className="text-xs text-gray-500">
            Alışverişlerinde, sana özel <span className="font-semibold text-gray-700">Tıkla Para</span> avantajları;
          </p>
          <div className="flex flex-col gap-2">
            <div className="bg-green-50 rounded-xl px-3 py-2.5 flex items-center gap-2.5">
              <FaGift className="text-green-600 w-3.5 h-3.5 shrink-0" />
              <p className="text-xs text-green-700">
                Yedikçe <span className="font-semibold">Tıkla Para</span> kazan, kazandıkça ye!
              </p>
            </div>
            <div className="bg-green-50 rounded-xl px-3 py-2.5 flex items-center gap-2.5">
              <FaUserPlus className="text-green-600 w-3.5 h-3.5 shrink-0" />
              <p className="text-xs text-green-700">
                Arkadaşını davet et <span className="font-semibold">Tıkla Para</span> kazan!
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 w-full flex-1">
        <div className="bg-white rounded-2xl p-5 flex flex-col gap-4">
          <h2 className="text-gray-800 text-[17px]">Tıkla Para Ekstre</h2>
          <div className="flex flex-col sm:flex-row gap-3">
            <FilterDropdown value={typeFilter} options={TIKLA_PARA_TYPE_FILTERS} placeholder="Tüm İşlemler" onChange={setTypeFilter} />
            <FilterDropdown value={dateFilter} options={TIKLA_PARA_DATE_FILTERS} placeholder="Tarih Seçin" onChange={setDateFilter} />
          </div>

          {filteredTransactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-14 text-center">
              <FaMagnifyingGlass className="text-gray-300 w-10 h-10" />
              <p className="text-gray-800 font-semibold">Ekstre Kaydın Bulunamadı</p>
              <p className="text-gray-400 text-sm max-w-sm">
                İşlemler ve Tarih filtrelerini kullanarak ekstre geçmişini görebilirsin. Cüzdan ile kampanyalı markalardan
                sipariş vererek hemen Tıkla Para kazanma şansını yakalayabilirsin.
              </p>
            </div>
          ) : (
            <div className="flex flex-col max-h-[420px] overflow-y-auto styled-scrollbar">
              {filteredTransactions.map((transaction) => {
                const meta = TIKLA_PARA_TYPE_META[transaction.type];
                return (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between gap-3 py-3.5 border-b border-gray-100 last:border-b-0"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <FaFileLines className="text-gray-400 w-4 h-4 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-gray-800 truncate">{transaction.label}</p>
                        <p className="text-xs text-gray-400">{formatTransactionDate(transaction.date)}</p>
                        {transaction.type === 'earn' && transaction.expiresAt && (
                          <p className="text-xs text-[#E91D34]">
                            Son Kullanma Tarihi: {formatTransactionDate(transaction.expiresAt)}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className={`text-sm font-semibold ${meta.colorClass}`}>{formatTp(transaction.amount)}</p>
                      <p className="text-xs text-gray-400">{meta.caption}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const TiklapayWalletPage = () => {
  const navigate = useNavigate();
  const { userName, walletBalanceByUser, walletTransactionsByUser, tiklaParaBalanceByUser, savedCardsByUser, selectedCardIdByUser } =
    useStore();
  const walletBalance = userName ? walletBalanceByUser[userName] ?? 0 : 0;
  const walletTransactions = userName ? walletTransactionsByUser[userName] ?? [] : [];
  const tiklaParaBalance = userName ? tiklaParaBalanceByUser[userName] ?? 0 : 0;
  const savedCards = userName ? savedCardsByUser[userName] ?? [] : [];
  const selectedCard = userName ? savedCards.find((card) => card.id === selectedCardIdByUser[userName]) : undefined;

  const [view, setView] = useState<'main' | 'topup' | 'tiklapara' | 'tiklapara-ekstre'>('main');

  const handleYukleClick = () => {
    if (selectedCard) {
      setView('topup');
    } else {
      navigate('/profilim', { state: { tab: 'cards' } });
    }
  };

  if (view === 'topup') {
    return <TopUpView onClose={() => setView('main')} />;
  }

  if (view === 'tiklapara') {
    return <TiklaParaPurchaseView onClose={() => setView('main')} />;
  }

  if (view === 'tiklapara-ekstre') {
    return <TiklaParaEkstreView />;
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
            <button
              type="button"
              onClick={() => setView('tiklapara-ekstre')}
              className="flex items-center justify-between gap-3 text-left"
            >
              <span className="flex items-center gap-2 text-gray-800 text-base">
                <FaStar className="text-[#E91D34] w-4 h-4" /> Tıkla Param
              </span>
              <FaChevronRight className="text-gray-400 w-3.5 h-3.5 shrink-0" />
            </button>
            <p className="text-3xl text-gray-900">{formatTp(tiklaParaBalance)}</p>

            <div className="border border-[#E91D34] bg-red-50 rounded-2xl p-4 flex flex-col gap-3">
              <p className="flex items-center gap-2 text-xs text-gray-600">
                <FaCircleExclamation className="text-[#E91D34] w-3.5 h-3.5 shrink-0" />
                Cüzdan kullanıcılarına özel %25'e varan indirimden faydalan.
              </p>
              <button
                type="button"
                onClick={() => setView('tiklapara')}
                className="bg-[#E91D34] text-white text-sm rounded-full py-3 hover:bg-[#CA192D] transition-colors"
              >
                Tıkla Para Satın Al
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 w-full flex-1">
          <div className="bg-white rounded-2xl p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-gray-800 text-lg">Hesap Hareketleri</h2>
              {walletTransactions.length > 0 && (
                <span className="text-sm text-[#E91D34]">Tümü</span>
              )}
            </div>

            {walletTransactions.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-4 py-16">
                <FaFileLines className="text-gray-300 w-16 h-16" />
                <p className="text-gray-500">Hesap hareketleri bulunamadı!</p>
              </div>
            ) : (
              <div className="flex flex-col">
                {walletTransactions.map((transaction) => {
                  const isTopUp = transaction.type === 'topup';
                  return (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between gap-3 py-3.5 border-b border-gray-100 last:border-b-0"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <FaFileLines className="text-gray-400 w-4 h-4 shrink-0" />
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-800 truncate">{transaction.label}</p>
                          <p className="text-xs text-gray-400">{formatTransactionDate(transaction.date)}</p>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className={`text-sm font-semibold ${isTopUp ? 'text-green-600' : 'text-[#E91D34]'}`}>
                          {formatBalance(transaction.amount)}
                        </p>
                        <p className="text-xs text-gray-400">{isTopUp ? 'Para Yükleme' : 'Harcama'}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TiklapayWalletPage;
