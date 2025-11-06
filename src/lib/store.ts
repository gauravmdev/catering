import { Category, FoodItem, Quote, Vendor, Customer } from './types';
import { initializeFoodItems } from './foodItemsData';

// Mock data store - in production, this would be replaced with Supabase
class DataStore {
  private categories: Category[] = [
    {
      id: '1',
      name: 'Breads & Basics',
      description: 'Fresh breads and essential accompaniments',
      createdAt: new Date('2024-01-01'),
    },
    {
      id: '2',
      name: 'Salads & Accompaniments',
      description: 'Fresh salads and side dishes',
      createdAt: new Date('2024-01-01'),
    },
    {
      id: '3',
      name: 'Snacks & Quick Bites',
      description: 'Light snacks and quick bites',
      createdAt: new Date('2024-01-01'),
    },
    {
      id: '4',
      name: 'Soups',
      description: 'Hot and comforting soups',
      createdAt: new Date('2024-01-01'),
    },
    {
      id: '5',
      name: 'Starters - Vegetarian',
      description: 'Vegetarian appetizers and starters',
      createdAt: new Date('2024-01-01'),
    },
    {
      id: '6',
      name: 'Starters - Non-Vegetarian',
      description: 'Non-vegetarian appetizers and starters',
      createdAt: new Date('2024-01-01'),
    },
    {
      id: '7',
      name: 'Main Course - Chicken',
      description: 'Chicken main course dishes',
      createdAt: new Date('2024-01-01'),
    },
    {
      id: '8',
      name: 'Main Course - Mutton',
      description: 'Mutton main course dishes',
      createdAt: new Date('2024-01-01'),
    },
    {
      id: '9',
      name: 'Main Course - Seafood',
      description: 'Seafood main course dishes',
      createdAt: new Date('2024-01-01'),
    },
    {
      id: '10',
      name: 'Rice & Noodles',
      description: 'Rice dishes and noodle preparations',
      createdAt: new Date('2024-01-01'),
    },
    {
      id: '11',
      name: 'Arabic Specialties',
      description: 'Authentic Arabic dishes',
      createdAt: new Date('2024-01-01'),
    },
    {
      id: '12',
      name: 'Egg Items',
      description: 'Egg-based dishes',
      createdAt: new Date('2024-01-01'),
    },
    {
      id: '13',
      name: 'Desserts & Beverages',
      description: 'Sweet treats and refreshing drinks',
      createdAt: new Date('2024-01-01'),
    },
  ];

  private vendors: Vendor[] = [
    {
      id: '1',
      name: 'In-House Kitchen',
      contactPerson: 'Chef Ramesh',
      phone: '555-1000',
      email: 'kitchen@biryaniking52.com',
      createdAt: new Date('2024-01-01'),
    },
    {
      id: '2',
      name: 'Spice Paradise Suppliers',
      contactPerson: 'Anil Kumar',
      phone: '555-2000',
      email: 'anil@spiceparadise.com',
      createdAt: new Date('2024-01-01'),
    },
    {
      id: '3',
      name: 'Fresh Farms Co.',
      contactPerson: 'Priya Sharma',
      phone: '555-3000',
      email: 'priya@freshfarms.com',
      createdAt: new Date('2024-01-01'),
    },
    {
      id: '4',
      name: 'Vendor A',
      contactPerson: 'Vendor A Contact',
      phone: '555-4000',
      email: 'vendora@example.com',
      createdAt: new Date('2024-01-01'),
    },
    {
      id: '5',
      name: 'Vendor B',
      contactPerson: 'Vendor B Contact',
      phone: '555-5000',
      email: 'vendorb@example.com',
      createdAt: new Date('2024-01-01'),
    },
    {
      id: '6',
      name: 'Vendor C',
      contactPerson: 'Vendor C Contact',
      phone: '555-6000',
      email: 'vendorc@example.com',
      createdAt: new Date('2024-01-01'),
    },
    {
      id: '7',
      name: 'Vendor D',
      contactPerson: 'Vendor D Contact',
      phone: '555-7000',
      email: 'vendord@example.com',
      createdAt: new Date('2024-01-01'),
    },
  ];

  private customers: Customer[] = [
    {
      id: '1',
      name: 'Rajesh Kumar',
      email: 'rajesh.kumar@example.com',
      phone: '9876543210',
      address: '123 Main Street, Mumbai',
      createdAt: new Date('2024-01-01'),
    },
    {
      id: '2',
      name: 'Priya Sharma',
      email: 'priya.sharma@example.com',
      phone: '9876543211',
      address: '456 Park Avenue, Delhi',
      createdAt: new Date('2024-01-01'),
    },
    {
      id: '3',
      name: 'Amit Patel',
      email: 'amit.patel@example.com',
      phone: '9876543212',
      address: '789 Business District, Bangalore',
      createdAt: new Date('2024-01-01'),
    },
  ];

  private foodItems: FoodItem[] = initializeFoodItems().map((item, index) => ({
    ...item,
    id: (index + 1).toString(),
    createdAt: new Date('2024-01-01'),
  }));

