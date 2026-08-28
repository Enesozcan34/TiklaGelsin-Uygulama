import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Address {
  id: string;
  label: string;
  fullAddress: string;
  icon: 'home' | 'work';
}

const defaultAddresses: Address[] = [
  {
    id: 'home',
    label: 'Ev',
    fullAddress: 'Üniversite Mah. Sarıgül Sok. No: 31/4 Kyk Daire: 0 Avcılar/İstanbul',
    icon: 'home',
  },
  {
    id: 'work',
    label: 'İş',
    fullAddress: 'Reşitpaşa Mah. Katar Cd. No: 2/85 Daire: 0 Sarıyer/İstanbul',
    icon: 'work',
  },
  {
    id: 'itu',
    label: 'İtü',
    fullAddress: 'Reşitpaşa Mah. Katar Cd. No: 2/85 İtü bisiklet evi Daire: 1 Sarıyer/İstanbul',
    icon: 'work',
  },
];

export interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthDate: string;
  gender: string;
  team: string;
}

const defaultProfilesByUser: Record<string, UserProfile> = {
  Enes: {
    firstName: 'Enes',
    lastName: 'Özcan',
    email: 'akhitoozcan1234@gmail.com',
    phone: '5530919646',
    birthDate: '',
    gender: 'Belirtmek İstemiyorum',
    team: '',
  },
  Burak: {
    firstName: 'Burak',
    lastName: 'Arıcı',
    email: 'burakarici@tiklagelsin.com',
    phone: '',
    birthDate: '',
    gender: 'Belirtmek İstemiyorum',
    team: '',
  },
};

// Demo amacıyla kullanıcı bazlı sabit Pluxee mobil ödeme kodu (gerçek bir SMS/OTP akışı yok).
export const PLUXEE_VERIFICATION_CODE_BY_USER: Record<string, string> = {
  Enes: '123456',
  Burak: '654321',
};

export type CouponDiscount =
  | { kind: 'percentage'; percent: number; targetProductName?: string }
  | { kind: 'fixedAmount'; amount: number; minSpend?: number; targetProductName?: string }
  | { kind: 'secondItemDiscount'; percent: number; targetProductName?: string };

export interface CouponDetail {
  code: string;
  restaurantId: string;
  restaurantTitle: string;
  restaurantImage: string;
  title: string;
  description: string;
  validUntil: string;
  discount: CouponDiscount;
  // Kuponun toplam kullanım hakkı (kalan adet, kullanıcı bazlı ayrıca takip edilir)
  totalUses: number;
}

