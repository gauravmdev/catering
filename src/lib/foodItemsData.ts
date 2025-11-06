import { FoodItem } from './types';

// Helper function to map vendor name to vendor ID
const getVendorId = (vendorName: string): string => {
  const vendorMap: Record<string, string> = {
    'Vendor A': '4',
    'Vendor B': '5',
    'Vendor C': '6',
    'Vendor D': '7',
  };
  return vendorMap[vendorName] || '4';
};

// Helper function to infer diet type from name and category
const getDietType = (name: string, categoryId: string): 'veg' | 'non-veg' => {
  const nameLower = name.toLowerCase();
  const nonVegKeywords = ['chicken', 'mutton', 'lamb', 'beef', 'pork', 'fish', 'prawn', 'shrimp', 'seafood', 'meat', 'egg', 'mutton'];
  const vegKeywords = ['veg', 'vegetable', 'paneer', 'tofu', 'dal', 'sabzi'];
  
  if (nonVegKeywords.some(keyword => nameLower.includes(keyword))) return 'non-veg';
  if (vegKeywords.some(keyword => nameLower.includes(keyword))) return 'veg';
  if (categoryId === '5' || categoryId === '12') return categoryId === '12' ? 'non-veg' : 'veg';
  if (categoryId === '6' || categoryId === '7' || categoryId === '8' || categoryId === '9') return 'non-veg';
  return 'veg';
};

// Helper to calculate cost price (70% of retail)
const calculateCostPrice = (retailPrice: number): number => {
  return Math.round(retailPrice * 0.7 * 100) / 100;
};

