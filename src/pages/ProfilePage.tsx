import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { IconType } from 'react-icons';
import {
  FaBagShopping,
  FaBriefcase,
  FaCheck,
  FaChevronDown,
  FaChevronRight,
  FaCircleCheck,
  FaCreditCard,
  FaGear,
  FaHeadset,
  FaHeart,
  FaHouse,
  FaLocationDot,
  FaRegCircleUser,
  FaRegCreditCard,
  FaRightFromBracket,
  FaStar,
  FaTicket,
  FaTrash,
  FaXmark,
} from 'react-icons/fa6';
import useStore, { type Address, type SavedCard, type UserProfile } from '../store/useStore';
import { getRestaurantById } from '../data/restaurants';
import CouponsPanel from '../Components/Campaigns/CouponsPanel';

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

const formatBalance = (value: number): string =>
  `${(Number.isFinite(value) ? value : 0).toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL`;

type ProfileTab = 'user' | 'addresses' | 'orders' | 'favorites' | 'coupons' | 'cards' | 'settings' | 'help';

const SIDEBAR_ITEMS: { id: ProfileTab; label: string; icon: IconType; badge?: string }[] = [
  { id: 'user', label: 'Kullanıcı Bilgilerim', icon: FaRegCircleUser },
  { id: 'addresses', label: 'Adreslerim', icon: FaLocationDot },
  { id: 'orders', label: 'Siparişler', icon: FaBagShopping },
  { id: 'favorites', label: 'Favori Restoranlar', icon: FaHeart, badge: 'Yeni' },
  { id: 'coupons', label: 'Kuponlar', icon: FaTicket },
  { id: 'cards', label: 'Kayıtlı Kartlarım', icon: FaCreditCard },
  { id: 'settings', label: 'Ayarlarım', icon: FaGear },
];

const formatPrice = (price: number): string => `${price.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL`;

const formatOrderDate = (iso: string): string => {
  const date = new Date(iso);
  const datePart = date.toLocaleDateString('tr-TR');
  const timePart = date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
  return `${datePart} ${timePart}`;
};

const EMPTY_PROFILE: UserProfile = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  birthDate: '',
  gender: 'Belirtmek İstemiyorum',
  team: '',
};

const GENDER_OPTIONS = ['Belirtmek İstemiyorum', 'Kadın', 'Erkek'];
const TEAM_OPTIONS = ['', 'Galatasaray', 'Fenerbahçe', 'Beşiktaş', 'Trabzonspor'];

