import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaChevronDown, FaCreditCard, FaPlus, FaXmark } from 'react-icons/fa6';
import useStore from '../../store/useStore';
import walletLogo from '../../assets/Wallet2.png';

const formatBalance = (value: number): string => `${value.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL`;

const ToggleSwitch = ({ checked, onToggle }: { checked: boolean; onToggle: () => void }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    onClick={onToggle}
    className={`w-11 h-6 shrink-0 rounded-full p-0.5 flex items-center transition-colors ${
      checked ? 'bg-[#E91D34] justify-end' : 'bg-gray-200 justify-start'
    }`}
  >
    <span className="w-5 h-5 rounded-full bg-white" />
  </button>
);

interface PaymentMethodModalProps {
  totalAmount: number;
  paymentMethod: 'wallet' | 'card';
  onClose: () => void;
  onSelectWallet: () => void;
  onSelectCard: (cardId: string) => void;
}

const PaymentMethodModal = ({ totalAmount, paymentMethod, onClose, onSelectWallet, onSelectCard }: PaymentMethodModalProps) => {
  const navigate = useNavigate();
  const { userName, walletBalanceByUser, savedCardsByUser, selectedCardIdByUser } = useStore();
  const walletBalance = userName ? walletBalanceByUser[userName] ?? 0 : 0;
  const savedCards = userName ? savedCardsByUser[userName] ?? [] : [];
  const selectedCardId = userName ? selectedCardIdByUser[userName] : undefined;
  const [isCardSectionOpen, setIsCardSectionOpen] = useState(paymentMethod === 'card');

  const goToWalletPage = () => {
    onClose();
    navigate('/tiklapaycuzdanim');
  };

  const goToAddCard = () => {
    onClose();
    navigate('/profilim', { state: { tab: 'cards' } });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-gray-100 shrink-0">
          <h2 className="text-gray-800 text-lg">Ödeme Yöntemi</h2>
          <button
            type="button"
            aria-label="Kapat"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 -mt-1 -mr-1"
          >
            <FaXmark className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 px-5 py-4 flex flex-col gap-4">
          <div className="border border-gray-100 rounded-2xl px-4 py-3.5 flex flex-col gap-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <span className="w-9 h-9 rounded-lg bg-[#E91D34] flex items-center justify-center shrink-0 p-1.5">
                  <span
                    className="w-full h-full bg-white"
                    style={{
                      WebkitMaskImage: `url(${walletLogo})`,
                      maskImage: `url(${walletLogo})`,
                      WebkitMaskSize: 'contain',
                      maskSize: 'contain',
                      WebkitMaskRepeat: 'no-repeat',
                      maskRepeat: 'no-repeat',
                      WebkitMaskPosition: 'center',
                      maskPosition: 'center',
                    }}
                  />
                </span>
                <div className="min-w-0">
                  <p className="text-sm text-gray-800">Tıklapay Cüzdanım</p>
                  <p className="text-sm font-semibold text-gray-800">{formatBalance(walletBalance)}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={goToWalletPage}
                className="bg-[#E91D34] text-white text-xs font-semibold rounded-full px-4 py-2 hover:bg-[#CA192D] transition-colors whitespace-nowrap shrink-0"
              >
                Para Yükle
              </button>
            </div>
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs text-gray-400">Bu sipariş için TıklaPay bakiyemi kullan.</p>
              <ToggleSwitch checked={paymentMethod === 'wallet'} onToggle={onSelectWallet} />
            </div>
            {paymentMethod === 'wallet' && walletBalance < totalAmount && (
              <p className="text-xs text-[#E91D34]">
                Cüzdan bakiyen yeterli değil. Sipariş tutarı {formatBalance(totalAmount)}, bakiyen {formatBalance(walletBalance)}.
              </p>
            )}
          </div>

          <div className="border border-gray-100 rounded-2xl overflow-hidden">
            <button
              type="button"
              onClick={() => setIsCardSectionOpen((prev) => !prev)}
              className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
            >
              <span className="flex items-center gap-2.5 text-gray-800 text-sm">
                <FaCreditCard className="w-4 h-4 text-gray-700" />
                Kredi / Banka Kartı Online
              </span>
              <FaChevronDown
                className={`w-3.5 h-3.5 text-gray-400 transition-transform ${isCardSectionOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {isCardSectionOpen && (
              <div className="flex flex-col gap-2.5 px-5 pb-4">
                {savedCards.length === 0 ? (
                  <p className="text-xs text-gray-400">Henüz kayıtlı kartın yok.</p>
                ) : (
                  savedCards.map((card) => {
                    const isSelected = paymentMethod === 'card' && card.id === selectedCardId;
                    return (
                      <button
                        key={card.id}
                        type="button"
                        onClick={() => onSelectCard(card.id)}
                        className={`flex items-center justify-between gap-3 rounded-xl border px-3.5 py-3 text-left transition-colors ${
                          isSelected ? 'border-[#E91D34] bg-red-50' : 'border-gray-100 hover:border-gray-200'
                        }`}
                      >
                        <div className="min-w-0">
                          <p className="text-sm text-gray-800">{card.cardHolderName}</p>
                          <p className="text-xs text-gray-400">**** {card.last4} · {card.expiry}</p>
                        </div>
                        {isSelected && (
                          <span className="bg-[#E91D34] text-white text-[10px] font-semibold rounded-full px-2.5 py-1 whitespace-nowrap shrink-0">
                            Seçili
                          </span>
                        )}
                      </button>
                    );
                  })
                )}
                <button
                  type="button"
                  onClick={goToAddCard}
                  className="self-start flex items-center gap-2 text-[#E91D34] text-sm font-semibold hover:underline"
                >
                  <FaPlus className="w-3 h-3" /> Kart Ekle
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethodModal;