export const ALL_COUPONS: CouponDetail[] = [
  {
    code: 'WkPqz',
    restaurantId: 'Popeyes',
    restaurantTitle: 'Popeyes',
    restaurantImage: '/images/restaurants/popeyes-logo.png',
    title: 'Chicken Sandwich Menü Alana, İkincisi Hediye',
    description: "Popeyes Chicken Sandwich Menü'nden 2 adet alana ikincisi ücretsiz!",
    validUntil: '2026-08-16',
    discount: { kind: 'secondItemDiscount', percent: 100, targetProductName: 'Popeyes Chicken Sandwich Menü' },
    totalUses: 10,
  },
  {
    code: 'mNBvt',
    restaurantId: 'BurgerKing',
    restaurantTitle: 'Burger King',
    restaurantImage: '/images/restaurants/burger-king-logo.png',
    title: 'Whopper Menüde %20 İndirim',
    description: 'Whopper Menü siparişlerinde geçerli indirim fırsatı.',
    validUntil: '2026-09-01',
    discount: { kind: 'percentage', percent: 20, targetProductName: 'Whopper Menü' },
    totalUses: 5,
  },
  {
    code: 'XyLoR',
    restaurantId: 'AmasyaEtUrunleri',
    restaurantTitle: 'Amasya Et Ürünleri',
    restaurantImage: '/images/restaurants/amasya-et-urunleri.png',
    title: '150 TL Üzeri Siparişe 30 TL İndirim',
    description: "Amasya Et Ürünleri'nde 150 TL üzeri siparişlerde geçerlidir.",
    validUntil: '2026-08-25',
    discount: { kind: 'fixedAmount', amount: 30, minSpend: 150 },
    totalUses: 8,
  },
  {
    code: 'qAzWs',
    restaurantId: 'SutKahvaltiEvi',
    restaurantTitle: 'Süt Kahvaltı Evi',
    restaurantImage: '/images/restaurants/sut-kahvalti-evi.png',
    title: 'Kahvaltı Tabağına Çay Hediye',
    description: "Serpme Kahvaltı Tabağı (2 Kişilik) siparişine sıcak içecek hediye.",
    validUntil: '2026-08-20',
    discount: { kind: 'fixedAmount', amount: 25, targetProductName: 'Serpme Kahvaltı Tabağı (2 Kişilik)' },
    totalUses: 6,
  },
  {
    code: 'TgHjK',
    restaurantId: 'Popeyes',
    restaurantTitle: 'Popeyes',
    restaurantImage: '/images/restaurants/popeyes-logo.png',
    title: 'İkinci Üründe %50 İndirim',
    description: 'Seçili menülerde ikinci ürün yarı fiyatına.',
    validUntil: '2026-09-10',
    discount: { kind: 'secondItemDiscount', percent: 50 },
    totalUses: 10,
  },
  {
    code: 'bNmQw',
    restaurantId: 'BurgerKing',
    restaurantTitle: 'Burger King',
    restaurantImage: '/images/restaurants/burger-king-logo.png',
    title: 'Big King Menüde Patates Büyütme Hediye',
    description: 'Big King Menü siparişlerinde patates büyütme ücretsiz.',
    validUntil: '2026-08-30',
    discount: { kind: 'fixedAmount', amount: 15, targetProductName: 'Big King Menü' },
    totalUses: 7,
  },
  {
    code: 'LpOiU',
    restaurantId: 'AmasyaEtUrunleri',
    restaurantTitle: 'Amasya Et Ürünleri',
    restaurantImage: '/images/restaurants/amasya-et-urunleri.png',
    title: '2 Al 1 Öde Fırsatı',
    description: 'Seçili ürünlerde 2 al 1 öde kampanyası.',
    validUntil: '2026-09-05',
    discount: { kind: 'secondItemDiscount', percent: 100 },
    totalUses: 5,
  },
  {
    code: 'eRtYu',
    restaurantId: 'SutKahvaltiEvi',
    restaurantTitle: 'Süt Kahvaltı Evi',
    restaurantImage: '/images/restaurants/sut-kahvalti-evi.png',
    title: 'Serpme Kahvaltıda %15 İndirim',
    description: 'Serpme Kahvaltı Tabağı (2 Kişilik) siparişlerinde geçerli indirim.',
    validUntil: '2026-08-22',
    discount: { kind: 'percentage', percent: 15, targetProductName: 'Serpme Kahvaltı Tabağı (2 Kişilik)' },
    totalUses: 6,
  },
  {
    code: 'ZxCvB',
    restaurantId: 'Popeyes',
    restaurantTitle: 'Popeyes',
    restaurantImage: '/images/restaurants/popeyes-logo.png',
    title: 'İlk Siparişe Özel 50 TL İndirim',
    description: 'İlk Popeyes siparişinde 50 TL indirim fırsatı.',
    validUntil: '2026-09-15',
    discount: { kind: 'fixedAmount', amount: 50 },
    totalUses: 3,
  },
  {
    code: 'jKlMn',
    restaurantId: 'BurgerKing',
    restaurantTitle: 'Burger King',
    restaurantImage: '/images/restaurants/burger-king-logo.png',
    title: 'Menüde Ekstra Peynir Hediye',
    description: 'Tüm menü siparişlerinde ekstra peynir ücretsiz.',
    validUntil: '2026-08-18',
    discount: { kind: 'fixedAmount', amount: 10 },
    totalUses: 8,
  },
];

