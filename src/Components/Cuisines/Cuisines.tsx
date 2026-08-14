import { useRef } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa6';
import { cuisines, type Cuisine } from '../../data/cuisines';

const CuisineCard = ({
  cuisine,
  isActive,
  onClick,
}: {
  cuisine: Cuisine;
  isActive: boolean;
  onClick?: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`relative flex flex-col w-24 h-24 sm:w-32 sm:h-32 rounded-[20px] overflow-hidden border-[2.5px] sm:border-4 cursor-pointer transition-colors active:bg-gray-50 shrink-0 ${
      isActive ? 'border-[#E91D34]' : 'border-gray-200 hover:border-[#E91D34]'
    }`}
  >
    <div className="relative flex items-center justify-center h-2/3 w-full">
      <img src={cuisine.image} alt={cuisine.name} className="w-full h-full object-cover" />
    </div>
    <div
      className={`w-full h-1/3 p-1 rounded-tl-[4px] rounded-tr-[4px] text-xs sm:text-sm font-normal flex justify-center items-center text-center leading-tight ${
        isActive ? 'text-[#E91D34]' : 'text-gray-700'
      }`}
    >
      {cuisine.name}
    </div>
  </button>
);

interface CuisinesProps {
  activeCategory?: string | null;
  onSelect?: (categoryId: string) => void;
}

const Cuisines = ({ activeCategory = null, onSelect }: CuisinesProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollByAmount = (amount: number) => {
    scrollRef.current?.scrollBy({ left: amount, behavior: 'smooth' });
  };

  return (
    <section className="bg-white rounded-3xl p-6 sm:p-8">
      <div className="flex items-center justify-between -mt-4 -ml-4">
        <h2 className="text-[24px] text-gray-600">Mutfaklar</h2>
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Önceki"
            onClick={() => scrollByAmount(-300)}
            className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 text-gray-400 hover:text-[#E91D34] hover:border-[#E91D34] transition-colors"
          >
            <FaChevronLeft className="w-3 h-3" />
          </button>
          <button
            type="button"
            aria-label="Sonraki"
            onClick={() => scrollByAmount(300)}
            className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 text-gray-400 hover:text-[#E91D34] hover:border-[#E91D34] transition-colors"
          >
            <FaChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-5 overflow-x-auto pr-6 sm:pr-8 mt-4 -ml-4 -mb-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        {cuisines.map((cuisine) => (
          <CuisineCard
            key={cuisine.id}
            cuisine={cuisine}
            isActive={activeCategory === cuisine.id}
            onClick={onSelect ? () => onSelect(cuisine.id) : undefined}
          />
        ))}
      </div>
    </section>
  );
};

export default Cuisines;
