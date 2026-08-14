import { useState } from 'react';
import { FaXmark } from 'react-icons/fa6';
import useStore from '../../store/useStore';

interface AddCouponModalProps {
  onClose: () => void;
  onAdded: () => void;
}

const AddCouponModal = ({ onClose, onAdded }: AddCouponModalProps) => {
  const { addCoupon } = useStore();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const isValidLength = code.trim().length === 5;

  const handleSubmit = () => {
    if (!isValidLength) return;
    const result = addCoupon(code.trim());
    if (!result.success) {
      setError(result.message);
      return;
    }
    onAdded();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-3xl w-full max-w-sm p-6 flex flex-col gap-4">
        <button
          type="button"
          aria-label="Kapat"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <FaXmark className="w-4 h-4" />
        </button>

        <div className="flex flex-col items-center gap-1 text-center pt-2">
          <h2 className="text-gray-800 text-lg font-semibold">Kupon Kodu</h2>
          <p className="text-sm text-gray-400">Aşağıdaki alana kupon kodunu girebilirsin.</p>
        </div>

        <input
          type="text"
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
            setError('');
          }}
          maxLength={5}
          placeholder="Kupon Kodu"
          className="border border-gray-200 rounded-full px-5 py-3 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-[#E91D34] transition-colors text-center"
        />

        {error && <p className="text-xs text-[#E91D34] text-center -mt-2">{error}</p>}

        <button
          type="button"
          disabled={!isValidLength}
          onClick={handleSubmit}
          className={`w-full rounded-full py-3 text-sm font-semibold transition-colors ${
            isValidLength ? 'bg-[#E91D34] text-white hover:bg-[#CA192D]' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          Kupon Ekle
        </button>

        <button
          type="button"
          onClick={onClose}
          className="w-full border border-[#E91D34] text-[#E91D34] rounded-full py-3 text-sm font-semibold hover:bg-red-50 transition-colors"
        >
          Vazgeç
        </button>
      </div>
    </div>
  );
};

export default AddCouponModal;
