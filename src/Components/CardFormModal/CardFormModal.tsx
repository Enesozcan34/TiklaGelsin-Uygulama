import { useState } from 'react';
import { FaXmark } from 'react-icons/fa6';
import useStore, { type SavedCard } from '../../store/useStore';

const formatCardNumber = (value: string): string =>
  value
    .replace(/\D/g, '')
    .slice(0, 16)
    .replace(/(.{4})/g, '$1 ')
    .trim();

const formatExpiry = (value: string): string => {
  const digits = value.replace(/\D/g, '').slice(0, 4);
  if (digits.length === 0) return '';

  let month = digits.slice(0, 2);
  const year = digits.slice(2);

  if (month.length === 1) {
    if (Number(month) > 1) month = `0${month}`;
  } else {
    const monthNum = Number(month);
    if (monthNum === 0) month = '01';
    else if (monthNum > 12) month = '12';
  }

  return year.length > 0 ? `${month}/${year}` : month;
};

const CardFormModal = ({ mode, onClose }: { mode: 'add' | { editCard: SavedCard }; onClose: () => void }) => {
  const { addSavedCard, updateSavedCard } = useStore();
  const editingCard = mode !== 'add' ? mode.editCard : null;

  const [cardHolderName, setCardHolderName] = useState(editingCard?.cardHolderName ?? '');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState(editingCard?.expiry ?? '');
  const [cvv, setCvv] = useState('');
  const [cardLimit, setCardLimit] = useState(
    editingCard && Number.isFinite(editingCard.balance) ? String(editingCard.balance) : '',
  );
  const [acceptedNotice, setAcceptedNotice] = useState(false);

  const digitsOnly = cardNumber.replace(/\D/g, '');
  const isExpiryValid = /^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry);
  const limitValue = Number(cardLimit);
  const isLimitValid = cardLimit.trim().length > 0 && limitValue > 0;
  const isCardNumberValid = editingCard ? digitsOnly.length === 0 || digitsOnly.length === 16 : digitsOnly.length === 16;
  const isCvvValid = editingCard ? true : cvv.length >= 3;
  const isValid = cardHolderName.trim().length > 1 && isCardNumberValid && isExpiryValid && isCvvValid && isLimitValid;

  const handleSubmit = () => {
    if (!isValid) return;
    const last4 = digitsOnly.length === 16 ? digitsOnly.slice(-4) : editingCard?.last4 ?? '';
    if (editingCard) {
      updateSavedCard(editingCard.id, { cardHolderName: cardHolderName.trim(), last4, expiry, balance: limitValue });
    } else {
      addSavedCard({ cardHolderName: cardHolderName.trim(), last4, expiry, balance: limitValue });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl w-full max-w-md flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-gray-100">
          <h2 className="text-gray-800 text-base">{editingCard ? 'Kartı Düzenle' : 'Kredi / Banka Kartı Ekle'}</h2>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 -mt-1 -mr-1">
            <FaXmark className="w-4 h-4" />
          </button>
        </div>

        <div className="px-5 py-4 flex flex-col gap-4">
          <input
            type="text"
            placeholder="Kart Üzerindeki Adın Soyadın"
            value={cardHolderName}
            onChange={(event) => setCardHolderName(event.target.value)}
            className="w-full border border-gray-200 rounded-full px-5 py-3.5 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-[#E91D34] transition-colors"
          />
          <input
            type="text"
            inputMode="numeric"
            placeholder={editingCard ? `**** **** **** ${editingCard.last4}` : 'Kart Numarası'}
            value={cardNumber}
            onChange={(event) => setCardNumber(formatCardNumber(event.target.value))}
            className="w-full border border-gray-200 rounded-full px-5 py-3.5 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-[#E91D34] transition-colors"
          />
          <div className="flex items-center border border-gray-200 rounded-full overflow-hidden focus-within:border-[#E91D34] transition-colors">
            <input
              type="text"
              inputMode="numeric"
              placeholder="AA/YY"
              value={expiry}
              maxLength={5}
              onChange={(event) => setExpiry(formatExpiry(event.target.value))}
              className="flex-1 min-w-0 px-5 py-3.5 text-sm text-gray-700 placeholder-gray-400 outline-none"
            />
            <span className="w-px self-stretch bg-gray-200" />
            <input
              type="text"
              inputMode="numeric"
              placeholder="CVV"
              value={cvv}
              onChange={(event) => setCvv(event.target.value.replace(/\D/g, '').slice(0, 4))}
              className="flex-1 min-w-0 px-5 py-3.5 text-sm text-gray-700 placeholder-gray-400 outline-none"
            />
          </div>

          <input
            type="text"
            inputMode="numeric"
            placeholder="Sanal Kart Limiti (TL)"
            value={cardLimit}
            onChange={(event) => setCardLimit(event.target.value.replace(/[^\d]/g, ''))}
            className="w-full border border-gray-200 rounded-full px-5 py-3.5 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-[#E91D34] transition-colors"
          />

          <label className="flex items-start gap-2.5 text-xs text-gray-500 leading-relaxed cursor-pointer">
            <input
              type="checkbox"
              checked={acceptedNotice}
              onChange={(event) => setAcceptedNotice(event.target.checked)}
              className="mt-0.5 w-4 h-4 rounded border-gray-300 accent-[#E91D34] shrink-0"
            />
            <span>
              Kartımı <span className="text-[#E91D34] font-semibold">Aydınlatma Metni</span> kapsamında Tıklapay
              cüzdanıma kaydet.
            </span>
          </label>

          <button
            type="button"
            disabled={!isValid}
            onClick={handleSubmit}
            className="bg-[#E91D34] text-white text-sm rounded-full py-3.5 hover:bg-[#CA192D] transition-colors disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            {editingCard ? 'Kartımı Güncelle' : 'Kartımı Ekle'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CardFormModal;