const UserInfoPanel = () => {
  const { userName, profilesByUser, updateProfile } = useStore();
  const profile = (userName && profilesByUser[userName]) || EMPTY_PROFILE;
  const [draft, setDraft] = useState<UserProfile>(profile);
  const [showSaved, setShowSaved] = useState(false);

  useEffect(() => {
    setDraft(profile);
  }, [profile]);

  const handleSave = () => {
    updateProfile(draft);
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 2000);
  };

  return (
    <div className="bg-white rounded-2xl p-6 flex flex-col gap-5">
      <h2 className="text-gray-800 text-lg">Kullanıcı Bilgilerim</h2>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <span className="absolute left-4 top-0 -translate-y-1/2 bg-white px-1 text-[11px] text-gray-500">Ad</span>
          <input
            type="text"
            value={draft.firstName}
            onChange={(event) => setDraft((prev) => ({ ...prev, firstName: event.target.value }))}
            className="w-full border border-gray-200 rounded-full pl-5 pr-5 pt-4 pb-2.5 text-sm text-gray-700 outline-none focus:border-[#E30A17] transition-colors"
          />
        </div>
        <div className="relative flex-1">
          <span className="absolute left-4 top-0 -translate-y-1/2 bg-white px-1 text-[11px] text-gray-500">Soyad</span>
          <input
            type="text"
            value={draft.lastName}
            onChange={(event) => setDraft((prev) => ({ ...prev, lastName: event.target.value }))}
            className="w-full border border-gray-200 rounded-full pl-5 pr-5 pt-4 pb-2.5 text-sm text-gray-700 outline-none focus:border-[#E30A17] transition-colors"
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <span className="absolute left-4 top-0 -translate-y-1/2 bg-white px-1 text-[11px] text-gray-500">E-Mail</span>
          <input
            type="email"
            value={draft.email}
            onChange={(event) => setDraft((prev) => ({ ...prev, email: event.target.value }))}
            className="w-full border border-gray-200 rounded-full pl-5 pr-11 pt-4 pb-2.5 text-sm text-gray-700 outline-none focus:border-[#E30A17] transition-colors"
          />
          <span className="absolute right-3.5 top-1/2 -translate-y-1/2 bg-green-500 text-white rounded-full p-1 flex items-center justify-center">
            <FaCheck className="w-2.5 h-2.5" />
          </span>
        </div>
        <div className="flex-1 flex items-center gap-2">
          <div className="relative shrink-0">
            <span className="absolute left-4 top-0 -translate-y-1/2 bg-white px-1 text-[11px] text-gray-300">Telefon Numarası</span>
            <div className="border border-gray-200 bg-gray-100 rounded-full h-full px-4 pt-4 pb-2.5 text-sm text-gray-400 flex items-center gap-1.5">
              +90 <FaChevronDown className="w-2.5 h-2.5" />
            </div>
          </div>
          <div className="flex-1 min-w-0 border border-gray-200 bg-gray-100 rounded-full px-5 pt-4 pb-2.5 text-sm text-gray-400 truncate">
            {draft.phone || '5xx xxx xx xx'}
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <span className="absolute left-4 top-0 -translate-y-1/2 bg-white px-1 text-[11px] text-gray-500">Doğum Tarihi</span>
          <input
            type="date"
            value={draft.birthDate}
            onChange={(event) => setDraft((prev) => ({ ...prev, birthDate: event.target.value }))}
            className="w-full border border-gray-200 rounded-full pl-5 pr-5 pt-4 pb-2.5 text-sm text-gray-700 outline-none focus:border-[#E30A17] transition-colors"
          />
        </div>
        <div className="relative flex-1">
          <span className="absolute left-4 top-0 -translate-y-1/2 bg-white px-1 text-[11px] text-gray-500">Cinsiyet</span>
          <select
            value={draft.gender}
            onChange={(event) => setDraft((prev) => ({ ...prev, gender: event.target.value }))}
            className="w-full border border-gray-200 rounded-full pl-5 pr-5 pt-4 pb-2.5 text-sm text-gray-700 outline-none focus:border-[#E30A17] transition-colors appearance-none bg-white"
          >
            {GENDER_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="relative">
        <select
          value={draft.team}
          onChange={(event) => setDraft((prev) => ({ ...prev, team: event.target.value }))}
          className="w-full border border-gray-200 rounded-full pl-5 pr-5 pt-4 pb-2.5 text-sm text-gray-700 outline-none focus:border-[#E30A17] transition-colors appearance-none bg-white"
        >
          <option value="">Takım</option>
          {TEAM_OPTIONS.filter(Boolean).map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <p className="text-xs text-gray-400 leading-relaxed">
        Yukarıda yer verilen cinsiyet, doğum tarihi ve tutulan takım bilgilerini doldurarak, Tıkla Gelsin'in sizi daha iyi
        tanıyabilmesi için sunulan hizmetlerin size uygun şekilde özelleştirilmesi ile ilgili bilgilerinizin işlenmesine
        açık rıza vermiş olursunuz. Aydınlatma metnini okumak için{' '}
        <span className="text-[#E30A17] font-semibold">tıklayın</span>. Açık rızanızı dilediğiniz zaman profil
        bilgilerim sayfasından değiştirebilirsiniz.
      </p>

      <div className="flex items-center gap-3 justify-end">
        {showSaved && <span className="text-xs text-green-600 font-semibold">Kaydedildi</span>}
        <button
          type="button"
          onClick={handleSave}
          className="bg-[#E30A17] text-white text-sm font-semibold rounded-full px-8 py-3 hover:bg-[#c80914] transition-colors"
        >
          Kaydet
        </button>
      </div>
    </div>
  );
};

interface AddressFormState {
  label: string;
  fullAddress: string;
  icon: Address['icon'];
}

const EMPTY_ADDRESS_FORM: AddressFormState = { label: '', fullAddress: '', icon: 'home' };

const AddressFormModal = ({
  title,
  initial,
  onClose,
  onSubmit,
}: {
  title: string;
  initial: AddressFormState;
  onClose: () => void;
  onSubmit: (data: AddressFormState) => void;
}) => {
  const [form, setForm] = useState<AddressFormState>(initial);
  const isValid = form.label.trim().length > 0 && form.fullAddress.trim().length > 4;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl w-full max-w-md flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-gray-100">
          <h2 className="text-gray-800 text-base">{title}</h2>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 -mt-1 -mr-1">
            <FaXmark className="w-4 h-4" />
          </button>
        </div>

        <div className="px-5 py-4 flex flex-col gap-4">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setForm((prev) => ({ ...prev, icon: 'home' }))}
              className={`flex-1 flex items-center justify-center gap-2 rounded-full border py-2.5 text-sm transition-colors ${
                form.icon === 'home' ? 'border-[#E30A17] bg-red-50 text-[#E30A17]' : 'border-gray-200 text-gray-500'
              }`}
            >
              <FaHouse className="w-3.5 h-3.5" /> Ev
            </button>
            <button
              type="button"
              onClick={() => setForm((prev) => ({ ...prev, icon: 'work' }))}
              className={`flex-1 flex items-center justify-center gap-2 rounded-full border py-2.5 text-sm transition-colors ${
                form.icon === 'work' ? 'border-[#E30A17] bg-red-50 text-[#E30A17]' : 'border-gray-200 text-gray-500'
              }`}
            >
              <FaBriefcase className="w-3.5 h-3.5" /> İş / Diğer
            </button>
          </div>

          <input
            type="text"
            placeholder="Adres Başlığı (Ev, İş, Anne Evi...)"
            value={form.label}
            onChange={(event) => setForm((prev) => ({ ...prev, label: event.target.value }))}
            className="w-full border border-gray-200 rounded-full px-5 py-3.5 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-[#E30A17] transition-colors"
          />

          <textarea
            placeholder="Açık Adres"
            value={form.fullAddress}
            onChange={(event) => setForm((prev) => ({ ...prev, fullAddress: event.target.value }))}
            className="w-full border border-gray-200 rounded-2xl px-5 py-3.5 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-[#E30A17] transition-colors resize-none min-h-[90px]"
          />

          <button
            type="button"
            disabled={!isValid}
            onClick={() => onSubmit(form)}
            className="bg-[#E30A17] text-white text-sm rounded-full py-3.5 hover:bg-[#c80914] transition-colors disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            Kaydet
          </button>
        </div>
      </div>
    </div>
  );
};

