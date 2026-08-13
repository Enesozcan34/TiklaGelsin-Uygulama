import { useState } from 'react';
import { FaBurger, FaChevronDown, FaChevronUp, FaMinus, FaPlus, FaXmark } from 'react-icons/fa6';
import type { Product } from '../../data/restaurants';
import useStore, { type CartItemOption } from '../../store/useStore';

const formatPrice = (price: number): string => `${price.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL`;

const isSingleSelectGroup = (groupName: string): boolean => {
  const normalized = groupName.toLocaleLowerCase('tr-TR');
  return normalized.includes('boy') || normalized.includes('sos');
};

interface ProductOptionsModalProps {
  product: Product;
  restaurantId: string;
  restaurantTitle: string;
  onClose: () => void;
}

const ProductOptionsModal = ({ product, restaurantId, restaurantTitle, onClose }: ProductOptionsModalProps) => {
  const { cartItems, addToCart, clearCart } = useStore();
  const choiceGroups = product.choices ?? [];
  const [showRestaurantConflict, setShowRestaurantConflict] = useState(false);

  const [selections, setSelections] = useState<Record<number, string[]>>(() => {
    const initial: Record<number, string[]> = {};
    choiceGroups.forEach((group, index) => {
      const groupChoices = group.choices ?? [];
      initial[index] = isSingleSelectGroup(group.name)
        ? groupChoices.slice(0, 1).map((choice) => choice.name)
        : groupChoices.filter((choice) => choice.price === 0).map((choice) => choice.name);
    });
    return initial;
  });
  const [expandedGroups, setExpandedGroups] = useState<Set<number>>(() => new Set(choiceGroups.length > 0 ? [0] : []));
  const [quantity, setQuantity] = useState(1);

  const toggleExpand = (index: number) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const selectSingle = (groupIndex: number, choiceName: string) => {
    setSelections((prev) => ({ ...prev, [groupIndex]: [choiceName] }));
  };

  const toggleMultiple = (groupIndex: number, choiceName: string) => {
    setSelections((prev) => {
      const current = prev[groupIndex] ?? [];
      const next = current.includes(choiceName)
        ? current.filter((name) => name !== choiceName)
        : [...current, choiceName];
      return { ...prev, [groupIndex]: next };
    });
  };

  const extrasTotal = choiceGroups.reduce((sum, group, index) => {
    const selected = selections[index] ?? [];
    const groupTotal = (group.choices ?? [])
      .filter((choice) => selected.includes(choice.name))
      .reduce((choiceSum, choice) => choiceSum + choice.price, 0);
    return sum + groupTotal;
  }, 0);

  const unitPrice = product.price + extrasTotal;
  const totalPrice = unitPrice * quantity;

  const selectedOptions: CartItemOption[] = choiceGroups
    .map((group, index) => ({
      groupName: group.name,
      choices: (group.choices ?? []).filter((choice) => (selections[index] ?? []).includes(choice.name)).map((choice) => choice.name),
    }))
    .filter((group) => group.choices.length > 0);

  const commitAddToCart = () => {
    const optionsKey = selectedOptions.map((group) => `${group.groupName}:${group.choices.join(',')}`).join('|');
    addToCart(
      {
        id: `${restaurantId}::${product.name}::${optionsKey}`,
        restaurantId,
        restaurantTitle,
        productName: product.name,
        productImage: product.image,
        unitPrice,
        options: selectedOptions,
      },
      quantity,
    );
    onClose();
  };

  const handleAddToCart = () => {
    const hasDifferentRestaurantItems = cartItems.some((item) => item.restaurantId !== restaurantId);
    if (hasDifferentRestaurantItems) {
      setShowRestaurantConflict(true);
      return;
    }
    commitAddToCart();
  };

  const confirmReplaceCart = () => {
    clearCart();
    commitAddToCart();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden">
        <div className="flex items-start justify-between px-5 pt-5 pb-3 border-b border-gray-100">
          <div>
            <h2 className="text-gray-800 text-base">{product.name}</h2>
            <p className="text-xs text-gray-500 mt-1">{product.description}</p>
          </div>
          <button
            type="button"
            aria-label="Kapat"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 -mt-1 -mr-1 shrink-0"
          >
            <FaXmark className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 px-5 py-4 flex flex-col gap-3">
          <div className="w-full h-40 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0">
            {product.image ? (
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <FaBurger className="w-10 h-10 text-gray-300" />
            )}
          </div>

          {choiceGroups.map((group, groupIndex) => {
            const isExpanded = expandedGroups.has(groupIndex);
            const singleSelect = isSingleSelectGroup(group.name);
            const selected = selections[groupIndex] ?? [];
            return (
              <div key={group.name} className="border border-gray-100 rounded-2xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => toggleExpand(groupIndex)}
                  className="w-full flex items-center justify-between px-4 py-3 bg-white hover:bg-gray-50 transition-colors"
                >
                  <span className="text-gray-800 text-sm">{group.name}</span>
                  {isExpanded ? (
                    <FaChevronUp className="w-3.5 h-3.5 text-gray-400" />
                  ) : (
                    <FaChevronDown className="w-3.5 h-3.5 text-gray-400" />
                  )}
                </button>

                {isExpanded && (
                  <div className="flex flex-col gap-2 px-4 pb-4">
                    {(group.choices ?? []).map((choice) => {
                      const isChecked = selected.includes(choice.name);
                      return (
                        <label key={choice.name} className="flex items-center justify-between gap-3 cursor-pointer py-1">
                          <span className="flex items-center gap-2.5">
                            <input
                              type={singleSelect ? 'radio' : 'checkbox'}
                              name={`group-${groupIndex}`}
                              checked={isChecked}
                              onChange={() =>
                                singleSelect ? selectSingle(groupIndex, choice.name) : toggleMultiple(groupIndex, choice.name)
                              }
                              className="accent-[#E30A17] w-4 h-4"
                            />
                            <span className="text-sm text-gray-700">
                              {choice.name}
                              {choice.description && <span className="block text-xs text-gray-400">{choice.description}</span>}
                            </span>
                          </span>
                          {choice.price > 0 && (
                            <span className="text-xs text-gray-500 shrink-0">+{formatPrice(choice.price)}</span>
                          )}
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between gap-4 px-5 py-4 border-t border-gray-100 shrink-0">
          <div>
            <p className="text-xs text-gray-400">Toplam</p>
            <p className="text-gray-800">{formatPrice(totalPrice)}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3 bg-gray-50 rounded-full px-2 py-1.5">
              <button
                type="button"
                aria-label="Azalt"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-7 h-7 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-600 hover:border-[#E30A17] hover:text-[#E30A17] transition-colors"
              >
                <FaMinus className="w-3 h-3" />
              </button>
              <span className="text-sm text-gray-700 w-4 text-center">{quantity}</span>
              <button
                type="button"
                aria-label="Artır"
                onClick={() => setQuantity((q) => q + 1)}
                className="w-7 h-7 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-600 hover:border-[#E30A17] hover:text-[#E30A17] transition-colors"
              >
                <FaPlus className="w-3 h-3" />
              </button>
            </div>
            <button
              type="button"
              onClick={handleAddToCart}
              className="bg-[#E30A17] text-white text-sm rounded-full px-6 py-3 hover:bg-[#c80914] transition-colors"
            >
              Sepete Ekle
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductOptionsModal;