export const initializeFoodItems = (): Omit<FoodItem, 'id' | 'createdAt'>[] => {
  const items: Omit<FoodItem, 'id' | 'createdAt'>[] = [];

  // Breads & Basics (Category 1)
  items.push(
    { name: 'Plain Naan', description: 'Soft, leavened flatbread', categoryId: '1', diet: 'veg', vendorPrices: [{ vendorId: getVendorId('Vendor A'), costPrice: calculateCostPrice(2.00), retailPrice: 2.00 }] },
    { name: 'Butter Naan', description: 'Naan brushed with butter', categoryId: '1', diet: 'veg', vendorPrices: [{ vendorId: getVendorId('Vendor A'), costPrice: calculateCostPrice(3.00), retailPrice: 3.00 }] },
    { name: 'Garlic Naan', description: 'Naan with garlic and herbs', categoryId: '1', diet: 'veg', vendorPrices: [{ vendorId: getVendorId('Vendor A'), costPrice: calculateCostPrice(4.00), retailPrice: 4.00 }] },
    { name: 'Roti', description: 'Whole wheat flatbread', categoryId: '1', diet: 'veg', vendorPrices: [{ vendorId: getVendorId('Vendor A'), costPrice: calculateCostPrice(1.50), retailPrice: 1.50 }] },
    { name: 'Paratha', description: 'Layered flatbread', categoryId: '1', diet: 'veg', vendorPrices: [{ vendorId: getVendorId('Vendor A'), costPrice: calculateCostPrice(3.50), retailPrice: 3.50 }] },
    { name: 'Kulcha', description: 'Leavened flatbread', categoryId: '1', diet: 'veg', vendorPrices: [{ vendorId: getVendorId('Vendor A'), costPrice: calculateCostPrice(3.00), retailPrice: 3.00 }] },
    { name: 'Tandoori Roti', description: 'Tandoor-baked roti', categoryId: '1', diet: 'veg', vendorPrices: [{ vendorId: getVendorId('Vendor A'), costPrice: calculateCostPrice(2.00), retailPrice: 2.00 }] },
    { name: 'Lachha Paratha', description: 'Layered crispy paratha', categoryId: '1', diet: 'veg', vendorPrices: [{ vendorId: getVendorId('Vendor A'), costPrice: calculateCostPrice(4.00), retailPrice: 4.00 }] },
    { name: 'Missi Roti', description: 'Spiced gram flour roti', categoryId: '1', diet: 'veg', vendorPrices: [{ vendorId: getVendorId('Vendor A'), costPrice: calculateCostPrice(2.50), retailPrice: 2.50 }] },
    { name: 'Rumali Roti', description: 'Thin handkerchief bread', categoryId: '1', diet: 'veg', vendorPrices: [{ vendorId: getVendorId('Vendor A'), costPrice: calculateCostPrice(2.50), retailPrice: 2.50 }] },
    { name: 'Phulka', description: 'Puffed bread', categoryId: '1', diet: 'veg', vendorPrices: [{ vendorId: getVendorId('Vendor A'), costPrice: calculateCostPrice(1.50), retailPrice: 1.50 }] },
    { name: 'Bhatura', description: 'Deep-fried leavened bread', categoryId: '1', diet: 'veg', vendorPrices: [{ vendorId: getVendorId('Vendor A'), costPrice: calculateCostPrice(3.50), retailPrice: 3.50 }] },
    { name: 'Poori', description: 'Deep-fried bread', categoryId: '1', diet: 'veg', vendorPrices: [{ vendorId: getVendorId('Vendor A'), costPrice: calculateCostPrice(2.50), retailPrice: 2.50 }] },
  );

  // Salads & Accompaniments (Category 2)
  items.push(
    { name: 'Garden Salad', description: 'Fresh mixed greens with vinaigrette', categoryId: '2', diet: 'veg', vendorPrices: [{ vendorId: getVendorId('Vendor B'), costPrice: calculateCostPrice(8.50), retailPrice: 8.50 }] },
    { name: 'Caesar Salad', description: 'Romaine lettuce with Caesar dressing', categoryId: '2', diet: 'veg', vendorPrices: [{ vendorId: getVendorId('Vendor B'), costPrice: calculateCostPrice(10.00), retailPrice: 10.00 }] },
    { name: 'Mixed Vegetable Salad', description: 'Fresh vegetables with lemon dressing', categoryId: '2', diet: 'veg', vendorPrices: [{ vendorId: getVendorId('Vendor B'), costPrice: calculateCostPrice(7.00), retailPrice: 7.00 }] },
    { name: 'Kachumber', description: 'Fresh cucumber, tomato, and onion salad', categoryId: '2', diet: 'veg', vendorPrices: [{ vendorId: getVendorId('Vendor B'), costPrice: calculateCostPrice(6.00), retailPrice: 6.00 }] },
    { name: 'Raita', description: 'Yogurt with cucumber and spices', categoryId: '2', diet: 'veg', vendorPrices: [{ vendorId: getVendorId('Vendor B'), costPrice: calculateCostPrice(5.00), retailPrice: 5.00 }] },
    { name: 'Biryani Raita', description: 'Yogurt with mint and spices', categoryId: '2', diet: 'veg', vendorPrices: [{ vendorId: getVendorId('Vendor B'), costPrice: calculateCostPrice(5.50), retailPrice: 5.50 }] },
    { name: 'Onion Rings', description: 'Crispy fried onion rings', categoryId: '2', diet: 'veg', vendorPrices: [{ vendorId: getVendorId('Vendor B'), costPrice: calculateCostPrice(6.50), retailPrice: 6.50 }] },
    { name: 'Pickles', description: 'Assorted Indian pickles', categoryId: '2', diet: 'veg', vendorPrices: [{ vendorId: getVendorId('Vendor B'), costPrice: calculateCostPrice(4.00), retailPrice: 4.00 }] },
    { name: 'Papad', description: 'Crispy lentil crackers', categoryId: '2', diet: 'veg', vendorPrices: [{ vendorId: getVendorId('Vendor B'), costPrice: calculateCostPrice(3.00), retailPrice: 3.00 }] },
    { name: 'Green Chutney', description: 'Fresh coriander and mint chutney', categoryId: '2', diet: 'veg', vendorPrices: [{ vendorId: getVendorId('Vendor B'), costPrice: calculateCostPrice(3.50), retailPrice: 3.50 }] },
    { name: 'Tamarind Chutney', description: 'Sweet and tangy tamarind chutney', categoryId: '2', diet: 'veg', vendorPrices: [{ vendorId: getVendorId('Vendor B'), costPrice: calculateCostPrice(3.50), retailPrice: 3.50 }] },
  );

  // Snacks & Quick Bites (Category 3)
  items.push(
    { name: 'Samosa (Veg)', description: 'Crispy pastry with spiced potato filling', categoryId: '3', diet: 'veg', vendorPrices: [{ vendorId: getVendorId('Vendor C'), costPrice: calculateCostPrice(3.00), retailPrice: 3.00 }] },
    { name: 'Samosa (Non-Veg)', description: 'Crispy pastry with spiced meat filling', categoryId: '3', diet: 'non-veg', vendorPrices: [{ vendorId: getVendorId('Vendor C'), costPrice: calculateCostPrice(4.00), retailPrice: 4.00 }] },
    { name: 'Pakora', description: 'Mixed vegetable fritters', categoryId: '3', diet: 'veg', vendorPrices: [{ vendorId: getVendorId('Vendor C'), costPrice: calculateCostPrice(4.50), retailPrice: 4.50 }] },
    { name: 'Onion Pakora', description: 'Crispy onion fritters', categoryId: '3', diet: 'veg', vendorPrices: [{ vendorId: getVendorId('Vendor C'), costPrice: calculateCostPrice(4.00), retailPrice: 4.00 }] },
    { name: 'Paneer Pakora', description: 'Cottage cheese fritters', categoryId: '3', diet: 'veg', vendorPrices: [{ vendorId: getVendorId('Vendor C'), costPrice: calculateCostPrice(5.00), retailPrice: 5.00 }] },
    { name: 'Bhajiya', description: 'Spiced gram flour fritters', categoryId: '3', diet: 'veg', vendorPrices: [{ vendorId: getVendorId('Vendor C'), costPrice: calculateCostPrice(4.00), retailPrice: 4.00 }] },
    { name: 'Vada Pav', description: 'Spiced potato patty in bun', categoryId: '3', diet: 'veg', vendorPrices: [{ vendorId: getVendorId('Vendor C'), costPrice: calculateCostPrice(3.50), retailPrice: 3.50 }] },
    { name: 'Pav Bhaji', description: 'Spiced vegetable curry with bread', categoryId: '3', diet: 'veg', vendorPrices: [{ vendorId: getVendorId('Vendor C'), costPrice: calculateCostPrice(6.00), retailPrice: 6.00 }] },
    { name: 'Bhel Puri', description: 'Puffed rice with tangy chutneys', categoryId: '3', diet: 'veg', vendorPrices: [{ vendorId: getVendorId('Vendor C'), costPrice: calculateCostPrice(5.00), retailPrice: 5.00 }] },
    { name: 'Sev Puri', description: 'Crispy puris with toppings', categoryId: '3', diet: 'veg', vendorPrices: [{ vendorId: getVendorId('Vendor C'), costPrice: calculateCostPrice(5.50), retailPrice: 5.50 }] },
    { name: 'Dahi Puri', description: 'Crispy puris with yogurt', categoryId: '3', diet: 'veg', vendorPrices: [{ vendorId: getVendorId('Vendor C'), costPrice: calculateCostPrice(5.50), retailPrice: 5.50 }] },
    { name: 'Chaat', description: 'Assorted savory snacks', categoryId: '3', diet: 'veg', vendorPrices: [{ vendorId: getVendorId('Vendor C'), costPrice: calculateCostPrice(6.00), retailPrice: 6.00 }] },
    { name: 'Papdi Chaat', description: 'Crispy wafers with chutneys', categoryId: '3', diet: 'veg', vendorPrices: [{ vendorId: getVendorId('Vendor C'), costPrice: calculateCostPrice(6.00), retailPrice: 6.00 }] },
    { name: 'Aloo Tikki', description: 'Spiced potato patties', categoryId: '3', diet: 'veg', vendorPrices: [{ vendorId: getVendorId('Vendor C'), costPrice: calculateCostPrice(4.50), retailPrice: 4.50 }] },
    { name: 'Cutlet', description: 'Crispy vegetable cutlets', categoryId: '3', diet: 'veg', vendorPrices: [{ vendorId: getVendorId('Vendor C'), costPrice: calculateCostPrice(5.00), retailPrice: 5.00 }] },
  );

  // Soups (Category 4)
  items.push(
    { name: 'Tomato Soup', description: 'Creamy tomato soup', categoryId: '4', diet: 'veg', vendorPrices: [{ vendorId: getVendorId('Vendor C'), costPrice: calculateCostPrice(6.00), retailPrice: 6.00 }] },
    { name: 'Vegetable Soup', description: 'Mixed vegetable soup', categoryId: '4', diet: 'veg', vendorPrices: [{ vendorId: getVendorId('Vendor C'), costPrice: calculateCostPrice(6.50), retailPrice: 6.50 }] },
    { name: 'Sweet Corn Soup', description: 'Creamy sweet corn soup', categoryId: '4', diet: 'veg', vendorPrices: [{ vendorId: getVendorId('Vendor C'), costPrice: calculateCostPrice(6.50), retailPrice: 6.50 }] },
    { name: 'Hot & Sour Soup', description: 'Spicy and tangy soup', categoryId: '4', diet: 'veg', vendorPrices: [{ vendorId: getVendorId('Vendor C'), costPrice: calculateCostPrice(7.00), retailPrice: 7.00 }] },
    { name: 'Manchow Soup', description: 'Spiced vegetable soup', categoryId: '4', diet: 'veg', vendorPrices: [{ vendorId: getVendorId('Vendor C'), costPrice: calculateCostPrice(7.00), retailPrice: 7.00 }] },
    { name: 'Chicken Soup', description: 'Clear chicken soup', categoryId: '4', diet: 'non-veg', vendorPrices: [{ vendorId: getVendorId('Vendor C'), costPrice: calculateCostPrice(8.00), retailPrice: 8.00 }] },
    { name: 'Mutton Soup', description: 'Hearty mutton soup', categoryId: '4', diet: 'non-veg', vendorPrices: [{ vendorId: getVendorId('Vendor C'), costPrice: calculateCostPrice(9.00), retailPrice: 9.00 }] },
    { name: 'Chicken Hot & Sour Soup', description: 'Spicy chicken soup', categoryId: '4', diet: 'non-veg', vendorPrices: [{ vendorId: getVendorId('Vendor C'), costPrice: calculateCostPrice(8.50), retailPrice: 8.50 }] },
    { name: 'Dal Shorba', description: 'Lentil soup', categoryId: '4', diet: 'veg', vendorPrices: [{ vendorId: getVendorId('Vendor C'), costPrice: calculateCostPrice(5.50), retailPrice: 5.50 }] },
  );

  // Starters - Vegetarian (Category 5)
  items.push(
    { name: 'Paneer Tikka', description: 'Grilled cottage cheese with spices', categoryId: '5', diet: 'veg', vendorPrices: [{ vendorId: getVendorId('Vendor C'), costPrice: calculateCostPrice(12.00), retailPrice: 12.00 }] },
    { name: 'Hara Bhara Kebab', description: 'Green vegetable kebabs', categoryId: '5', diet: 'veg', vendorPrices: [{ vendorId: getVendorId('Vendor C'), costPrice: calculateCostPrice(10.00), retailPrice: 10.00 }] },
    { name: 'Aloo Tikka', description: 'Spiced potato kebabs', categoryId: '5', diet: 'veg', vendorPrices: [{ vendorId: getVendorId('Vendor C'), costPrice: calculateCostPrice(9.00), retailPrice: 9.00 }] },
    { name: 'Mushroom Tikka', description: 'Grilled mushroom skewers', categoryId: '5', diet: 'veg', vendorPrices: [{ vendorId: getVendorId('Vendor C'), costPrice: calculateCostPrice(11.00), retailPrice: 11.00 }] },
    { name: 'Corn Tikka', description: 'Spiced corn kebabs', categoryId: '5', diet: 'veg', vendorPrices: [{ vendorId: getVendorId('Vendor C'), costPrice: calculateCostPrice(9.50), retailPrice: 9.50 }] },
    { name: 'Paneer Seekh Kebab', description: 'Cottage cheese skewers', categoryId: '5', diet: 'veg', vendorPrices: [{ vendorId: getVendorId('Vendor C'), costPrice: calculateCostPrice(12.50), retailPrice: 12.50 }] },
    { name: 'Vegetable Seekh Kebab', description: 'Mixed vegetable skewers', categoryId: '5', diet: 'veg', vendorPrices: [{ vendorId: getVendorId('Vendor C'), costPrice: calculateCostPrice(10.50), retailPrice: 10.50 }] },
    { name: 'Tandoori Paneer', description: 'Tandoor-grilled cottage cheese', categoryId: '5', diet: 'veg', vendorPrices: [{ vendorId: getVendorId('Vendor C'), costPrice: calculateCostPrice(11.50), retailPrice: 11.50 }] },
    { name: 'Bhutte Ka Kees', description: 'Spiced corn preparation', categoryId: '5', diet: 'veg', vendorPrices: [{ vendorId: getVendorId('Vendor C'), costPrice: calculateCostPrice(8.00), retailPrice: 8.00 }] },
    { name: 'Dahi Kebab', description: 'Yogurt-based kebabs', categoryId: '5', diet: 'veg', vendorPrices: [{ vendorId: getVendorId('Vendor C'), costPrice: calculateCostPrice(10.00), retailPrice: 10.00 }] },
    { name: 'Malai Kofta', description: 'Creamy vegetable dumplings', categoryId: '5', diet: 'veg', vendorPrices: [{ vendorId: getVendorId('Vendor C'), costPrice: calculateCostPrice(13.00), retailPrice: 13.00 }] },
    { name: 'Vegetable Manchurian', description: 'Indo-Chinese vegetable balls', categoryId: '5', diet: 'veg', vendorPrices: [{ vendorId: getVendorId('Vendor C'), costPrice: calculateCostPrice(11.00), retailPrice: 11.00 }] },
  );

  // Starters - Non-Vegetarian (Category 6)
  items.push(
    { name: 'Chicken 65', description: 'Spicy fried chicken appetizer', categoryId: '6', diet: 'non-veg', vendorPrices: [{ vendorId: getVendorId('Vendor C'), costPrice: calculateCostPrice(14.00), retailPrice: 14.00 }] },
    { name: 'Chicken Tikka', description: 'Tandoor-grilled chicken pieces', categoryId: '6', diet: 'non-veg', vendorPrices: [{ vendorId: getVendorId('Vendor C'), costPrice: calculateCostPrice(15.00), retailPrice: 15.00 }] },
    { name: 'Tandoori Chicken', description: 'Yogurt-marinated grilled chicken', categoryId: '6', diet: 'non-veg', vendorPrices: [{ vendorId: getVendorId('Vendor C'), costPrice: calculateCostPrice(16.00), retailPrice: 16.00 }] },
    { name: 'Chicken Seekh Kebab', description: 'Spiced minced chicken skewers', categoryId: '6', diet: 'non-veg', vendorPrices: [{ vendorId: getVendorId('Vendor C'), costPrice: calculateCostPrice(15.50), retailPrice: 15.50 }] },
    { name: 'Mutton Seekh Kebab', description: 'Spiced minced mutton skewers', categoryId: '6', diet: 'non-veg', vendorPrices: [{ vendorId: getVendorId('Vendor C'), costPrice: calculateCostPrice(18.00), retailPrice: 18.00 }] },
    { name: 'Fish Tikka', description: 'Grilled fish pieces', categoryId: '6', diet: 'non-veg', vendorPrices: [{ vendorId: getVendorId('Vendor C'), costPrice: calculateCostPrice(17.00), retailPrice: 17.00 }] },
    { name: 'Prawn Tikka', description: 'Grilled prawn skewers', categoryId: '6', diet: 'non-veg', vendorPrices: [{ vendorId: getVendorId('Vendor C'), costPrice: calculateCostPrice(19.00), retailPrice: 19.00 }] },
    { name: 'Chicken Wings', description: 'Spicy chicken wings', categoryId: '6', diet: 'non-veg', vendorPrices: [{ vendorId: getVendorId('Vendor C'), costPrice: calculateCostPrice(14.50), retailPrice: 14.50 }] },
    { name: 'Chicken Lollipop', description: 'Spiced chicken drumettes', categoryId: '6', diet: 'non-veg', vendorPrices: [{ vendorId: getVendorId('Vendor C'), costPrice: calculateCostPrice(15.00), retailPrice: 15.00 }] },
    { name: 'Mutton Chops', description: 'Grilled mutton chops', categoryId: '6', diet: 'non-veg', vendorPrices: [{ vendorId: getVendorId('Vendor C'), costPrice: calculateCostPrice(20.00), retailPrice: 20.00 }] },
    { name: 'Chicken Manchurian', description: 'Indo-Chinese chicken preparation', categoryId: '6', diet: 'non-veg', vendorPrices: [{ vendorId: getVendorId('Vendor C'), costPrice: calculateCostPrice(14.50), retailPrice: 14.50 }] },
    { name: 'Chicken Spring Roll', description: 'Crispy chicken spring rolls', categoryId: '6', diet: 'non-veg', vendorPrices: [{ vendorId: getVendorId('Vendor C'), costPrice: calculateCostPrice(13.00), retailPrice: 13.00 }] },
  );

  // Main Course - Chicken (Category 7)
  items.push(
    { name: 'Butter Chicken', description: 'Creamy tomato-based chicken curry', categoryId: '7', diet: 'non-veg', vendorPrices: [{ vendorId: getVendorId('Vendor C'), costPrice: calculateCostPrice(18.00), retailPrice: 18.00 }] },
    { name: 'Chicken Curry', description: 'Traditional chicken curry', categoryId: '7', diet: 'non-veg', vendorPrices: [{ vendorId: getVendorId('Vendor C'), costPrice: calculateCostPrice(16.00), retailPrice: 16.00 }] },
    { name: 'Chicken Tikka Masala', description: 'Creamy chicken tikka curry', categoryId: '7', diet: 'non-veg', vendorPrices: [{ vendorId: getVendorId('Vendor C'), costPrice: calculateCostPrice(19.00), retailPrice: 19.00 }] },
    { name: 'Chicken Korma', description: 'Mild creamy chicken curry', categoryId: '7', diet: 'non-veg', vendorPrices: [{ vendorId: getVendorId('Vendor C'), costPrice: calculateCostPrice(18.50), retailPrice: 18.50 }] },
    { name: 'Chicken Do Pyaza', description: 'Chicken with double onions', categoryId: '7', diet: 'non-veg', vendorPrices: [{ vendorId: getVendorId('Vendor C'), costPrice: calculateCostPrice(17.00), retailPrice: 17.00 }] },
    { name: 'Chicken Kadai', description: 'Spicy chicken curry', categoryId: '7', diet: 'non-veg', vendorPrices: [{ vendorId: getVendorId('Vendor C'), costPrice: calculateCostPrice(17.50), retailPrice: 17.50 }] },
    { name: 'Chicken Vindaloo', description: 'Hot and sour chicken curry', categoryId: '7', diet: 'non-veg', vendorPrices: [{ vendorId: getVendorId('Vendor C'), costPrice: calculateCostPrice(18.00), retailPrice: 18.00 }] },
    { name: 'Chicken Biryani', description: 'Aromatic basmati rice with tender chicken', categoryId: '7', diet: 'non-veg', vendorPrices: [{ vendorId: getVendorId('Vendor C'), costPrice: calculateCostPrice(20.00), retailPrice: 20.00 }] },
    { name: 'Chicken Handi', description: 'Chicken cooked in clay pot', categoryId: '7', diet: 'non-veg', vendorPrices: [{ vendorId: getVendorId('Vendor C'), costPrice: calculateCostPrice(19.50), retailPrice: 19.50 }] },
    { name: 'Chicken Afghani', description: 'Creamy chicken preparation', categoryId: '7', diet: 'non-veg', vendorPrices: [{ vendorId: getVendorId('Vendor C'), costPrice: calculateCostPrice(19.00), retailPrice: 19.00 }] },
    { name: 'Chicken Hyderabadi', description: 'Spicy Hyderabadi chicken', categoryId: '7', diet: 'non-veg', vendorPrices: [{ vendorId: getVendorId('Vendor C'), costPrice: calculateCostPrice(18.50), retailPrice: 18.50 }] },
    { name: 'Chicken Chettinad', description: 'Spicy South Indian chicken', categoryId: '7', diet: 'non-veg', vendorPrices: [{ vendorId: getVendorId('Vendor C'), costPrice: calculateCostPrice(18.00), retailPrice: 18.00 }] },
    { name: 'Chicken Kolhapuri', description: 'Hot Kolhapuri chicken', categoryId: '7', diet: 'non-veg', vendorPrices: [{ vendorId: getVendorId('Vendor C'), costPrice: calculateCostPrice(17.50), retailPrice: 17.50 }] },
    { name: 'Chicken Rogan Josh', description: 'Aromatic chicken curry', categoryId: '7', diet: 'non-veg', vendorPrices: [{ vendorId: getVendorId('Vendor C'), costPrice: calculateCostPrice(19.00), retailPrice: 19.00 }] },
    { name: 'Chicken Shahi', description: 'Royal chicken curry', categoryId: '7', diet: 'non-veg', vendorPrices: [{ vendorId: getVendorId('Vendor C'), costPrice: calculateCostPrice(19.50), retailPrice: 19.50 }] },
  );

  // Main Course - Mutton (Category 8)
  items.push(
    { name: 'Mutton Curry', description: 'Traditional mutton curry', categoryId: '8', diet: 'non-veg', vendorPrices: [{ vendorId: getVendorId('Vendor C'), costPrice: calculateCostPrice(22.00), retailPrice: 22.00 }] },
    { name: 'Mutton Biryani', description: 'Premium mutton pieces with fragrant rice', categoryId: '8', diet: 'non-veg', vendorPrices: [{ vendorId: getVendorId('Vendor C'), costPrice: calculateCostPrice(25.00), retailPrice: 25.00 }] },
    { name: 'Mutton Korma', description: 'Mild creamy mutton curry', categoryId: '8', diet: 'non-veg', vendorPrices: [{ vendorId: getVendorId('Vendor C'), costPrice: calculateCostPrice(23.00), retailPrice: 23.00 }] },
    { name: 'Mutton Rogan Josh', description: 'Aromatic mutton curry', categoryId: '8', diet: 'non-veg', vendorPrices: [{ vendorId: getVendorId('Vendor C'), costPrice: calculateCostPrice(24.00), retailPrice: 24.00 }] },
    { name: 'Mutton Kadai', description: 'Spicy mutton curry', categoryId: '8', diet: 'non-veg', vendorPrices: [{ vendorId: getVendorId('Vendor C'), costPrice: calculateCostPrice(22.50), retailPrice: 22.50 }] },
    { name: 'Mutton Do Pyaza', description: 'Mutton with double onions', categoryId: '8', diet: 'non-veg', vendorPrices: [{ vendorId: getVendorId('Vendor C'), costPrice: calculateCostPrice(23.50), retailPrice: 23.50 }] },
    { name: 'Mutton Handi', description: 'Mutton cooked in clay pot', categoryId: '8', diet: 'non-veg', vendorPrices: [{ vendorId: getVendorId('Vendor C'), costPrice: calculateCostPrice(24.50), retailPrice: 24.50 }] },
    { name: 'Mutton Keema', description: 'Spiced minced mutton', categoryId: '8', diet: 'non-veg', vendorPrices: [{ vendorId: getVendorId('Vendor C'), costPrice: calculateCostPrice(21.00), retailPrice: 21.00 }] },
    { name: 'Mutton Nihari', description: 'Slow-cooked mutton stew', categoryId: '8', diet: 'non-veg', vendorPrices: [{ vendorId: getVendorId('Vendor C'), costPrice: calculateCostPrice(24.00), retailPrice: 24.00 }] },
    { name: 'Mutton Kosha', description: 'Slow-cooked mutton curry', categoryId: '8', diet: 'non-veg', vendorPrices: [{ vendorId: getVendorId('Vendor C'), costPrice: calculateCostPrice(23.00), retailPrice: 23.00 }] },
  );

  // Main Course - Seafood (Category 9)
  items.push(
    { name: 'Fish Curry', description: 'Traditional fish curry', categoryId: '9', diet: 'non-veg', vendorPrices: [{ vendorId: getVendorId('Vendor C'), costPrice: calculateCostPrice(20.00), retailPrice: 20.00 }] },
    { name: 'Prawn Curry', description: 'Spicy prawn curry', categoryId: '9', diet: 'non-veg', vendorPrices: [{ vendorId: getVendorId('Vendor C'), costPrice: calculateCostPrice(22.00), retailPrice: 22.00 }] },
    { name: 'Fish Fry', description: 'Spiced fried fish', categoryId: '9', diet: 'non-veg', vendorPrices: [{ vendorId: getVendorId('Vendor C'), costPrice: calculateCostPrice(19.00), retailPrice: 19.00 }] },
    { name: 'Prawn Masala', description: 'Spicy prawn preparation', categoryId: '9', diet: 'non-veg', vendorPrices: [{ vendorId: getVendorId('Vendor C'), costPrice: calculateCostPrice(23.00), retailPrice: 23.00 }] },
    { name: 'Fish Biryani', description: 'Aromatic fish biryani', categoryId: '9', diet: 'non-veg', vendorPrices: [{ vendorId: getVendorId('Vendor C'), costPrice: calculateCostPrice(21.00), retailPrice: 21.00 }] },
    { name: 'Crab Curry', description: 'Spicy crab curry', categoryId: '9', diet: 'non-veg', vendorPrices: [{ vendorId: getVendorId('Vendor C'), costPrice: calculateCostPrice(25.00), retailPrice: 25.00 }] },
    { name: 'Lobster Curry', description: 'Premium lobster curry', categoryId: '9', diet: 'non-veg', vendorPrices: [{ vendorId: getVendorId('Vendor C'), costPrice: calculateCostPrice(35.00), retailPrice: 35.00 }] },
    { name: 'Fish Korma', description: 'Creamy fish curry', categoryId: '9', diet: 'non-veg', vendorPrices: [{ vendorId: getVendorId('Vendor C'), costPrice: calculateCostPrice(20.50), retailPrice: 20.50 }] },
    { name: 'Prawn Biryani', description: 'Aromatic prawn biryani', categoryId: '9', diet: 'non-veg', vendorPrices: [{ vendorId: getVendorId('Vendor C'), costPrice: calculateCostPrice(23.00), retailPrice: 23.00 }] },
  );

  // Rice & Noodles (Category 10)
  items.push(
    { name: 'Veg Biryani', description: 'Mixed vegetables in aromatic rice', categoryId: '10', diet: 'veg', vendorPrices: [{ vendorId: getVendorId('Vendor C'), costPrice: calculateCostPrice(12.00), retailPrice: 12.00 }] },
    { name: 'Jeera Rice', description: 'Cumin-flavored rice', categoryId: '10', diet: 'veg', vendorPrices: [{ vendorId: getVendorId('Vendor C'), costPrice: calculateCostPrice(5.00), retailPrice: 5.00 }] },
    { name: 'Basmati Rice', description: 'Plain basmati rice', categoryId: '10', diet: 'veg', vendorPrices: [{ vendorId: getVendorId('Vendor C'), costPrice: calculateCostPrice(4.00), retailPrice: 4.00 }] },
    { name: 'Fried Rice', description: 'Spiced vegetable fried rice', categoryId: '10', diet: 'veg', vendorPrices: [{ vendorId: getVendorId('Vendor C'), costPrice: calculateCostPrice(8.00), retailPrice: 8.00 }] },
    { name: 'Chicken Fried Rice', description: 'Chicken with fried rice', categoryId: '10', diet: 'non-veg', vendorPrices: [{ vendorId: getVendorId('Vendor C'), costPrice: calculateCostPrice(10.00), retailPrice: 10.00 }] },
    { name: 'Egg Fried Rice', description: 'Egg with fried rice', categoryId: '10', diet: 'non-veg', vendorPrices: [{ vendorId: getVendorId('Vendor C'), costPrice: calculateCostPrice(9.00), retailPrice: 9.00 }] },
    { name: 'Veg Noodles', description: 'Vegetable noodles', categoryId: '10', diet: 'veg', vendorPrices: [{ vendorId: getVendorId('Vendor C'), costPrice: calculateCostPrice(8.00), retailPrice: 8.00 }] },
    { name: 'Chicken Noodles', description: 'Chicken noodles', categoryId: '10', diet: 'non-veg', vendorPrices: [{ vendorId: getVendorId('Vendor C'), costPrice: calculateCostPrice(10.00), retailPrice: 10.00 }] },
    { name: 'Egg Noodles', description: 'Egg noodles', categoryId: '10', diet: 'non-veg', vendorPrices: [{ vendorId: getVendorId('Vendor C'), costPrice: calculateCostPrice(9.00), retailPrice: 9.00 }] },
    { name: 'Pulao', description: 'Spiced rice preparation', categoryId: '10', diet: 'veg', vendorPrices: [{ vendorId: getVendorId('Vendor C'), costPrice: calculateCostPrice(7.00), retailPrice: 7.00 }] },
    { name: 'Chicken Pulao', description: 'Chicken pulao', categoryId: '10', diet: 'non-veg', vendorPrices: [{ vendorId: getVendorId('Vendor C'), costPrice: calculateCostPrice(11.00), retailPrice: 11.00 }] },
    { name: 'Mutton Pulao', description: 'Mutton pulao', categoryId: '10', diet: 'non-veg', vendorPrices: [{ vendorId: getVendorId('Vendor C'), costPrice: calculateCostPrice(13.00), retailPrice: 13.00 }] },
  );

  // Arabic Specialties (Category 11)
  items.push(
    { name: 'Shawarma', description: 'Spiced meat wrap', categoryId: '11', diet: 'non-veg', vendorPrices: [{ vendorId: getVendorId('Vendor C'), costPrice: calculateCostPrice(12.00), retailPrice: 12.00 }] },
    { name: 'Chicken Shawarma', description: 'Chicken shawarma wrap', categoryId: '11', diet: 'non-veg', vendorPrices: [{ vendorId: getVendorId('Vendor C'), costPrice: calculateCostPrice(13.00), retailPrice: 13.00 }] },
    { name: 'Lamb Shawarma', description: 'Lamb shawarma wrap', categoryId: '11', diet: 'non-veg', vendorPrices: [{ vendorId: getVendorId('Vendor C'), costPrice: calculateCostPrice(15.00), retailPrice: 15.00 }] },
    { name: 'Hummus', description: 'Chickpea dip', categoryId: '11', diet: 'veg', vendorPrices: [{ vendorId: getVendorId('Vendor C'), costPrice: calculateCostPrice(8.00), retailPrice: 8.00 }] },
    { name: 'Falafel', description: 'Deep-fried chickpea balls', categoryId: '11', diet: 'veg', vendorPrices: [{ vendorId: getVendorId('Vendor C'), costPrice: calculateCostPrice(9.00), retailPrice: 9.00 }] },
    { name: 'Baba Ganoush', description: 'Grilled eggplant dip', categoryId: '11', diet: 'veg', vendorPrices: [{ vendorId: getVendorId('Vendor C'), costPrice: calculateCostPrice(8.50), retailPrice: 8.50 }] },
    { name: 'Kebab Platter', description: 'Mixed kebab assortment', categoryId: '11', diet: 'non-veg', vendorPrices: [{ vendorId: getVendorId('Vendor C'), costPrice: calculateCostPrice(22.00), retailPrice: 22.00 }] },
    { name: 'Mandi Rice', description: 'Traditional Yemeni rice with meat', categoryId: '11', diet: 'non-veg', vendorPrices: [{ vendorId: getVendorId('Vendor C'), costPrice: calculateCostPrice(18.00), retailPrice: 18.00 }] },
    { name: 'Kabsa', description: 'Spiced rice with meat', categoryId: '11', diet: 'non-veg', vendorPrices: [{ vendorId: getVendorId('Vendor C'), costPrice: calculateCostPrice(19.00), retailPrice: 19.00 }] },
    { name: 'Mutton Mandi', description: 'Mutton with mandi rice', categoryId: '11', diet: 'non-veg', vendorPrices: [{ vendorId: getVendorId('Vendor C'), costPrice: calculateCostPrice(24.00), retailPrice: 24.00 }] },
    { name: 'Chicken Mandi', description: 'Chicken with mandi rice', categoryId: '11', diet: 'non-veg', vendorPrices: [{ vendorId: getVendorId('Vendor C'), costPrice: calculateCostPrice(20.00), retailPrice: 20.00 }] },
    { name: 'Arabic Rice', description: 'Spiced Arabic-style rice', categoryId: '11', diet: 'veg', vendorPrices: [{ vendorId: getVendorId('Vendor C'), costPrice: calculateCostPrice(7.00), retailPrice: 7.00 }] },
  );

  // Egg Items (Category 12)
  items.push(
    { name: 'Egg Curry', description: 'Spiced egg curry', categoryId: '12', diet: 'non-veg', vendorPrices: [{ vendorId: getVendorId('Vendor C'), costPrice: calculateCostPrice(8.00), retailPrice: 8.00 }] },
    { name: 'Boiled Egg', description: 'Hard-boiled egg', categoryId: '12', diet: 'non-veg', vendorPrices: [{ vendorId: getVendorId('Vendor C'), costPrice: calculateCostPrice(2.00), retailPrice: 2.00 }] },
    { name: 'Omelette', description: 'Plain omelette', categoryId: '12', diet: 'non-veg', vendorPrices: [{ vendorId: getVendorId('Vendor C'), costPrice: calculateCostPrice(5.00), retailPrice: 5.00 }] },
    { name: 'Masala Omelette', description: 'Spiced omelette', categoryId: '12', diet: 'non-veg', vendorPrices: [{ vendorId: getVendorId('Vendor C'), costPrice: calculateCostPrice(6.00), retailPrice: 6.00 }] },
    { name: 'Egg Bhurji', description: 'Scrambled eggs with spices', categoryId: '12', diet: 'non-veg', vendorPrices: [{ vendorId: getVendorId('Vendor C'), costPrice: calculateCostPrice(7.00), retailPrice: 7.00 }] },
    { name: 'Egg Biryani', description: 'Aromatic egg biryani', categoryId: '12', diet: 'non-veg', vendorPrices: [{ vendorId: getVendorId('Vendor C'), costPrice: calculateCostPrice(11.00), retailPrice: 11.00 }] },
    { name: 'Egg Paratha', description: 'Paratha with egg', categoryId: '12', diet: 'non-veg', vendorPrices: [{ vendorId: getVendorId('Vendor C'), costPrice: calculateCostPrice(6.00), retailPrice: 6.00 }] },
    { name: 'Egg Fried Rice', description: 'Egg with fried rice', categoryId: '12', diet: 'non-veg', vendorPrices: [{ vendorId: getVendorId('Vendor C'), costPrice: calculateCostPrice(9.00), retailPrice: 9.00 }] },
  );

  // Desserts & Beverages (Category 13)
  items.push(
    { name: 'Gulab Jamun', description: 'Sweet milk dumplings in syrup', categoryId: '13', diet: 'veg', vendorPrices: [{ vendorId: getVendorId('Vendor D'), costPrice: calculateCostPrice(6.00), retailPrice: 6.00 }] },
    { name: 'Rasgulla', description: 'Soft spongy balls in syrup', categoryId: '13', diet: 'veg', vendorPrices: [{ vendorId: getVendorId('Vendor D'), costPrice: calculateCostPrice(5.50), retailPrice: 5.50 }] },
    { name: 'Kheer', description: 'Rice pudding', categoryId: '13', diet: 'veg', vendorPrices: [{ vendorId: getVendorId('Vendor D'), costPrice: calculateCostPrice(7.00), retailPrice: 7.00 }] },
    { name: 'Ice Cream', description: 'Vanilla ice cream', categoryId: '13', diet: 'veg', vendorPrices: [{ vendorId: getVendorId('Vendor D'), costPrice: calculateCostPrice(8.00), retailPrice: 8.00 }] },
    { name: 'Fresh Lime Soda', description: 'Refreshing lime-flavored soda', categoryId: '13', diet: 'veg', vendorPrices: [{ vendorId: getVendorId('Vendor D'), costPrice: calculateCostPrice(4.00), retailPrice: 4.00 }] },
    { name: 'Mango Lassi', description: 'Sweet mango yogurt drink', categoryId: '13', diet: 'veg', vendorPrices: [{ vendorId: getVendorId('Vendor D'), costPrice: calculateCostPrice(5.00), retailPrice: 5.00 }] },
    { name: 'Sweet Lassi', description: 'Sweet yogurt drink', categoryId: '13', diet: 'veg', vendorPrices: [{ vendorId: getVendorId('Vendor D'), costPrice: calculateCostPrice(4.50), retailPrice: 4.50 }] },
    { name: 'Salted Lassi', description: 'Salted yogurt drink', categoryId: '13', diet: 'veg', vendorPrices: [{ vendorId: getVendorId('Vendor D'), costPrice: calculateCostPrice(4.50), retailPrice: 4.50 }] },
    { name: 'Buttermilk', description: 'Spiced buttermilk', categoryId: '13', diet: 'veg', vendorPrices: [{ vendorId: getVendorId('Vendor D'), costPrice: calculateCostPrice(3.50), retailPrice: 3.50 }] },
    { name: 'Fresh Juice', description: 'Mixed fruit juice', categoryId: '13', diet: 'veg', vendorPrices: [{ vendorId: getVendorId('Vendor D'), costPrice: calculateCostPrice(5.00), retailPrice: 5.00 }] },
    { name: 'Soft Drink', description: 'Carbonated soft drink', categoryId: '13', diet: 'veg', vendorPrices: [{ vendorId: getVendorId('Vendor D'), costPrice: calculateCostPrice(3.00), retailPrice: 3.00 }] },
    { name: 'Tea', description: 'Hot tea', categoryId: '13', diet: 'veg', vendorPrices: [{ vendorId: getVendorId('Vendor D'), costPrice: calculateCostPrice(2.50), retailPrice: 2.50 }] },
    { name: 'Coffee', description: 'Hot coffee', categoryId: '13', diet: 'veg', vendorPrices: [{ vendorId: getVendorId('Vendor D'), costPrice: calculateCostPrice(3.50), retailPrice: 3.50 }] },
    { name: 'Jalebi', description: 'Sweet spiral dessert', categoryId: '13', diet: 'veg', vendorPrices: [{ vendorId: getVendorId('Vendor D'), costPrice: calculateCostPrice(6.00), retailPrice: 6.00 }] },
    { name: 'Rasmalai', description: 'Soft cheese dumplings in milk', categoryId: '13', diet: 'veg', vendorPrices: [{ vendorId: getVendorId('Vendor D'), costPrice: calculateCostPrice(7.50), retailPrice: 7.50 }] },
  );

  return items;
};

