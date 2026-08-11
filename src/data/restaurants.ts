import restaurantsData from './restaurants.json';

export interface ProductChoiceOption {
  name: string;
  description?: string;
  image?: string;
  url?: string;
  price: number;
  choices?: ProductChoiceOption[];
}

export interface Product {
  name: string;
  description: string;
  image: string;
  url: string;
  price: number;
  categories?: string[];
  sections?: string[];
  choices?: ProductChoiceOption[];
}

export interface RestaurantLocation {
  addressId: string;
  branchName: string;
}

export interface Restaurant {
  id: string;
  title: string;
  description: string;
  serviceFee: number;
  categories: string[];
  minimumOrderAmount: number;
  freeDelivery: boolean;
  deliveryTime: string;
  openingHour: string;
  closingHour: string;
  image: string;
  url: string;
  locations: RestaurantLocation[];
  products: Product[];
}

export const restaurants = restaurantsData as Record<string, Restaurant>;

export const getRestaurantById = (id: string): Restaurant | undefined => restaurants[id];

export const getRestaurantsByAddress = (addressId: string): Restaurant[] =>
  Object.values(restaurants).filter((restaurant) =>
    restaurant.locations.some((location) => location.addressId === addressId),
  );

export const getFreeDeliveryRestaurants = (addressId: string): Restaurant[] =>
  getRestaurantsByAddress(addressId).filter((restaurant) => restaurant.freeDelivery);

export const getRestaurantsByCategory = (addressId: string, category: string): Restaurant[] =>
  getRestaurantsByAddress(addressId).filter((restaurant) => restaurant.categories.includes(category));

const normalize = (text: string): string => text.toLocaleLowerCase('tr-TR').trim();

const categoryMatchesQuery = (categories: string[], normalizedQuery: string): boolean =>
  categories.some((category) => {
    const normalizedCategory = normalize(category);
    return normalizedCategory.includes(normalizedQuery) || normalizedQuery.includes(normalizedCategory);
  });

const productMatchesQuery = (product: Product, normalizedQuery: string): boolean =>
  normalize(product.name).includes(normalizedQuery) ||
  normalize(product.description).includes(normalizedQuery) ||
  categoryMatchesQuery(product.categories ?? [], normalizedQuery);

const restaurantMatchesQuery = (restaurant: Restaurant, normalizedQuery: string): boolean =>
  normalize(restaurant.title).includes(normalizedQuery) ||
  normalize(restaurant.description).includes(normalizedQuery) ||
  categoryMatchesQuery(restaurant.categories, normalizedQuery) ||
  restaurant.products.some((product) => productMatchesQuery(product, normalizedQuery));

export const filterRestaurantsByQuery = (restaurantsList: Restaurant[], query: string): Restaurant[] => {
  const normalizedQuery = normalize(query);
  if (!normalizedQuery) return restaurantsList;
  return restaurantsList.filter((restaurant) => restaurantMatchesQuery(restaurant, normalizedQuery));
};

export const getMatchingProducts = (restaurant: Restaurant, query: string): Product[] => {
  const normalizedQuery = normalize(query);
  if (!normalizedQuery) return [];
  return restaurant.products.filter((product) => productMatchesQuery(product, normalizedQuery));
};
