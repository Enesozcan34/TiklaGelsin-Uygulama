import burgerImg from '../assets/burger.png';
import tavukImg from '../assets/tavuk.png';
import etImg from '../assets/et.png';
import sutImg from '../assets/sut.png';
import kebapImg from '../assets/kebap.png';
import mantiImg from '../assets/manti.png';
import cikolataImg from '../assets/cikolata.png';
import salataImg from '../assets/salata.png';
import donerImg from '../assets/doner.png';
import pastaneImg from '../assets/patisseriebakery.png';

export interface Cuisine {
  id: string;
  name: string;
  image: string;
}

export const cuisines: Cuisine[] = [
  { id: 'burger', name: 'Burger', image: burgerImg },
  { id: 'tavuk', name: 'Tavuk', image: tavukImg },
  { id: 'et', name: 'Et ve Et Ürünleri', image: etImg },
  { id: 'sut', name: 'Süt ve Süt Ürünleri', image: sutImg },
  { id: 'kebap', name: 'Kebap', image: kebapImg },
  { id: 'manti-makarna', name: 'Mantı & Makarna', image: mantiImg },
  { id: 'cikolata', name: 'Çikolata', image: cikolataImg },
  { id: 'salata', name: 'Salata', image: salataImg },
  { id: 'doner', name: 'Döner', image: donerImg },
  { id: 'pastane-firin', name: 'Pastane & Fırın', image: pastaneImg },
];