  private quotes: Quote[] = [
    {
      id: '1',
      clientName: 'John Doe',
      clientEmail: 'john@example.com',
      clientPhone: '555-0123',
      eventDate: '2024-12-15',
      eventType: 'Corporate Event',
      venueAddress: '123 Business Park, Mumbai',
      guestCount: 50,
      items: [
        { foodItemId: '1', vendorId: '1', quantity: 50 },
        { foodItemId: '4', vendorId: '1', quantity: 50 },
      ],
      status: 'pending',
      notes: 'Please arrange for vegetarian options',
      createdAt: new Date('2024-11-01'),
      updatedAt: new Date('2024-11-01'),
    },
    {
      id: '2',
      clientName: 'Jane Smith',
      clientEmail: 'jane@example.com',
      clientPhone: '555-0456',
      eventDate: '2024-12-20',
      eventType: 'Wedding',
      venueAddress: '456 Garden Palace, Delhi',
      guestCount: 150,
      items: [
        { foodItemId: '2', vendorId: '1', quantity: 150 },
        { foodItemId: '5', vendorId: '3', quantity: 150 },
      ],
      status: 'approved',
      notes: 'Outdoor venue, need delivery by 4 PM',
      createdAt: new Date('2024-11-02'),
      updatedAt: new Date('2024-11-02'),
      approvedAt: new Date('2024-11-03'),
      approvedBy: 'Admin',
    },
  ];

  // Categories
  getCategories(): Category[] {
    return [...this.categories];
  }

  addCategory(category: Omit<Category, 'id' | 'createdAt'>): Category {
    const newCategory: Category = {
      ...category,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    this.categories.push(newCategory);
    return newCategory;
  }

  updateCategory(id: string, updates: Partial<Category>): Category | null {
    const index = this.categories.findIndex(c => c.id === id);
    if (index === -1) return null;
    this.categories[index] = { ...this.categories[index], ...updates };
    return this.categories[index];
  }

  deleteCategory(id: string): boolean {
    const index = this.categories.findIndex(c => c.id === id);
    if (index === -1) return false;
    this.categories.splice(index, 1);
    return true;
  }

  // Vendors
  getVendors(): Vendor[] {
    return [...this.vendors];
  }

  addVendor(vendor: Omit<Vendor, 'id' | 'createdAt'>): Vendor {
    const newVendor: Vendor = {
      ...vendor,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    this.vendors.push(newVendor);
    return newVendor;
  }

  updateVendor(id: string, updates: Partial<Vendor>): Vendor | null {
    const index = this.vendors.findIndex(v => v.id === id);
    if (index === -1) return null;
    this.vendors[index] = { ...this.vendors[index], ...updates };
    return this.vendors[index];
  }

  deleteVendor(id: string): boolean {
    const index = this.vendors.findIndex(v => v.id === id);
    if (index === -1) return false;
    this.vendors.splice(index, 1);
    return true;
  }

  // Customers
  getCustomers(): Customer[] {
    return [...this.customers];
  }

  getCustomer(id: string): Customer | null {
    return this.customers.find(c => c.id === id) || null;
  }

  addCustomer(customer: Omit<Customer, 'id' | 'createdAt'>): Customer {
    const newCustomer: Customer = {
      ...customer,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    this.customers.push(newCustomer);
    return newCustomer;
  }

  updateCustomer(id: string, updates: Partial<Customer>): Customer | null {
    const index = this.customers.findIndex(c => c.id === id);
    if (index === -1) return null;
    this.customers[index] = { ...this.customers[index], ...updates };
    return this.customers[index];
  }

  deleteCustomer(id: string): boolean {
    const index = this.customers.findIndex(c => c.id === id);
    if (index === -1) return false;
    this.customers.splice(index, 1);
    return true;
  }

  // Food Items
  getFoodItems(): FoodItem[] {
    return [...this.foodItems];
  }

  addFoodItem(item: Omit<FoodItem, 'id' | 'createdAt'>): FoodItem {
    const newItem: FoodItem = {
      ...item,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    this.foodItems.push(newItem);
    return newItem;
  }

  bulkAddFoodItems(items: Omit<FoodItem, 'id' | 'createdAt'>[]): FoodItem[] {
    const newItems: FoodItem[] = items.map(item => ({
      ...item,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      createdAt: new Date('2024-01-01'),
    }));
    this.foodItems.push(...newItems);
    return newItems;
  }

  updateFoodItem(id: string, updates: Partial<FoodItem>): FoodItem | null {
    const index = this.foodItems.findIndex(i => i.id === id);
    if (index === -1) return null;
    this.foodItems[index] = { ...this.foodItems[index], ...updates };
    return this.foodItems[index];
  }

  deleteFoodItem(id: string): boolean {
    const index = this.foodItems.findIndex(i => i.id === id);
    if (index === -1) return false;
    this.foodItems.splice(index, 1);
    return true;
  }

  // Quotes
  getQuotes(): Quote[] {
    return [...this.quotes];
  }

  addQuote(quote: Omit<Quote, 'id' | 'createdAt' | 'updatedAt'>): Quote {
    const newQuote: Quote = {
      ...quote,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.quotes.push(newQuote);
    return newQuote;
  }

  updateQuote(id: string, updates: Partial<Quote>): Quote | null {
    const index = this.quotes.findIndex(q => q.id === id);
    if (index === -1) return null;
    this.quotes[index] = { ...this.quotes[index], ...updates, updatedAt: new Date() };
    return this.quotes[index];
  }

  deleteQuote(id: string): boolean {
    const index = this.quotes.findIndex(q => q.id === id);
    if (index === -1) return false;
    this.quotes.splice(index, 1);
    return true;
  }
}

export const dataStore = new DataStore();