type AddressModalMode = 'add' | { editId: string } | null;
type AddressSubTab = 'home-delivery' | 'outdoor';

const AddressesPanel = () => {
  const { addresses, selectedAddressId, selectAddress, addAddress, updateAddress, removeAddress } = useStore();
  const [subTab, setSubTab] = useState<AddressSubTab>('home-delivery');
  const [modalMode, setModalMode] = useState<AddressModalMode>(null);

  const editingAddress =
    modalMode && typeof modalMode === 'object' ? addresses.find((address) => address.id === modalMode.editId) : undefined;

  const handleSubmit = (data: AddressFormState) => {
    if (modalMode && typeof modalMode === 'object') {
      updateAddress(modalMode.editId, data);
    } else {
      addAddress(data);
    }
    setModalMode(null);
  };

  return (
    <div className="bg-white rounded-2xl p-6 flex flex-col gap-5">
      <div className="flex items-center gap-6 border-b border-gray-100">
        <button
          type="button"
          onClick={() => setSubTab('home-delivery')}
          className={`pb-3 text-sm font-semibold border-b-2 -mb-px transition-colors flex items-center gap-2 ${
            subTab === 'home-delivery' ? 'border-[#E30A17] text-[#E30A17]' : 'border-transparent text-gray-400'
          }`}
        >
          <FaHouse className="w-3.5 h-3.5" /> Adresime Gelsin
        </button>
        <button
          type="button"
          onClick={() => setSubTab('outdoor')}
          className={`pb-3 text-sm font-semibold border-b-2 -mb-px transition-colors flex items-center gap-2 ${
            subTab === 'outdoor' ? 'border-[#E30A17] text-[#E30A17]' : 'border-transparent text-gray-400'
          }`}
        >
          <FaLocationDot className="w-3.5 h-3.5" /> Dışarıya Gelsin
        </button>
      </div>

      {subTab === 'home-delivery' ? (
        <>
          <h2 className="text-gray-800 text-base -mt-1">Adresler</h2>
          <div className="flex flex-col gap-3">
            {addresses.map((address) => {
              const isSelected = address.id === selectedAddressId;
              return (
                <div
                  key={address.id}
                  className={`flex items-center justify-between gap-3 rounded-2xl border px-4 py-3.5 transition-colors ${
                    isSelected ? 'border-[#E30A17]' : 'border-gray-100'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => selectAddress(address.id)}
                    className="flex items-center gap-3 flex-1 min-w-0 text-left"
                  >
                    {address.icon === 'home' ? (
                      <FaHouse className="w-4 h-4 text-gray-700 shrink-0" />
                    ) : (
                      <FaBriefcase className="w-4 h-4 text-gray-700 shrink-0" />
                    )}
                    <div className="min-w-0">
                      <p className="text-gray-800 text-sm">{address.label}</p>
                      <p className="text-xs text-gray-400 truncate">{address.fullAddress}</p>
                    </div>
                  </button>
                  <div className="flex items-center gap-2 shrink-0">
                    {isSelected && (
                      <span className="bg-red-50 text-[#E30A17] text-xs font-semibold rounded-full px-3 py-1.5 whitespace-nowrap">
                        Seçili Adres
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => setModalMode({ editId: address.id })}
                      className="bg-[#E30A17] text-white text-xs font-semibold rounded-full px-4 py-2 hover:bg-[#c80914] transition-colors whitespace-nowrap"
                    >
                      Düzenle
                    </button>
                    <button
                      type="button"
                      aria-label="Adresi sil"
                      disabled={addresses.length <= 1}
                      onClick={() => removeAddress(address.id)}
                      className="text-gray-300 hover:text-[#E30A17] disabled:opacity-40 disabled:cursor-not-allowed transition-colors p-2"
                    >
                      <FaTrash className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => setModalMode('add')}
            className="self-start bg-[#E30A17] text-white text-sm font-semibold rounded-full px-6 py-3 hover:bg-[#c80914] transition-colors"
          >
            Adres Ekle
          </button>
        </>
      ) : (
        <p className="text-sm text-gray-400 py-10 text-center">Dışarıya gelsin adresleri yakında burada olacak.</p>
      )}

      {modalMode && (
        <AddressFormModal
          title={modalMode === 'add' ? 'Adres Ekle' : 'Adresi Düzenle'}
          initial={
            editingAddress
              ? { label: editingAddress.label, fullAddress: editingAddress.fullAddress, icon: editingAddress.icon }
              : EMPTY_ADDRESS_FORM
          }
          onClose={() => setModalMode(null)}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
};

const OrdersPanel = () => {
  const { userName, ordersByUser } = useStore();
  const orders = userName ? ordersByUser[userName] ?? [] : [];
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="bg-white rounded-2xl p-6 flex flex-col gap-4">
      <h2 className="text-gray-800 text-lg">Geçmiş Siparişlerim</h2>

      {orders.length === 0 ? (
        <p className="text-sm text-gray-400 py-10 text-center">Henüz bir siparişiniz bulunmuyor.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {orders.map((order) => {
            const restaurant = getRestaurantById(order.restaurantId);
            const isExpanded = expandedId === order.id;
            return (
              <div key={order.id} className="border border-gray-100 rounded-2xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => setExpandedId(isExpanded ? null : order.id)}
                  className="w-full flex items-center justify-between gap-3 px-4 py-3.5 text-left"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {restaurant?.image ? (
                      <img src={restaurant.image} alt={order.restaurantTitle} className="w-11 h-11 rounded-xl object-cover shrink-0" />
                    ) : (
                      <span className="w-11 h-11 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
                        <FaBagShopping className="w-4 h-4 text-gray-400" />
                      </span>
                    )}
                    <div className="min-w-0">
                      <p className="text-gray-800 text-sm truncate">{order.restaurantTitle}</p>
                      <p className="text-xs text-gray-400">
                        {formatPrice(order.totalAmount)} · {formatOrderDate(order.createdAt)}
                      </p>
                      <span className="inline-flex items-center gap-1 text-xs text-green-600 font-semibold mt-1">
                        <FaCircleCheck className="w-3 h-3" /> Teslim Edildi
                      </span>
                    </div>
                  </div>
                  <FaChevronDown
                    className={`w-3.5 h-3.5 text-gray-400 shrink-0 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                  />
                </button>

                {isExpanded && (
                  <div className="border-t border-gray-100 px-4 py-3 flex flex-col gap-2 bg-gray-50/60">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between gap-3 text-sm">
                        <span className="text-gray-700">
                          {item.quantity}x {item.productName}
                        </span>
                        <span className="text-gray-500">{formatPrice(item.unitPrice * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

type CardModalMode = 'add' | { editCard: SavedCard } | null;

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
            className="w-full border border-gray-200 rounded-full px-5 py-3.5 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-[#E30A17] transition-colors"
          />
          <input
            type="text"
            inputMode="numeric"
            placeholder={editingCard ? `**** **** **** ${editingCard.last4}` : 'Kart Numarası'}
            value={cardNumber}
            onChange={(event) => setCardNumber(formatCardNumber(event.target.value))}
            className="w-full border border-gray-200 rounded-full px-5 py-3.5 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-[#E30A17] transition-colors"
          />
          <div className="flex items-center border border-gray-200 rounded-full overflow-hidden focus-within:border-[#E30A17] transition-colors">
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
            className="w-full border border-gray-200 rounded-full px-5 py-3.5 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-[#E30A17] transition-colors"
          />

          <label className="flex items-start gap-2.5 text-xs text-gray-500 leading-relaxed cursor-pointer">
            <input
              type="checkbox"
              checked={acceptedNotice}
              onChange={(event) => setAcceptedNotice(event.target.checked)}
              className="mt-0.5 w-4 h-4 rounded border-gray-300 accent-[#E30A17] shrink-0"
            />
            <span>
              Kartımı <span className="text-[#E30A17] font-semibold">Aydınlatma Metni</span> kapsamında Tıklapay
              cüzdanıma kaydet.
            </span>
          </label>

          <button
            type="button"
            disabled={!isValid}
            onClick={handleSubmit}
            className="bg-[#E30A17] text-white text-sm rounded-full py-3.5 hover:bg-[#c80914] transition-colors disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            {editingCard ? 'Kartımı Güncelle' : 'Kartımı Ekle'}
          </button>
        </div>
      </div>
    </div>
  );
};

const CardsPanel = () => {
  const { userName, savedCardsByUser, selectedCardIdByUser, selectSavedCard, removeSavedCard } = useStore();
  const cards = userName ? savedCardsByUser[userName] ?? [] : [];
  const selectedCardId = userName ? selectedCardIdByUser[userName] : undefined;
  const [modalMode, setModalMode] = useState<CardModalMode>(null);

  return (
    <div className="bg-white rounded-2xl p-6 flex flex-col gap-4">
      <h2 className="text-gray-800 text-lg">Kayıtlı Kartlarım</h2>

      {cards.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 py-14 text-center">
          <FaRegCreditCard className="w-14 h-14 text-gray-300" />
          <div className="flex flex-col gap-1.5">
            <p className="text-gray-700 font-semibold">Kredi/Banka Kartın Bulunamadı!</p>
            <p className="text-sm text-gray-400 max-w-xs">
              Kredi/Banka kartlarını Tıklapay cüzdanıma ekleyerek ödemelerini hızlıca yapabilirsin.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setModalMode('add')}
            className="bg-[#E30A17] text-white text-sm font-semibold rounded-full px-8 py-3.5 hover:bg-[#c80914] transition-colors"
          >
            Yeni Kart Ekle
          </button>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-3">
            {cards.map((card) => {
              const isSelected = card.id === selectedCardId;
              return (
                <div
                  key={card.id}
                  className={`flex items-center justify-between gap-3 rounded-2xl border px-4 py-3.5 transition-colors ${
                    isSelected ? 'border-[#E30A17]' : 'border-gray-100'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => selectSavedCard(card.id)}
                    className="flex items-center gap-3 flex-1 min-w-0 text-left"
                  >
                    <FaCreditCard className="w-4 h-4 text-gray-700 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-gray-800 text-sm">{card.cardHolderName}</p>
                      <p className="text-xs text-gray-400">
                        **** **** **** {card.last4} · {card.expiry}
                      </p>
                      <p className="text-xs text-gray-400">Kalan limit: {formatBalance(card.balance)}</p>
                    </div>
                  </button>
                  <div className="flex items-center gap-2 shrink-0">
                    {isSelected && (
                      <span className="bg-red-50 text-[#E30A17] text-xs font-semibold rounded-full px-3 py-1.5 whitespace-nowrap">
                        Seçili Kart
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => setModalMode({ editCard: card })}
                      className="bg-[#E30A17] text-white text-xs font-semibold rounded-full px-4 py-2 hover:bg-[#c80914] transition-colors whitespace-nowrap"
                    >
                      Düzenle
                    </button>
                    <button
                      type="button"
                      aria-label="Kartı sil"
                      onClick={() => removeSavedCard(card.id)}
                      className="text-gray-300 hover:text-[#E30A17] transition-colors p-2"
                    >
                      <FaTrash className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => setModalMode('add')}
            className="self-start bg-[#E30A17] text-white text-sm font-semibold rounded-full px-6 py-3 hover:bg-[#c80914] transition-colors"
          >
            Kart Ekle
          </button>
        </>
      )}

      {modalMode && <CardFormModal mode={modalMode} onClose={() => setModalMode(null)} />}
    </div>
  );
};

const PLACEHOLDER_COPY: Record<string, { title: string; message: string }> = {
  favorites: { title: 'Favori Restoranlar', message: 'Favori restoranların burada listelenecek.' },
  settings: { title: 'Ayarlarım', message: 'Hesap ayarların yakında burada olacak.' },
  help: { title: 'Yardım Merkezi', message: 'Sıkça sorulan sorular ve destek burada olacak.' },
};

const PlaceholderPanel = ({ tab }: { tab: string }) => {
  const copy = PLACEHOLDER_COPY[tab] ?? { title: '', message: 'Yakında burada olacak.' };
  return (
    <div className="bg-white rounded-2xl p-6 flex flex-col gap-2 items-center text-center py-16">
      <h2 className="text-gray-800 text-lg">{copy.title}</h2>
      <p className="text-sm text-gray-400">{copy.message}</p>
    </div>
  );
};

const ProfilePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, userName, logout, walletBalanceByUser } = useStore();
  const walletBalance = userName ? walletBalanceByUser[userName] ?? 0 : 0;
  const initialTab = (location.state as { tab?: ProfileTab } | null)?.tab ?? 'user';
  const [activeTab, setActiveTab] = useState<ProfileTab>(initialTab);

  useEffect(() => {
    if (!isAuthenticated) navigate('/login');
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) return null;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start w-full">
      <div className="flex flex-col gap-4 w-full lg:w-[280px] lg:shrink-0">
        <button
          type="button"
          onClick={() => navigate('/tiklapaycuzdanim')}
          className="bg-red-50 rounded-2xl p-5 flex flex-col gap-3 text-left hover:bg-red-100 transition-colors"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="bg-[#E30A17] text-white text-xs font-bold w-6 h-6 rounded-md flex items-center justify-center">
                P
              </span>
              <span className="text-gray-800 text-sm font-semibold">Tıklapay Cüzdanım</span>
            </div>
            <FaChevronRight className="text-gray-400 w-3 h-3" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{formatBalance(walletBalance)}</p>
          <span className="bg-[#E30A17] text-white text-xs font-semibold rounded-full px-3 py-1 self-start">
            Harcadıkça kazan!
          </span>
          <div className="bg-white rounded-xl p-3 flex items-center justify-between">
            <span className="flex items-center gap-2 text-sm text-gray-700">
              <FaStar className="text-[#E30A17] w-3.5 h-3.5" /> Tıkla Param
            </span>
            <span className="text-sm font-semibold text-gray-800">1.891,00 TP</span>
          </div>
        </button>

        <div className="bg-white rounded-2xl p-3 flex flex-col gap-1">
          {SIDEBAR_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center justify-between gap-2 rounded-xl px-4 py-3 text-sm transition-colors ${
                  isActive ? 'bg-red-50 text-[#E30A17] font-semibold' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  {item.label}
                </span>
                {item.badge && (
                  <span className="bg-green-500 text-white text-[10px] font-bold rounded-full px-2 py-0.5">{item.badge}</span>
                )}
              </button>
            );
          })}

          <button
            type="button"
            onClick={() => setActiveTab('help')}
            className={`mt-2 flex items-center justify-center gap-2 border rounded-full py-3 text-sm font-semibold transition-colors ${
              activeTab === 'help' ? 'border-[#E30A17] bg-red-50 text-[#E30A17]' : 'border-[#E30A17] text-[#E30A17] hover:bg-red-50'
            }`}
          >
            <FaHeadset className="w-4 h-4" /> Yardım Merkezi
          </button>
        </div>

        <button
          type="button"
          className="bg-[#E30A17] text-white text-sm font-semibold rounded-2xl py-4 hover:bg-[#c80914] transition-colors"
        >
          Arkadaşını Davet Et, Tıkla Para Kazan!
        </button>

        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 text-[#E30A17] text-sm font-semibold py-2 hover:underline"
        >
          <FaRightFromBracket className="w-4 h-4" /> Çıkış Yap
        </button>
      </div>

      <div className="flex flex-col gap-4 w-full flex-1">
        {userName && activeTab === 'user' && <UserInfoPanel />}
        {activeTab === 'addresses' && <AddressesPanel />}
        {activeTab === 'orders' && <OrdersPanel />}
        {activeTab === 'cards' && <CardsPanel />}
        {activeTab === 'coupons' && <CouponsPanel showSearch={false} />}
        {['favorites', 'settings', 'help'].includes(activeTab) && <PlaceholderPanel tab={activeTab} />}
      </div>
    </div>
  );
};

export default ProfilePage;
