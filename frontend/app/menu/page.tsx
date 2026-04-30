//frontend/app/menu/page.tsx
'use client';

import styles from './menu.module.css';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { 
  FaCrown,
  FaStar, 
  FaShoppingBag,
  FaLeaf,
  FaTrash,
  FaPlus,
  FaMinus,
  FaTimes,
  FaHamburger,
  FaCoffee,
  FaWineBottle,
  FaMugHot,
  FaCheese,
  FaPizzaSlice,
  FaEgg,
  FaSeedling,
  FaUtensils,
  FaInstagram,
  FaFacebook,
  FaTwitter,
  FaMapMarkerAlt,
  FaClock,
  FaPhone
} from 'react-icons/fa';
import { GiChickenLeg, GiFrenchFries, GiBeerBottle } from 'react-icons/gi';

type CartItem = {
  id: string;
  name: string;
  basePrice: number;
  addOns: { name: string; price: number }[];
  quantity: number;
  totalPrice: number;
  isVegan?: boolean;
};

export default function MenuPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [selectedAddOns, setSelectedAddOns] = useState<{ name: string; price: number }[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [isVeganSelected, setIsVeganSelected] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [addedAnimation, setAddedAnimation] = useState(false);

  // Load cart from localStorage on mount AND when component becomes visible
  useEffect(() => {
    loadCartFromStorage();
    
    // Also listen for storage changes (if cart is updated in another tab)
    window.addEventListener('storage', loadCartFromStorage);
    
    // Reload cart when page becomes visible (navigating back)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        loadCartFromStorage();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Also reload on focus (when user comes back to this tab)
    window.addEventListener('focus', loadCartFromStorage);
    
    return () => {
      window.removeEventListener('storage', loadCartFromStorage);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', loadCartFromStorage);
    };
  }, []);

  const loadCartFromStorage = () => {
    const savedCart = localStorage.getItem('kingsCart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setCart(parsedCart);
      } catch (error) {
        console.error('Error parsing cart:', error);
        setCart([]);
      }
    }
  };

  const categories = [
    { id: 'all', name: 'Full Menu', icon: FaHamburger },
    { id: 'burgers', name: 'Burgers', icon: FaHamburger },
    { id: 'wings', name: 'Wings', icon: GiChickenLeg },
    { id: 'appetizers', name: 'Appetizers', icon: FaPizzaSlice },
    { id: 'melts', name: 'Melts', icon: FaCheese },
    { id: 'breakfast', name: 'Breakfast', icon: FaEgg },
    { id: 'fries', name: 'Fries', icon: GiFrenchFries },
    { id: 'platters', name: 'Platters', icon: FaCrown },
    { id: 'coffee', name: 'Coffee', icon: FaCoffee },
    { id: 'beverages', name: 'Beverages', icon: FaWineBottle },
    { id: 'tea', name: 'Tea', icon: FaMugHot },
    { id: 'beer', name: 'Beer', icon: GiBeerBottle },
    { id: 'dips', name: 'Dips', icon: FaSeedling },
  ];

  const menuData: any = {
    burgers: {
      title: "BURGERS",
      subtitle: "",
      description: "",
      category: "burgers",
      items: [
        { name: "Classic", price: 640, description: "Double beef patties, caramelized onions, American cheese and burger sauce on a brioche bun", addOns: ["ADD Crispy Bacon +Rs. 120", "ADD American Cheese +Rs. 90", "ADD Caramelized Onion +Rs. 80"], hasVegan: false },
        { name: "Black and Blue", price: 920, description: "Double beef patties, American cheese, crispy bacon, blue cheese sauce and blackened onion-mushroom-chili jam on a brioche bun", addOns: ["ADD Extra Bacon +Rs. 120", "ADD American Cheese +Rs. 90"], hasVegan: false },
        { name: "KINGS", price: 750, description: "Double beef patties, crispy bacon, jalapeños cream cheese, American cheese, garlic mayo and jalapeños on a brioche bun", addOns: ["ADD Extra Bacon +Rs. 120", "ADD Extra Jalapeños +Rs. 60"], hasVegan: false },
        { name: "Big Nasty", price: 980, description: "Triple beef patties, 3 slices of crispy bacon, double American cheese, garlic mayo, pickled jalapeños and onion on a brioche bun", addOns: ["ADD Extra Patty +Rs. 250", "ADD Extra Bacon +Rs. 120"], hasVegan: false },
        { name: "Oklahoma Onion", price: 520, description: "Single beef patty, American cheese, stir fried onion, garlic mayo and caramelized onions on a brioche bun", addOns: ["ADD Extra Patty +Rs. 200", "ADD Bacon +Rs. 120"], hasVegan: false },
        { name: "Cowboy", price: 820, description: "Double beef patties, crispy bacon, American cheese, BBQ sauce, garlic mayo, jalapeños, lettuce on a brioche bun", addOns: ["ADD Extra Bacon +Rs. 120", "ADD Extra Jalapeños +Rs. 60"], hasVegan: false },
        { name: "In and Out", price: 940, description: "Special sauce with onion, double beef patties, iceberg lettuce, tomato, onion, pickles, American cheese and burger sauce on a brioche bun", addOns: ["ADD Extra Patty +Rs. 250", "ADD Bacon +Rs. 120"], hasVegan: false },
        { name: "Santa Fe", price: 740, description: "Double chicken patty, American cheese, iceberg lettuce, tomato, jalapeños, onion, house-made pico de gallo, garlic mayo on brioche bun", addOns: ["ADD Bacon +Rs. 120", "ADD Extra Jalapeños +Rs. 60"], hasVegan: false },
        { name: "BBQ Chicken", price: 740, description: "Double chicken patties, American cheese, iceberg lettuce, crispy onion rings, spicy mayo, jalapeños, BBQ sauce on a brioche bun", addOns: ["ADD Extra Onion Rings +Rs. 100", "ADD American Cheese +Rs. 90"], hasVegan: false },
        { name: "Thai Satay Chicken", price: 740, description: "Double chicken patties, peanut satay sauce, Thai salad, iceberg lettuce, onion and pickled jalapeños on a brioche bun", addOns: ["ADD Extra Satay Sauce +Rs. 60", "ADD Pickled Jalapeños +Rs. 60"], hasVegan: false },
        { name: "Crispy Golden Prawn Burger", price: 850, description: "Crispy prawns, iceberg, garlic mayo with pickle, onion on a brioche bun", addOns: ["ADD Extra Prawns +Rs. 200", "ADD American Cheese +Rs. 90"], hasVegan: false },
        { name: "Hot Chicken / Tofu", price: 640, veganPrice: 590, description: "Fried chicken or tofu dipped in sweet tangy hot sauce, spices, onion, pepper, mayo, lettuce and spicy mayo on a brioche bun", addOns: ["ADD American Cheese +Rs. 90", "ADD Coleslaw +Rs. 60"], hasVegan: true, veganDescription: "Crispy tofu dipped in sweet tangy hot sauce, spices, onion, pepper, vegan mayo, lettuce and spicy vegan mayo on a vegan bun" },
        { name: "Crispy Chicken / Tofu", price: 620, veganPrice: 570, description: "Crispy fried chicken or tofu, seasoned with pepper and spicy mayo on a brioche bun", addOns: ["ADD American Cheese +Rs. 90", "ADD Bacon +Rs. 120"], hasVegan: true, veganDescription: "Crispy fried tofu, seasoned with pepper and spicy vegan mayo on a vegan bun" },
        { name: "Grilled Chicken / Tofu", price: 620, veganPrice: 570, description: "Grilled chicken breast or tofu, American cheese, iceberg lettuce, onion, tomato, garlic mayo on brioche bun", addOns: ["ADD Avocado +Rs. 100", "ADD Bacon +Rs. 120"], hasVegan: true, veganDescription: "Grilled tofu, vegan cheese, iceberg lettuce, onion, tomato, vegan garlic mayo on vegan bun" },
        { name: "Kimchi Chicken / Tofu", price: 750, veganPrice: 650, description: "Kimchi, chicken or tofu, garlic mayo, fried base, served on brioche bun", addOns: ["ADD Extra Kimchi +Rs. 80", "ADD American Cheese +Rs. 90"], hasVegan: true, veganDescription: "Kimchi, crispy tofu, vegan garlic mayo, fried base, served on vegan bun" },
        { name: "Atlas", price: 980, description: "Double crispy chicken, onion, American cheese, spicy honey garlic mayo, lettuce on brioche bun", addOns: ["ADD Extra Chicken +Rs. 250", "ADD Bacon +Rs. 120"], hasVegan: false },
        { name: "Schnitzel Chicken Burger", price: 700, description: "Crispy chicken schnitzel, lettuce, tomato, onion, garlic mayo on brioche bun", addOns: ["ADD American Cheese +Rs. 90", "ADD Bacon +Rs. 120"], hasVegan: false },
        { name: "Veggie Paneer", price: 700, description: "Crispy fried paneer, American cheese, iceberg lettuce, tomato, garlic mayo and hot sauce on brioche bun", addOns: ["ADD Extra Paneer +Rs. 150", "ADD Jalapeños +Rs. 60"], hasVegan: false },
        { name: "Pulled Mushroom", price: 610, description: "Pulled oyster mushrooms, coleslaw, homemade BBQ sauce and onion on brioche bun", addOns: ["ADD American Cheese +Rs. 90", "ADD Extra Mushrooms +Rs. 120"], hasVegan: true, veganPrice: 610, veganDescription: "Pulled oyster mushrooms, vegan coleslaw, homemade vegan BBQ sauce and onion on vegan bun" },
        { name: "BBQ Pulled Pork", price: 810, description: "Slow cooked pulled pork, coleslaw, homemade BBQ sauce on brioche bun", addOns: ["ADD Extra Pork +Rs. 200", "ADD American Cheese +Rs. 90"], hasVegan: false },
        { name: "Cubano", price: 920, description: "Pulled pork, ham, mozzarella, mustard, garlic mayo, pickle on brioche bun", addOns: ["ADD Extra Ham +Rs. 150", "ADD Extra Cheese +Rs. 90"], hasVegan: false },
        { name: "KINGS Signature Texas Smoke Burger", price: 980, description: "All-hours smoked beef brisket, single beef patty, American cheese, lettuce, onion, BBQ sauce, caramelized onions, jalapeños on brioche bun", addOns: ["ADD Extra Brisket +Rs. 300", "ADD Extra Patty +Rs. 250"], hasVegan: false },
      ]
    },
    wings: {
      title: "CHICKEN WINGS",
      subtitle: "",
      description: "Spicy / Mild available",
      category: "wings",
      items: [
        { name: "Plain", price: 540, description: "Classic crispy chicken wings", addOns: [], hasVegan: false },
        { name: "BBQ Sauce", price: 590, description: "Wings tossed in signature BBQ sauce", addOns: [], hasVegan: false },
        { name: "Hot Sauce", price: 590, description: "Wings tossed in spicy hot sauce", addOns: [], hasVegan: false },
        { name: "Honey Garlic Sauce", price: 590, description: "Wings tossed in sweet honey garlic sauce", addOns: [], hasVegan: false },
        { name: "Sesame Korean Sauce", price: 640, description: "Wings tossed in Korean sesame sauce", addOns: [], hasVegan: false },
        { name: "Wings Platter", price: 1180, description: "Assorted wings platter with all sauces", addOns: [], hasVegan: false },
      ]
    },
    appetizers: {
      title: "APPETIZERS",
      subtitle: "",
      description: "",
      category: "appetizers",
      items: [
        { name: "Veg. Nachos", price: 590, description: "Nachos loaded with salsa, jalapeños, and house sauce", addOns: ["ADD Extra Cheese +Rs. 90", "ADD Guacamole +Rs. 100"], hasVegan: true, veganPrice: 590 },
        { name: "Pulled Pork Loaded Nachos", price: 930, description: "Nachos loaded with pulled pork, salsa, jalapeños, and house sauce", addOns: ["ADD Extra Pork +Rs. 200", "ADD Extra Cheese +Rs. 90"], hasVegan: false },
        { name: "Chicken Tenders", price: 560, description: "Crispy chicken tenders with dipping sauce", addOns: ["ADD Extra Piece +Rs. 150", "ADD Dip +Rs. 50"], hasVegan: false },
        { name: "Chicken Nuggets", price: 560, description: "Crispy chicken nuggets with dipping sauce", addOns: ["ADD Extra Piece +Rs. 120", "ADD Dip +Rs. 50"], hasVegan: false },
        { name: "Panko Onion Rings", price: 400, description: "Crispy panko-crusted onion rings", addOns: ["ADD Dip +Rs. 50"], hasVegan: true, veganPrice: 400 },
        { name: "Mozzarella Bites", price: 510, description: "Crispy fried mozzarella bites with marinara", addOns: ["ADD Extra Bites +Rs. 150"], hasVegan: false },
        { name: "Crispy Prawn", price: 1150, description: "Crispy fried prawns with spicy mayo", addOns: ["ADD Extra Prawns +Rs. 300"], hasVegan: false },
      ]
    },
    melts: {
      title: "MELTS",
      subtitle: "MEAL",
      description: "They melt comes with your choice of crispy side of onion rings or fries, accompanied by our signature spicy mayo and green sauce.",
      category: "melts",
      items: [
        { name: "Patty Melt", price: 700, description: "Beef patty, mozzarella, American cheese, burger sauce, and caramelized onions", addOns: ["ADD Bacon +Rs. 120", "ADD Extra Cheese +Rs. 90"], hasVegan: false },
        { name: "Chicken Basil Melt", price: 750, description: "Grilled chicken, mozzarella, sautéed vegetables, basil mayo on sourdough", addOns: ["ADD Extra Chicken +Rs. 200", "ADD Avocado +Rs. 100"], hasVegan: false },
        { name: "Tofu Basil Melt", price: 700, description: "Grilled tofu, mozzarella, sautéed vegetables, basil mayo on sourdough", addOns: ["ADD Extra Tofu +Rs. 150", "ADD Avocado +Rs. 100"], hasVegan: true, veganPrice: 700 },
      ]
    },
    breakfast: {
      title: "BREAKFAST",
      subtitle: "SERVED TILL 2PM ONLY",
      description: "",
      category: "breakfast",
      items: [
        { name: "Stuffed Brioche French Toast", price: 470, description: "With Cream Cheese and Jam", addOns: ["ADD Bacon +Rs. 120", "ADD Maple Syrup +Rs. 60"], hasVegan: false },
        { name: "KINGS Breakfast", price: 930, description: "2 eggs (choice), sausage, bacon, chicken patty, sourdough, and sautéed vegetables", addOns: ["ADD Extra Egg +Rs. 80", "ADD Avocado +Rs. 100"], hasVegan: false },
        { name: "Breakfast Burger", price: 700, description: "Fried egg, American cheese, chicken patty, bacon, basil mayo on brioche bun", addOns: ["ADD Extra Egg +Rs. 80", "ADD Extra Bacon +Rs. 120"], hasVegan: false },
      ]
    },
    fries: {
      title: "FRIES",
      subtitle: "",
      description: "",
      category: "fries",
      items: [
        { name: "Salted Fries", price: 400, description: "Classic salted French fries", addOns: ["ADD Dip +Rs. 50"], hasVegan: true, veganPrice: 400 },
        { name: "Spicy House Fries", price: 420, description: "Fries seasoned with a sprinkle of schezwan pepper, garlic, and coriander", addOns: ["ADD Dip +Rs. 50"], hasVegan: true, veganPrice: 420 },
        { name: "Veg Loaded Fries", price: 590, description: "Fries loaded with cheese sauce, onion, jalapeños, and house sauce", addOns: ["ADD Extra Cheese +Rs. 90", "ADD Guacamole +Rs. 100"], hasVegan: true, veganPrice: 590 },
        { name: "Pulled Pork Loaded Fries", price: 930, description: "Fries loaded with pulled pork, bacon, cheese powder, salsa, jalapeños, and house sauce", addOns: ["ADD Extra Pork +Rs. 200", "ADD Extra Cheese +Rs. 90"], hasVegan: false },
      ]
    },
    platters: {
      title: "KINGS PLATTER",
      subtitle: "",
      description: "Chicken Tenders, Chicken Wings, House Fries, Nachos, Mozzarella Bites, Panko Onion Rings, and 3 house sauces",
      category: "platters",
      items: [
        { name: "KINGS Platter", price: 1399, description: "The ultimate feast - perfect for sharing!", addOns: ["ADD Extra Wings +Rs. 300", "ADD Extra Tenders +Rs. 200"], hasVegan: false },
      ]
    },
    coffee: {
      title: "ESPRESSO BEVERAGES",
      subtitle: "",
      description: "",
      category: "coffee",
      items: [
        { name: "Espresso", price: 180, description: "Single shot espresso", addOns: [], hasVegan: true, veganPrice: 180 },
        { name: "Doppio", price: 200, description: "Double shot espresso", addOns: [], hasVegan: true, veganPrice: 200 },
        { name: "Americano", price: 220, description: "Espresso with hot water", addOns: ["ADD Ice +Rs. 30"], hasVegan: true, veganPrice: 220 },
        { name: "Iced Americano", price: 250, description: "Espresso with cold water and ice", addOns: [], hasVegan: true, veganPrice: 250 },
        { name: "Latte", price: 250, description: "Espresso with steamed milk", addOns: ["ADD Ice +Rs. 30", "ADD Flavor Shot +Rs. 50"], hasVegan: false },
        { name: "Iced Latte", price: 280, description: "Espresso with cold milk and ice", addOns: ["ADD Flavor Shot +Rs. 50"], hasVegan: false },
        { name: "Cappuccino", price: 240, description: "Espresso with steamed milk foam", addOns: ["ADD Ice +Rs. 30"], hasVegan: false },
        { name: "Iced Cappuccino", price: 270, description: "Espresso with cold milk foam and ice", addOns: [], hasVegan: false },
        { name: "Mocha", price: 330, description: "Espresso with chocolate and steamed milk", addOns: ["ADD Ice +Rs. 20", "ADD Whipped Cream +Rs. 50"], hasVegan: false },
        { name: "Iced Mocha", price: 350, description: "Espresso with chocolate, cold milk and ice", addOns: ["ADD Whipped Cream +Rs. 50"], hasVegan: false },
        { name: "Long Black", price: 230, description: "Double espresso over hot water", addOns: [], hasVegan: true, veganPrice: 230 },
        { name: "Flat White", price: 280, description: "Espresso with velvety microfoam milk", addOns: [], hasVegan: false },
        { name: "Affogato", price: 300, description: "Espresso poured over vanilla ice cream", addOns: [], hasVegan: false },
        { name: "Iced Caramel Macchiato", price: 300, description: "Espresso, vanilla, milk, ice topped with caramel", addOns: ["ADD Extra Caramel +Rs. 50"], hasVegan: false },
        { name: "Mocha Frappe", price: 370, description: "Blended mocha frappe with whipped cream", addOns: ["ADD Extra Shot +Rs. 50"], hasVegan: false },
        { name: "Oreo Frappe", price: 390, description: "Blended Oreo frappe with whipped cream", addOns: ["ADD Extra Oreo +Rs. 60"], hasVegan: false },
      ]
    },
    beverages: {
      title: "NON-ESPRESSO BEVERAGES",
      subtitle: "",
      description: "",
      category: "beverages",
      items: [
        { name: "Seasonal Smoothies", price: 370, description: "Fresh seasonal fruit smoothies", addOns: [], hasVegan: true, veganPrice: 370 },
        { name: "Hot Chocolate", price: 300, description: "Rich hot chocolate with whipped cream", addOns: ["ADD Marshmallows +Rs. 50"], hasVegan: false },
        { name: "Iced Chocolate", price: 330, description: "Cold chocolate with ice cream", addOns: ["ADD Whipped Cream +Rs. 50"], hasVegan: false },
        { name: "Flavored Shake", price: 350, description: "Choice of flavored milkshake", addOns: ["ADD Whipped Cream +Rs. 50"], hasVegan: false },
        { name: "Cool Lime Refresher", price: 250, description: "Refreshing lime drink", addOns: [], hasVegan: true, veganPrice: 250 },
        { name: "Cool Lime Mint Refresher", price: 270, description: "Lime and mint refresher", addOns: [], hasVegan: true, veganPrice: 270 },
        { name: "Virgin Mojito", price: 300, description: "Classic virgin mojito", addOns: [], hasVegan: true, veganPrice: 300 },
        { name: "Pomegranate Mojito", price: 350, description: "Pomegranate flavored mojito", addOns: [], hasVegan: true, veganPrice: 350 },
        { name: "Plain Soda", price: 150, description: "Plain soda water", addOns: [], hasVegan: true, veganPrice: 150 },
        { name: "Lime Soda", price: 180, description: "Lime flavored soda", addOns: [], hasVegan: true, veganPrice: 180 },
        { name: "Cold Drink", price: 120, description: "Assorted cold drinks", addOns: [], hasVegan: true, veganPrice: 120 },
        { name: "Seasonal Juice", price: 300, description: "Fresh seasonal juice", addOns: [], hasVegan: true, veganPrice: 300 },
        { name: "Mineral Water", price: 50, description: "Bottled mineral water", addOns: [], hasVegan: true, veganPrice: 50 },
      ]
    },
    tea: {
      title: "TEA",
      subtitle: "",
      description: "",
      category: "tea",
      items: [
        { name: "Peach Iced Tea", price: 250, description: "Refreshing peach iced tea", addOns: [], hasVegan: true, veganPrice: 250 },
        { name: "Lime Iced Tea", price: 250, description: "Refreshing lime iced tea", addOns: [], hasVegan: true, veganPrice: 250 },
        { name: "Himalayan Tea (Pot)", price: 250, description: "Premium Himalayan tea served in a pot", addOns: [], hasVegan: true, veganPrice: 250 },
      ]
    },
    beer: {
      title: "BEER",
      subtitle: "",
      description: "",
      category: "beer",
      items: [
        { name: "Barasinghe Bottle 330 ML", price: 450, description: "Premium local beer", addOns: [], hasVegan: true, veganPrice: 450 },
        { name: "Barasinghe Draft", price: 600, description: "Fresh draft beer", addOns: [], hasVegan: true, veganPrice: 600 },
        { name: "Barasinghe Pitcher", price: 1650, description: "Pitcher of draft beer - perfect for sharing", addOns: [], hasVegan: true, veganPrice: 1650 },
      ]
    },
    dips: {
      title: "ADDITIONAL DIPS",
      subtitle: "",
      description: "All dips Rs. 50 each",
      category: "dips",
      items: [
        { name: "Spicy Mayo", price: 50, description: "", addOns: [], hasVegan: false },
        { name: "Honey Mustard Sauce", price: 50, description: "", addOns: [], hasVegan: false },
        { name: "Garlic Mayo", price: 50, description: "", addOns: [], hasVegan: false },
        { name: "Basil Mayo", price: 50, description: "", addOns: [], hasVegan: false },
        { name: "MayoChup (Mayo & Ketchup)", price: 50, description: "", addOns: [], hasVegan: false },
        { name: "Hot Sauce", price: 50, description: "", addOns: [], hasVegan: true, veganPrice: 50 },
        { name: "BBQ Sauce", price: 50, description: "", addOns: [], hasVegan: true, veganPrice: 50 },
        { name: "Green Sauce", price: 50, description: "", addOns: [], hasVegan: true, veganPrice: 50 },
      ]
    }
  };

  const triggerCartAnimation = () => {
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 600);
  };

  const openModal = (item: any, section: string) => {
    setSelectedItem({ ...item, section });
    setSelectedAddOns([]);
    setQuantity(1);
    setIsVeganSelected(false);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedItem(null);
    setSelectedAddOns([]);
    setQuantity(1);
    setIsVeganSelected(false);
  };

  const addToCart = () => {
    if (!selectedItem) return;
    
    const finalPrice = isVeganSelected && selectedItem.veganPrice ? selectedItem.veganPrice : selectedItem.price;
    const addOnsTotal = selectedAddOns.reduce((sum: number, addOn: any) => sum + addOn.price, 0);
    const totalPrice = (finalPrice + addOnsTotal) * quantity;
    
    const itemName = isVeganSelected ? `${selectedItem.name} (Vegan)` : selectedItem.name;
    
    const newItem: CartItem = {
      id: `${selectedItem.name}-${Date.now()}-${isVeganSelected ? 'vegan' : 'regular'}`,
      name: itemName,
      basePrice: finalPrice,
      addOns: selectedAddOns,
      quantity: quantity,
      totalPrice: totalPrice,
      isVegan: isVeganSelected
    };
    
    setCart(prev => {
      const newCart = [...prev, newItem];
      localStorage.setItem('kingsCart', JSON.stringify(newCart));
      return newCart;
    });
    triggerCartAnimation();
    closeModal();
  };

  const removeFromCart = (id: string) => {
    setCart(prev => {
      const newCart = prev.filter(item => item.id !== id);
      localStorage.setItem('kingsCart', JSON.stringify(newCart));
      return newCart;
    });
  };

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(id);
      return;
    }
    setCart(prev => {
      const newCart = prev.map(item => {
        if (item.id === id) {
          const addOnsTotal = item.addOns.reduce((sum, addOn) => sum + addOn.price, 0);
          const newTotalPrice = (item.basePrice + addOnsTotal) * newQuantity;
          return { ...item, quantity: newQuantity, totalPrice: newTotalPrice };
        }
        return item;
      });
      localStorage.setItem('kingsCart', JSON.stringify(newCart));
      return newCart;
    });
  };

  const getCartTotal = () => {
    return cart.reduce((sum, item) => sum + item.totalPrice, 0);
  };

  const getItemCount = () => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  };

  const filteredMenu = activeCategory === 'all' 
    ? Object.entries(menuData)
    : Object.entries(menuData).filter(([key]) => key === activeCategory);

  return (
    <div className={styles.container}>
      {/* Navigation */}
      <nav className={styles.nav}>
        <div className={styles.navContainer}>
          <Link href="/" className={styles.logo}>
            <FaCrown className={styles.logoIcon} />
            <div>
              <span className={styles.logoText}>KINGS</span>
              <span className={styles.logoSubtext}>EATERY</span>
            </div>
          </Link>
          <div className={styles.navLinks}>
            <Link href="/menu" className={styles.navLinkActive}>Menu</Link>
            <Link href="/" className={styles.navLink}>Home</Link>
            <a href="/#location" className={styles.navLink}>Location</a>
            <a href="/#contact" className={styles.navLink}>Contact</a>
          </div>
          <button 
            onClick={() => setShowCart(!showCart)} 
            className={`${styles.cartIconBtn} ${addedAnimation ? styles.cartIconBtnPop : ''}`}
          >
            <FaShoppingBag />
            {getItemCount() > 0 && (
              <span className={styles.cartIconBadge}>{getItemCount()}</span>
            )}
          </button>
        </div>
      </nav>

      {/* Cart Slide-out Panel */}
      {showCart && (
        <div className={styles.cartOverlay} onClick={() => setShowCart(false)}>
          <div className={styles.cartPanel} onClick={(e) => e.stopPropagation()}>
            <div className={styles.cartPanelHeader}>
              <h3><FaShoppingBag /> Your Order ({getItemCount()})</h3>
              <button onClick={() => setShowCart(false)} className={styles.cartPanelCloseBtn}>
                <FaTimes />
              </button>
            </div>
            <div className={styles.cartPanelItems}>
              {cart.length === 0 ? (
                <div className={styles.cartPanelEmpty}>
                  <FaShoppingBag className={styles.cartPanelEmptyIcon} />
                  <p>Your cart is empty</p>
                  <p className={styles.cartPanelEmptySub}>Click on any menu item to start your order</p>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.id} className={styles.cartPanelItem}>
                    <div className={styles.cartPanelItemInfo}>
                      <h4>
                        {item.isVegan && <FaLeaf className={styles.cartPanelVeganIcon} />}
                        {item.name}
                      </h4>
                      {item.addOns.length > 0 && (
                        <div className={styles.cartPanelAddOns}>
                          {item.addOns.map(addOn => (
                            <span key={addOn.name}>+ {addOn.name}</span>
                          ))}
                        </div>
                      )}
                      <div className={styles.cartPanelItemPrice}>Rs. {item.totalPrice}</div>
                    </div>
                    <div className={styles.cartPanelItemControls}>
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className={styles.cartPanelQtyBtn}>
                        <FaMinus />
                      </button>
                      <span className={styles.cartPanelQty}>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className={styles.cartPanelQtyBtn}>
                        <FaPlus />
                      </button>
                      <button onClick={() => removeFromCart(item.id)} className={styles.cartPanelRemoveBtn}>
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
            {cart.length > 0 && (
              <div className={styles.cartPanelFooter}>
                <div className={styles.cartPanelTotal}>
                  <span>Total:</span>
                  <strong>Rs. {getCartTotal()}</strong>
                </div>
                <Link href="/checkout" className={styles.cartPanelCheckoutBtn}>
                  Proceed to Checkout
                </Link>
                <button 
                  className={styles.cartPanelContinueBtn}
                  onClick={() => setShowCart(false)}
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Category Filter */}
      <div className={styles.categoryFilter}>
        {categories.map((cat) => (
          <button
            key={cat.id}
            className={`${styles.categoryBtn} ${activeCategory === cat.id ? styles.active : ''}`}
            onClick={() => setActiveCategory(cat.id)}
          >
            <cat.icon />
            <span>{cat.name}</span>
          </button>
        ))}
      </div>

      {/* Menu Paper */}
      <div className={styles.menuPaper}>
        <div className={styles.paperTexture} />
        <div className={styles.coffeeStain} />
        <div className={styles.foldLine} />

        <div className={styles.menuHeader}>
          <div className={styles.restaurantName}>
            <FaCrown className={styles.headerIcon} />
            <h1>KINGS EATERY</h1>
          </div>
          <div className={styles.headerDecoration}>
            <FaStar />
            <span>EST. 2019</span>
            <FaStar />
          </div>
          <p className={styles.headerAddress}>Sanepa, Lalitpur • Kathmandu</p>
          <div className={styles.headerDivider}>
            <span>~ ~ ~ • ~ ~ ~</span>
          </div>
        </div>
        
        {filteredMenu.map(([key, section]: [string, any]) => (
          <div key={key} className={styles.menuSection}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>{section.title}</h2>
              {section.subtitle && <span className={styles.sectionSubtitle}>{section.subtitle}</span>}
            </div>
            
            {section.description && (
              <p className={styles.sectionDescription}>{section.description}</p>
            )}
            
            {section.items.map((item: any, idx: number) => (
              <div key={idx} className={styles.menuItem} onClick={() => openModal(item, key)}>
                <div className={styles.menuItemContent}>
                  <div className={styles.menuItemHeader}>
                    <div className={styles.menuItemTitle}>
                      {item.hasVegan && <FaLeaf className={styles.veganIcon} />}
                      <h3>{item.name}</h3>
                    </div>
                    <span className={styles.menuPrice}>Rs. {item.price}</span>
                  </div>
                  {item.description && (
                    <p className={styles.menuDescription}>{item.description}</p>
                  )}
                  {item.addOns && item.addOns.slice(0, 2).map((addon: string, i: number) => (
                    <div key={i} className={styles.menuAddOns}>{addon}</div>
                  ))}
                  {item.addOns && item.addOns.length > 2 && (
                    <div className={styles.menuAddOnsMore}>+{item.addOns.length - 2} more add-ons available</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ))}

        <div className={styles.menuFooter}>
          <div className={styles.headerDivider}>
            <span>~ ~ ~ • ~ ~ ~</span>
          </div>
          <p className={styles.footerNote}>All prices are in Nepalese Rupees</p>
          <p className={styles.footerNote}>Prices inclusive of all taxes</p>
          <p className={styles.footerNote}>Spicy / Mild options available</p>
          <p className={styles.footerTagline}>Thank you for dining with us!</p>
        </div>
      </div>

      {/* Modal */}
      {showModal && selectedItem && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div className={styles.modalTitle}>
                {selectedItem.hasVegan && <FaLeaf className={styles.modalVeganIcon} />}
                <h2>{selectedItem.name}</h2>
              </div>
              <button className={styles.closeModalBtn} onClick={closeModal}>
                <FaTimes />
              </button>
            </div>
            <div className={styles.modalBody}>
              <p className={styles.modalDesc}>
                {isVeganSelected && selectedItem.veganDescription ? selectedItem.veganDescription : selectedItem.description}
              </p>
              
              {selectedItem.hasVegan && (
                <div className={styles.veganOptionSection}>
                  <label className={styles.veganCheckbox}>
                    <input
                      type="checkbox"
                      checked={isVeganSelected}
                      onChange={(e) => setIsVeganSelected(e.target.checked)}
                    />
                    <FaLeaf className={styles.checkboxVeganIcon} />
                    <span>Make it Vegan</span>
                    {selectedItem.veganPrice && selectedItem.veganPrice !== selectedItem.price && (
                      <span className={styles.veganPriceDiff}> Save Rs. {Math.abs(selectedItem.price - selectedItem.veganPrice)}</span>
                    )}
                  </label>
                  {isVeganSelected && selectedItem.veganDescription && (
                    <p className={styles.veganDescription}>{selectedItem.veganDescription}</p>
                  )}
                </div>
              )}
              
              <div className={styles.priceBreakdown}>
                <div className={styles.priceRow}>
                  <span>Price:</span>
                  <span>
                    {isVeganSelected && selectedItem.veganPrice ? (
                      <span className={styles.veganPrice}>Rs. {selectedItem.veganPrice}</span>
                    ) : (
                      <span>Rs. {selectedItem.price}</span>
                    )}
                  </span>
                </div>
                
                {selectedItem.addOns && selectedItem.addOns.length > 0 && (
                  <div className={styles.modalAddOns}>
                    <h4>Add-ons:</h4>
                    {selectedItem.addOns.map((option: string, idx: number) => {
                      const priceMatch = option.match(/\+Rs\.\s*(\d+)/);
                      const addOnPrice = priceMatch ? parseInt(priceMatch[1]) : 0;
                      const addOnName = option.replace(/\s*\+Rs\.\s*\d+/, '').trim();
                      return (
                        <label key={idx} className={styles.addOnCheckbox}>
                          <input
                            type="checkbox"
                            checked={selectedAddOns.some((a: any) => a.name === addOnName)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedAddOns([...selectedAddOns, { name: addOnName, price: addOnPrice }]);
                              } else {
                                setSelectedAddOns(selectedAddOns.filter((a: any) => a.name !== addOnName));
                              }
                            }}
                          />
                          <span>{addOnName} (+Rs. {addOnPrice})</span>
                        </label>
                      );
                    })}
                  </div>
                )}
                
                <div className={styles.quantitySelector}>
                  <label>Quantity:</label>
                  <div className={styles.quantityControls}>
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                    <span>{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)}>+</button>
                  </div>
                </div>
                
                <div className={styles.totalRow}>
                  <span>Total:</span>
                  <strong>
                    Rs. {((isVeganSelected && selectedItem.veganPrice ? selectedItem.veganPrice : selectedItem.price) + selectedAddOns.reduce((s: number, a: any) => s + a.price, 0)) * quantity}
                  </strong>
                </div>
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.cancelBtn} onClick={closeModal}>Cancel</button>
              <button className={styles.addToCartBtn} onClick={addToCart}>
                <FaPlus /> Add to Cart - Rs. {((isVeganSelected && selectedItem.veganPrice ? selectedItem.veganPrice : selectedItem.price) + selectedAddOns.reduce((s: number, a: any) => s + a.price, 0)) * quantity}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContainer}>
          <div className={styles.footerGrid}>
            <div className={styles.footerBrand}>
              <div className={styles.logo}>
                <FaCrown className={styles.footerLogoIcon} />
                <span className={styles.footerLogoText}>KINGS</span>
              </div>
              <p className={styles.footerDescription}>
                Craft burgers and brunch in the heart of Sanepa, Lalitpur. Where quality meets comfort.
              </p>
              <div className={styles.footerSocialLinks}>
                <a href="#" className={styles.footerSocialLink}><FaInstagram /></a>
                <a href="#" className={styles.footerSocialLink}><FaFacebook /></a>
                <a href="#" className={styles.footerSocialLink}><FaTwitter /></a>
              </div>
            </div>
            <div className={styles.footerLinks}>
              <h4>Quick Links</h4>
              <Link href="/menu">Menu</Link>
              <Link href="/about">Our Story</Link>
              <a href="#location">Find Us</a>
              <a href="#">Order Online</a>
            </div>
            <div className={styles.footerLinks}>
              <h4>Hours</h4>
              <p>Monday - Sunday</p>
              <p>10:00 AM - 9:00 PM</p>
              <p className={styles.footerNote}>Kitchen closes at 8:30 PM</p>
            </div>
            <div className={styles.footerNewsletter}>
              <h4>Stay Updated</h4>
              <p>Get exclusive deals and new menu alerts</p>
              <div className={styles.footerNewsletterForm}>
                <input 
                  type="email" 
                  placeholder="Your email" 
                  className={styles.footerNewsletterInput}
                />
                <button className={styles.footerNewsletterBtn}>
                  Subscribe
                </button>
              </div>
            </div>
          </div>
          <div className={styles.footerBottom}>
            <p>&copy; 2024 KINGS Eatery. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}