export const getCouponDetail = (code: string): CouponDetail | undefined =>
  ALL_COUPONS.find((coupon) => coupon.code.toLocaleLowerCase('tr-TR') === code.toLocaleLowerCase('tr-TR'));

// Kişi bazlı tutulan kuponlar (kullanıcı adına göre sahip olunan kupon kodları)
const defaultCouponsByUser: Record<string, string[]> = {
  Enes: ['WkPqz', 'mNBvt', 'XyLoR'],
  Burak: ['WkPqz', 'qAzWs', 'TgHjK', 'bNmQw', 'LpOiU'],
};

// Aynı kupon kodu birden fazla kullanıcıya tanımlı olabildiği için kalan kullanım
// adedi kullanıcı bazlı tutulur, kuponlar arasında paylaşılmaz.
const buildDefaultCouponUses = (codes: string[]): Record<string, number> =>
  codes.reduce<Record<string, number>>((acc, code) => {
    const coupon = getCouponDetail(code);
    if (coupon) acc[coupon.code] = coupon.totalUses;
    return acc;
  }, {});

const defaultCouponUsesByUser: Record<string, Record<string, number>> = Object.fromEntries(
  Object.entries(defaultCouponsByUser).map(([userName, codes]) => [userName, buildDefaultCouponUses(codes)]),
);

export interface CartItemOption {
  groupName: string;
  choices: string[];
}

export interface CartItem {
  id: string;
  restaurantId: string;
  restaurantTitle: string;
  productName: string;
  productImage: string;
  unitPrice: number;
  quantity: number;
  options: CartItemOption[];
}

export interface SavedCard {
  id: string;
  cardHolderName: string;
  last4: string;
  expiry: string;
  balance: number;
}

export interface OrderDiscountLine {
  label: string;
  amount: number;
}

export interface Order {
  id: string;
  restaurantId: string;
  restaurantTitle: string;
  items: CartItem[];
  totalAmount: number;
  createdAt: string;
  address?: Address;
  paymentMethodLabel?: string;
  cartSubtotal?: number;
  discounts?: OrderDiscountLine[];
}

interface AuthState {
  isAuthenticated: boolean;
  errorMessage: string | null;
  userName: string | null;
  login: (email: string, pass: string) => void;
  logout: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

interface AddressState {
  addresses: Address[];
  selectedAddressId: string;
  selectAddress: (id: string) => void;
  addAddress: (address: Omit<Address, 'id'>) => void;
  updateAddress: (id: string, updates: Omit<Address, 'id'>) => void;
  removeAddress: (id: string) => void;
}

interface ProfileState {
  profilesByUser: Record<string, UserProfile>;
  updateProfile: (updates: Partial<UserProfile>) => void;
}

interface CartState {
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>, quantity: number) => void;
  removeFromCart: (id: string) => void;
  updateCartQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
}

interface PaymentState {
  savedCardsByUser: Record<string, SavedCard[]>;
  selectedCardIdByUser: Record<string, string>;
  addSavedCard: (card: Omit<SavedCard, 'id'>) => SavedCard | null;
  updateSavedCard: (cardId: string, updates: Omit<SavedCard, 'id'>) => void;
  removeSavedCard: (cardId: string) => void;
  selectSavedCard: (cardId: string) => void;
  chargeCard: (cardId: string, amount: number) => boolean;
}

interface OrderState {
  ordersByUser: Record<string, Order[]>;
  placeOrder: (order: Omit<Order, 'id' | 'createdAt'>) => Order | null;
}

export interface WalletTransaction {
  id: string;
  label: string;
  date: string;
  amount: number;
  type: 'topup' | 'expense';
}

interface WalletState {
  walletBalanceByUser: Record<string, number>;
  walletTransactionsByUser: Record<string, WalletTransaction[]>;
  topUpWallet: (amount: number) => { success: boolean; message: string };
  chargeWallet: (amount: number, label?: string) => boolean;
}

export interface TiklaParaTransaction {
  id: string;
  label: string;
  date: string;
  amount: number;
  type: 'earn' | 'spend' | 'expired';
  expiresAt?: string;
}

