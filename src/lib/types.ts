export interface Category {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
}

export interface Vendor {
  id: string;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  createdAt: Date;
}

export interface VendorPrice {
  vendorId: string;
  costPrice: number;
  retailPrice: number;
}

export type DietType = 'veg' | 'non-veg';

export interface FoodItem {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  diet: DietType;
  vendorPrices: VendorPrice[];
  createdAt: Date;
}

export interface QuoteItem {
  foodItemId: string;
  vendorId: string;
  quantity: number;
}

export type QuoteStatus = 'draft' | 'pending' | 'approved' | 'rejected' | 'in-progress' | 'completed';

export interface MiscellaneousExpenseItem {
  quantity?: number;
  price?: number;
}

export interface MiscellaneousExpenses {
  transport?: MiscellaneousExpenseItem;
  waiters?: MiscellaneousExpenseItem;
  tables?: MiscellaneousExpenseItem;
  kitchenStaff?: MiscellaneousExpenseItem;
  kamlaka?: MiscellaneousExpenseItem;
  ice?: MiscellaneousExpenseItem;
  gas?: MiscellaneousExpenseItem;
  crockeryCutlery?: MiscellaneousExpenseItem;
}

export interface Quote {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  eventDate: string;
  eventType: string;
  venueAddress: string;
  guestCount: number;
  items: QuoteItem[];
  status: QuoteStatus;
  notes: string;
  gst?: number;
  discount?: number;
  miscellaneousExpenses?: MiscellaneousExpenses;
  createdAt: Date;
  updatedAt: Date;
  approvedAt?: Date;
  approvedBy?: string;
}

export type UserRole = 'admin' | 'staff' | 'catering';