interface TiklaParaState {
  tiklaParaBalanceByUser: Record<string, number>;
  tiklaParaTransactionsByUser: Record<string, TiklaParaTransaction[]>;
  buyTiklaPara: (tlAmount: number, tpAmount: number) => { success: boolean; message: string };
  chargeTiklaPara: (amount: number) => boolean;
}

// Kişi bazlı tutulan kuponlar için store state'i
interface CouponState {
  couponsByUser: Record<string, string[]>;
  couponUsesRemainingByUser: Record<string, Record<string, number>>;
  getUserCoupons: () => string[];
  getCouponUsesRemaining: (code: string) => number;
  addCoupon: (code: string) => { success: boolean; message: string };
  useCouponUnit: (code: string) => boolean;
  // Kupon detay sayfasındaki "Kuponu Uygula" akışından restoran/sepet üzerinden
  // ödeme sayfasına taşınan, henüz seçili kupon olarak uygulanmamış kupon kodu.
  pendingCouponCode: string | null;
  setPendingCouponCode: (code: string | null) => void;
}

const useStore = create<
  AuthState & AddressState & ProfileState & CartState & PaymentState & OrderState & WalletState & TiklaParaState & CouponState
>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      errorMessage: null,
      userName: null,
      searchQuery: '',
      cartItems: [],

      login: (email, pass) => {
        const seedProfile = (userName: string) => {
          const state = get();
          if (state.profilesByUser[userName]) return;
          const fallback: UserProfile = {
            firstName: userName,
            lastName: '',
            email,
            phone: '',
            birthDate: '',
            gender: 'Belirtmek İstemiyorum',
            team: '',
          };
          set({
            profilesByUser: {
              ...state.profilesByUser,
              [userName]: defaultProfilesByUser[userName] ?? fallback,
            },
          });
        };

        if (email === 'enesozcan@tiklagelsin.com' && pass === 'Enes1234') {
          seedProfile('Enes');
          set({ isAuthenticated: true, errorMessage: null, userName: 'Enes' });
        } else if (email === 'burakarici@tiklagelsin.com' && pass === 'Burak1234') {
          seedProfile('Burak');
          set({ isAuthenticated: true, errorMessage: null, userName: 'Burak' });
        } else {

          set({ isAuthenticated: false, errorMessage: 'e-mail veya şifreniz yanlış lütfen tekrar deneyiniz.' });
        }
      },

      logout: () => set({ isAuthenticated: false, userName: null }),

      setSearchQuery: (query) => set({ searchQuery: query }),

      addresses: defaultAddresses,
      selectedAddressId: defaultAddresses[0].id,

      selectAddress: (id) => set({ selectedAddressId: id }),

      addAddress: (address) =>
        set((state) => {
          const newAddress: Address = { ...address, id: crypto.randomUUID() };
          return { addresses: [...state.addresses, newAddress] };
        }),

      updateAddress: (id, updates) =>
        set((state) => ({
          addresses: state.addresses.map((address) => (address.id === id ? { ...updates, id } : address)),
        })),

      removeAddress: (id) =>
        set((state) => {
          if (state.addresses.length <= 1) return state;
          const remaining = state.addresses.filter((address) => address.id !== id);
          return {
            addresses: remaining,
            selectedAddressId:
              state.selectedAddressId === id ? remaining[0].id : state.selectedAddressId,
          };
        }),

      profilesByUser: {},

      updateProfile: (updates) => {
        const state = get();
        if (!state.userName) return;
        const userName = state.userName;
        const current = state.profilesByUser[userName];
        if (!current) return;
        set({
          profilesByUser: { ...state.profilesByUser, [userName]: { ...current, ...updates } },
        });
      },

      addToCart: (item, quantity) =>
        set((state) => {
          const existing = state.cartItems.find((cartItem) => cartItem.id === item.id);
          if (existing) {
            return {
              cartItems: state.cartItems.map((cartItem) =>
                cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + quantity } : cartItem,
              ),
            };
          }
          return { cartItems: [...state.cartItems, { ...item, quantity }] };
        }),

      removeFromCart: (id) => set((state) => ({ cartItems: state.cartItems.filter((cartItem) => cartItem.id !== id) })),

      updateCartQuantity: (id, quantity) =>
        set((state) => ({
          cartItems:
            quantity <= 0
              ? state.cartItems.filter((cartItem) => cartItem.id !== id)
              : state.cartItems.map((cartItem) => (cartItem.id === id ? { ...cartItem, quantity } : cartItem)),
        })),

      clearCart: () => set({ cartItems: [] }),

      savedCardsByUser: {},
      selectedCardIdByUser: {},

      addSavedCard: (card) => {
        const state = get();
        if (!state.userName) return null;
        const userName = state.userName;
        const newCard: SavedCard = { ...card, id: crypto.randomUUID() };
        set({
          savedCardsByUser: {
            ...state.savedCardsByUser,
            [userName]: [...(state.savedCardsByUser[userName] ?? []), newCard],
          },
          selectedCardIdByUser: { ...state.selectedCardIdByUser, [userName]: newCard.id },
        });
        return newCard;
      },

      updateSavedCard: (cardId, updates) => {
        const state = get();
        if (!state.userName) return;
        const userName = state.userName;
        set({
          savedCardsByUser: {
            ...state.savedCardsByUser,
            [userName]: (state.savedCardsByUser[userName] ?? []).map((card) =>
              card.id === cardId ? { ...updates, id: cardId } : card,
            ),
          },
        });
      },

      removeSavedCard: (cardId) => {
        const state = get();
        if (!state.userName) return;
        const userName = state.userName;
        const remainingCards = (state.savedCardsByUser[userName] ?? []).filter((card) => card.id !== cardId);
        const wasSelected = state.selectedCardIdByUser[userName] === cardId;
        const nextSelectedCardIdByUser = { ...state.selectedCardIdByUser };
        if (wasSelected) {
          if (remainingCards.length > 0) {
            nextSelectedCardIdByUser[userName] = remainingCards[0].id;
          } else {
            delete nextSelectedCardIdByUser[userName];
          }
        }
        set({
          savedCardsByUser: { ...state.savedCardsByUser, [userName]: remainingCards },
          selectedCardIdByUser: nextSelectedCardIdByUser,
        });
      },

      selectSavedCard: (cardId) => {
        const state = get();
        if (!state.userName) return;
        set({ selectedCardIdByUser: { ...state.selectedCardIdByUser, [state.userName]: cardId } });
      },

      chargeCard: (cardId, amount) => {
        const state = get();
        if (!state.userName) return false;
        const userName = state.userName;
        const cards = state.savedCardsByUser[userName] ?? [];
        const card = cards.find((savedCard) => savedCard.id === cardId);
        if (!card || card.balance < amount) return false;
        set({
          savedCardsByUser: {
            ...state.savedCardsByUser,
            [userName]: cards.map((savedCard) =>
              savedCard.id === cardId ? { ...savedCard, balance: savedCard.balance - amount } : savedCard,
            ),
          },
        });
        return true;
      },

      ordersByUser: {},

      placeOrder: (order) => {
        const state = get();
        if (!state.userName) return null;
        const userName = state.userName;
        const newOrder: Order = { ...order, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
        set({
          ordersByUser: {
            ...state.ordersByUser,
            [userName]: [newOrder, ...(state.ordersByUser[userName] ?? [])],
          },
        });
        return newOrder;
      },

      walletBalanceByUser: {},
      walletTransactionsByUser: {},

      topUpWallet: (amount) => {
        const state = get();
        if (!state.userName) return { success: false, message: 'Yükleme yapmak için giriş yapmalısın.' };
        const userName = state.userName;
        const cardId = state.selectedCardIdByUser[userName];
        const card = cardId ? (state.savedCardsByUser[userName] ?? []).find((savedCard) => savedCard.id === cardId) : undefined;
        if (!card) return { success: false, message: 'Yükleme yapmak için önce bir kart seçmelisin.' };
        if (card.balance < amount) {
          const remaining = card.balance.toLocaleString('tr-TR', { minimumFractionDigits: 2 });
          return { success: false, message: `Kartında yeterli bakiye yok. Kalan kart limiti: ${remaining} TL.` };
        }
        const charged = get().chargeCard(card.id, amount);
        if (!charged) return { success: false, message: 'Yükleme başarısız oldu.' };
        const currentBalance = get().walletBalanceByUser[userName] ?? 0;
        const newTransaction: WalletTransaction = {
          id: crypto.randomUUID(),
          label: 'Kredi Kartı',
          date: new Date().toISOString(),
          amount,
          type: 'topup',
        };
        set({
          walletBalanceByUser: { ...get().walletBalanceByUser, [userName]: currentBalance + amount },
          walletTransactionsByUser: {
            ...get().walletTransactionsByUser,
            [userName]: [newTransaction, ...(get().walletTransactionsByUser[userName] ?? [])],
          },
        });
        return { success: true, message: 'Yükleme başarılı.' };
      },

      chargeWallet: (amount, label) => {
        const state = get();
        if (!state.userName) return false;
        const userName = state.userName;
        const currentBalance = state.walletBalanceByUser[userName] ?? 0;
        if (currentBalance < amount) return false;
        const newTransaction: WalletTransaction = {
          id: crypto.randomUUID(),
          label: label ?? 'Harcama',
          date: new Date().toISOString(),
          amount,
          type: 'expense',
        };
        set({
          walletBalanceByUser: { ...state.walletBalanceByUser, [userName]: currentBalance - amount },
          walletTransactionsByUser: {
            ...state.walletTransactionsByUser,
            [userName]: [newTransaction, ...(state.walletTransactionsByUser[userName] ?? [])],
          },
        });
        return true;
      },

      tiklaParaBalanceByUser: {},
      tiklaParaTransactionsByUser: {},

      buyTiklaPara: (tlAmount, tpAmount) => {
        const state = get();
        if (!state.userName) return { success: false, message: 'Satın almak için giriş yapmalısın.' };
        const userName = state.userName;
        const cardId = state.selectedCardIdByUser[userName];
        const card = cardId ? (state.savedCardsByUser[userName] ?? []).find((savedCard) => savedCard.id === cardId) : undefined;
        if (!card) return { success: false, message: 'Satın almak için önce bir kart seçmelisin.' };
        if (card.balance < tlAmount) {
          const remaining = card.balance.toLocaleString('tr-TR', { minimumFractionDigits: 2 });
          return { success: false, message: `Kartında yeterli bakiye yok. Kalan kart limiti: ${remaining} TL.` };
        }
        const charged = get().chargeCard(card.id, tlAmount);
        if (!charged) return { success: false, message: 'Satın alma başarısız oldu.' };
        const currentTp = get().tiklaParaBalanceByUser[userName] ?? 0;
        const profile = state.profilesByUser[userName];
        const label = profile ? `${profile.firstName} ${profile.lastName}`.trim().toUpperCase() : userName.toUpperCase();
        const purchaseDate = new Date();
        const expiryDate = new Date(purchaseDate);
        expiryDate.setFullYear(expiryDate.getFullYear() + 1);
        const newTransaction: TiklaParaTransaction = {
          id: crypto.randomUUID(),
          label,
          date: purchaseDate.toISOString(),
          amount: tpAmount,
          type: 'earn',
          expiresAt: expiryDate.toISOString(),
        };
        set({
          tiklaParaBalanceByUser: { ...get().tiklaParaBalanceByUser, [userName]: currentTp + tpAmount },
          tiklaParaTransactionsByUser: {
            ...get().tiklaParaTransactionsByUser,
            [userName]: [newTransaction, ...(get().tiklaParaTransactionsByUser[userName] ?? [])],
          },
        });
        return { success: true, message: 'Tıkla Para satın alma başarılı.' };
      },

      chargeTiklaPara: (amount) => {
        const state = get();
        if (!state.userName) return false;
        const userName = state.userName;
        const currentTp = state.tiklaParaBalanceByUser[userName] ?? 0;
        if (currentTp < amount) return false;
        const profile = state.profilesByUser[userName];
        const label = profile ? `${profile.firstName} ${profile.lastName}`.trim().toUpperCase() : userName.toUpperCase();
        const newTransaction: TiklaParaTransaction = {
          id: crypto.randomUUID(),
          label,
          date: new Date().toISOString(),
          amount,
          type: 'spend',
        };
        set({
          tiklaParaBalanceByUser: { ...state.tiklaParaBalanceByUser, [userName]: currentTp - amount },
          tiklaParaTransactionsByUser: {
            ...state.tiklaParaTransactionsByUser,
            [userName]: [newTransaction, ...(state.tiklaParaTransactionsByUser[userName] ?? [])],
          },
        });
        return true;
      },

      // Kişi bazlı tutulan kuponlar
      couponsByUser: defaultCouponsByUser,
      couponUsesRemainingByUser: defaultCouponUsesByUser,

      getUserCoupons: () => {
        const state = get();
        if (!state.userName) return [];
        return state.couponsByUser[state.userName] ?? [];
      },

      getCouponUsesRemaining: (code) => {
        const state = get();
        const couponDetail = getCouponDetail(code);
        if (!couponDetail) return 0;
        if (!state.userName) return couponDetail.totalUses;
        const remaining = state.couponUsesRemainingByUser[state.userName]?.[couponDetail.code];
        return remaining ?? couponDetail.totalUses;
      },

      addCoupon: (code) => {
        const state = get();
        if (!state.userName) return { success: false, message: 'Kupon eklemek için giriş yapmalısın.' };
        const userName = state.userName;
        const couponDetail = getCouponDetail(code.trim());
        if (!couponDetail) return { success: false, message: 'Geçersiz kupon kodu.' };
        const owned = state.couponsByUser[userName] ?? [];
        if (owned.includes(couponDetail.code)) {
          return { success: false, message: 'Bu kupon zaten hesabına tanımlı.' };
        }
        set({
          couponsByUser: { ...state.couponsByUser, [userName]: [...owned, couponDetail.code] },
          couponUsesRemainingByUser: {
            ...state.couponUsesRemainingByUser,
            [userName]: { ...state.couponUsesRemainingByUser[userName], [couponDetail.code]: couponDetail.totalUses },
          },
        });
        return { success: true, message: 'Kupon başarıyla eklendi.' };
      },

      pendingCouponCode: null,
      setPendingCouponCode: (code) => set({ pendingCouponCode: code }),

      // Kupon bir siparişte uygulanıp sipariş tamamlandığında kalan kullanım adedini 1 azaltır.
      useCouponUnit: (code) => {
        const state = get();
        if (!state.userName) return false;
        const userName = state.userName;
        const couponDetail = getCouponDetail(code);
        if (!couponDetail) return false;
        const remaining = state.couponUsesRemainingByUser[userName]?.[couponDetail.code] ?? couponDetail.totalUses;
        if (remaining <= 0) return false;
        set({
          couponUsesRemainingByUser: {
            ...state.couponUsesRemainingByUser,
            [userName]: { ...state.couponUsesRemainingByUser[userName], [couponDetail.code]: remaining - 1 },
          },
        });
        return true;
      },
    }),
    {
      name: 'tikla-gelsin-storage',
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        userName: state.userName,
        savedCardsByUser: state.savedCardsByUser,
        selectedCardIdByUser: state.selectedCardIdByUser,
        ordersByUser: state.ordersByUser,
        addresses: state.addresses,
        selectedAddressId: state.selectedAddressId,
        profilesByUser: state.profilesByUser,
        walletBalanceByUser: state.walletBalanceByUser,
        walletTransactionsByUser: state.walletTransactionsByUser,
        tiklaParaBalanceByUser: state.tiklaParaBalanceByUser,
        tiklaParaTransactionsByUser: state.tiklaParaTransactionsByUser,
        couponsByUser: state.couponsByUser,
        couponUsesRemainingByUser: state.couponUsesRemainingByUser,
      }),
    },
  ),
);

export default useStore;
