import { useState, useEffect } from 'react';
import { dataStore } from '../lib/store';
import { FoodItem, Category, QuoteItem, Vendor, UserRole, MiscellaneousExpenses, MiscellaneousExpenseItem, Quote, Customer } from '../lib/types';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from './ui/command';
import { Plus, FileText, Check, ChevronsUpDown, Search } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface QuoteGeneratorProps {
  userRole: UserRole;
  quoteId?: string;
  onQuoteSaved?: () => void;
}

export function QuoteGenerator({ userRole, quoteId, onQuoteSaved }: QuoteGeneratorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
  const [customerPopoverOpen, setCustomerPopoverOpen] = useState(false);
  const [menuItemSearch, setMenuItemSearch] = useState<string>('');
  const [selectedItems, setSelectedItems] = useState<Map<string, { vendorId: string; quantity: number }>>(new Map());
  const [clientInfo, setClientInfo] = useState({
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    eventDate: '',
    eventType: '',
    venueAddress: '',
    guestCount: '',
    notes: '',
  });
  const [gst, setGst] = useState<number>(5);
  const [discount, setDiscount] = useState<number>(0);
  const [miscExpenses, setMiscExpenses] = useState<MiscellaneousExpenses>({
    transport: { quantity: 0, price: 0 },
    waiters: { quantity: 0, price: 0 },
    tables: { quantity: 0, price: 0 },
    kitchenStaff: { quantity: 0, price: 0 },
    kamlaka: { quantity: 0, price: 0 },
    ice: { quantity: 0, price: 0 },
    gas: { quantity: 0, price: 0 },
    crockeryCutlery: { quantity: 0, price: 0 },
  });

  useEffect(() => {
    setCategories(dataStore.getCategories());
    setFoodItems(dataStore.getFoodItems());
    setVendors(dataStore.getVendors());
    setCustomers(dataStore.getCustomers());
  }, []);

  useEffect(() => {
    if (quoteId && customers.length > 0) {
      const quote = dataStore.getQuotes().find(q => q.id === quoteId);
      if (quote && (quote.status === 'draft' || quote.status === 'pending' || quote.status === 'rejected')) {
        setIsEditing(true);
        loadQuoteData(quote);
      }
    } else if (!quoteId) {
      setIsEditing(false);
      setSelectedCustomerId('');
      setCustomerPopoverOpen(false);
    }
  }, [quoteId, customers]);

  const loadQuoteData = (quote: Quote) => {
    // Try to find matching customer
    const matchingCustomer = customers.find(c => 
      c.name === quote.clientName && 
      c.email === quote.clientEmail && 
      c.phone === quote.clientPhone
    );
    
    if (matchingCustomer) {
      setSelectedCustomerId(matchingCustomer.id);
    } else {
      setSelectedCustomerId('');
    }

    // Load client info
    setClientInfo({
      clientName: quote.clientName,
      clientEmail: quote.clientEmail,
      clientPhone: quote.clientPhone,
      eventDate: quote.eventDate,
      eventType: quote.eventType,
      venueAddress: quote.venueAddress,
      guestCount: quote.guestCount.toString(),
      notes: quote.notes,
    });

    // Load GST and discount
    setGst(quote.gst || 5);
    setDiscount(quote.discount || 0);

    // Load miscellaneous expenses
    if (quote.miscellaneousExpenses) {
      setMiscExpenses(quote.miscellaneousExpenses);
    }

    // Load selected items
    const itemsMap = new Map<string, { vendorId: string; quantity: number }>();
    quote.items.forEach(item => {
      itemsMap.set(item.foodItemId, {
        vendorId: item.vendorId,
        quantity: item.quantity,
      });
    });
    setSelectedItems(itemsMap);
  };

  const getItemsByCategory = (categoryId: string) => {
    let items = foodItems.filter(item => item.categoryId === categoryId);
    
    // Filter by search term if provided
    if (menuItemSearch.trim()) {
      const searchLower = menuItemSearch.toLowerCase();
      items = items.filter(item => 
        item.name.toLowerCase().includes(searchLower) ||
        item.description.toLowerCase().includes(searchLower)
      );
    }
    
    return items;
  };

  const updateQuantity = (itemId: string, vendorId: string, change: number) => {
    const newMap = new Map(selectedItems);
    const key = `${itemId}`;
    const current = newMap.get(key);
    
    if (!current) {
      if (change > 0) {
        newMap.set(key, { vendorId, quantity: change });
      }
    } else {
      const newQuantity = Math.max(0, current.quantity + change);
      if (newQuantity === 0) {
        newMap.delete(key);
      } else {
        newMap.set(key, { vendorId: current.vendorId, quantity: newQuantity });
      }
    }
    
    setSelectedItems(newMap);
  };

  const updateVendor = (itemId: string, vendorId: string) => {
    const newMap = new Map(selectedItems);
    const key = `${itemId}`;
    const current = newMap.get(key);
    if (current) {
      newMap.set(key, { ...current, vendorId });
    }
    setSelectedItems(newMap);
  };

  const handleQuantityChange = (itemId: string, vendorId: string, newQuantity: string) => {
    const newMap = new Map(selectedItems);
    const key = `${itemId}`;
    const quantity = parseInt(newQuantity) || 0;
    
    if (quantity <= 0) {
      newMap.delete(key);
    } else {
      newMap.set(key, { vendorId, quantity });
    }
    
    setSelectedItems(newMap);
  };

  const calculateTotal = () => {
    let totalCost = 0;
    let totalRetail = 0;
    
    selectedItems.forEach((data, itemId) => {
      const item = foodItems.find(i => i.id === itemId);
      if (item) {
        const vendorPrice = item.vendorPrices.find(vp => vp.vendorId === data.vendorId);
        if (vendorPrice) {
          totalCost += vendorPrice.costPrice * data.quantity;
          totalRetail += vendorPrice.retailPrice * data.quantity;
        }
      }
    });
    
    // Calculate miscellaneous expenses total
    const miscTotal = (Object.values(miscExpenses) as (MiscellaneousExpenseItem | undefined)[]).reduce((sum: number, item: MiscellaneousExpenseItem | undefined) => {
      if (!item) return sum;
      const quantity = item.quantity || 0;
      const price = item.price || 0;
      return sum + (quantity * price);
    }, 0);
    
    // Calculate subtotal after discount
    const subtotal = totalRetail;
    const discountAmount = (subtotal * discount) / 100;
    const afterDiscount = subtotal - discountAmount;
    
    // Calculate GST
    const gstAmount = (afterDiscount * gst) / 100;
    
    // Final total
    const finalTotal = afterDiscount + gstAmount + miscTotal;
    
    return { 
      totalCost, 
      totalRetail: subtotal, 
      discountAmount, 
      afterDiscount, 
      gstAmount, 
      miscTotal, 
      finalTotal 
    };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedItems.size === 0) {
      toast.error('Please select at least one food item');
      return;
    }

    const items: QuoteItem[] = Array.from(selectedItems.entries()).map(([foodItemId, data]) => ({
      foodItemId,
      vendorId: data.vendorId,
      quantity: data.quantity,
    }));

    if (isEditing && quoteId) {
      // Update existing quote
      dataStore.updateQuote(quoteId, {
        ...clientInfo,
        guestCount: parseInt(clientInfo.guestCount),
        items,
        gst,
        discount,
        miscellaneousExpenses: miscExpenses,
      });
      toast.success('Quote updated successfully!');
      if (onQuoteSaved) {
        onQuoteSaved();
      }
    } else {
      // Create new quote
      dataStore.addQuote({
        ...clientInfo,
        guestCount: parseInt(clientInfo.guestCount),
        items,
        status: 'draft',
        gst,
        discount,
        miscellaneousExpenses: miscExpenses,
      });
      toast.success('Quote created successfully!');
    }
    
    // Reset form only if creating new quote
    if (!isEditing) {
      setClientInfo({
        clientName: '',
        clientEmail: '',
        clientPhone: '',
        eventDate: '',
        eventType: '',
        venueAddress: '',
        guestCount: '',
        notes: '',
      });
      setSelectedItems(new Map());
      setGst(5);
      setDiscount(0);
      setMenuItemSearch('');
      setMiscExpenses({
        transport: { quantity: 0, price: 0 },
        waiters: { quantity: 0, price: 0 },
        tables: { quantity: 0, price: 0 },
        kitchenStaff: { quantity: 0, price: 0 },
        kamlaka: { quantity: 0, price: 0 },
        ice: { quantity: 0, price: 0 },
        gas: { quantity: 0, price: 0 },
        crockeryCutlery: { quantity: 0, price: 0 },
      });
    }
  };

  const getVendorName = (vendorId: string) => {
    return vendors.find(v => v.id === vendorId)?.name || 'Unknown';
  };

  const getPrice = (item: FoodItem, vendorId: string) => {
    const vendorPrice = item.vendorPrices.find(vp => vp.vendorId === vendorId);
    return vendorPrice || null;
  };

  const totals = calculateTotal();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-gray-900 mb-2">{isEditing ? 'Edit Quote' : 'Generate Quote'}</h1>
        <p className="text-gray-600">{isEditing ? 'Modify an existing quote' : 'Create a new quote for a client'}</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <h2 className="text-gray-900 mb-4">Client Information</h2>
              
              {/* Customer Selection */}
              <div className="mb-4 pb-4 border-b">
                <Label htmlFor="customerSelect" className="mb-2 block">Select Customer (Optional)</Label>
                <Popover open={customerPopoverOpen} onOpenChange={setCustomerPopoverOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      className="w-full justify-between"
                      type="button"
                    >
                      {selectedCustomerId
                        ? customers.find((customer) => customer.id === selectedCustomerId)?.name
                        : "Search and select customer..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                    <Command>
                      <CommandInput placeholder="Search customers..." />
                      <CommandList>
                        <CommandEmpty>No customers found.</CommandEmpty>
                        <CommandGroup>
                          {customers.map((customer) => (
                            <CommandItem
                              key={customer.id}
                              value={`${customer.name} ${customer.email} ${customer.phone}`}
                              onSelect={() => {
                                const newSelectedId = customer.id === selectedCustomerId ? '' : customer.id;
                                setSelectedCustomerId(newSelectedId);
                                if (newSelectedId) {
                                  setClientInfo({
                                    ...clientInfo,
                                    clientName: customer.name,
                                    clientEmail: customer.email,
                                    clientPhone: customer.phone,
                                    venueAddress: customer.address || '',
                                  });
                                } else {
                                  setClientInfo({
                                    ...clientInfo,
                                    clientName: '',
                                    clientEmail: '',
                                    clientPhone: '',
                                    venueAddress: '',
                                  });
                                }
                                setCustomerPopoverOpen(false);
                              }}
                            >
                              <Check
                                className={`mr-2 h-4 w-4 ${
                                  selectedCustomerId === customer.id ? "opacity-100" : "opacity-0"
                                }`}
                              />
                              <div className="flex flex-col">
                                <span className="font-medium">{customer.name}</span>
                                <span className="text-xs text-gray-500">{customer.email} • {customer.phone}</span>
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                {selectedCustomerId && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedCustomerId('');
                      setClientInfo({
                        ...clientInfo,
                        clientName: '',
                        clientEmail: '',
                        clientPhone: '',
                        venueAddress: '',
                      });
                    }}
                    className="mt-2 text-xs"
                  >
                    Clear Selection
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="clientName">Client Name</Label>
                  <Input
                    id="clientName"
                    value={clientInfo.clientName}
                    onChange={(e) => setClientInfo({ ...clientInfo, clientName: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="clientEmail">Email</Label>
                  <Input
                    id="clientEmail"
                    type="email"
                    value={clientInfo.clientEmail}
                    onChange={(e) => setClientInfo({ ...clientInfo, clientEmail: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="clientPhone">Phone</Label>
                  <Input
                    id="clientPhone"
                    type="tel"
                    value={clientInfo.clientPhone}
                    onChange={(e) => setClientInfo({ ...clientInfo, clientPhone: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="eventDate">Event Date</Label>
                  <Input
                    id="eventDate"
                    type="date"
                    value={clientInfo.eventDate}
                    onChange={(e) => setClientInfo({ ...clientInfo, eventDate: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="eventType">Event Type</Label>
                  <Select value={clientInfo.eventType} onValueChange={(value) => setClientInfo({ ...clientInfo, eventType: value })} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select event type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Corporate Event">Corporate Event</SelectItem>
                      <SelectItem value="Wedding">Wedding</SelectItem>
                      <SelectItem value="Birthday Party">Birthday Party</SelectItem>
                      <SelectItem value="Conference">Conference</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="guestCount">Guest Count</Label>
                  <Input
                    id="guestCount"
                    type="number"
                    value={clientInfo.guestCount}
                    onChange={(e) => setClientInfo({ ...clientInfo, guestCount: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="mt-4">
                <Label htmlFor="venueAddress">Venue Address</Label>
                <Textarea
                  id="venueAddress"
                  value={clientInfo.venueAddress}
                  onChange={(e) => setClientInfo({ ...clientInfo, venueAddress: e.target.value })}
                  placeholder="Full venue address..."
                  rows={2}
                  required
                />
              </div>
              <div className="mt-4">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={clientInfo.notes}
                  onChange={(e) => setClientInfo({ ...clientInfo, notes: e.target.value })}
                  placeholder="Any special requirements or notes..."
                  rows={3}
                />
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-gray-900 mb-4">Select Menu Items</h2>
              
              {/* Search Input */}
              <div className="mb-4 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search menu items by name or description..."
                  value={menuItemSearch}
                  onChange={(e) => setMenuItemSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Accordion type="multiple" className="w-full">
                {categories.map((category) => {
                  const items = getItemsByCategory(category.id);
                  if (items.length === 0) return null;
                  
                  return (
                    <AccordionItem key={category.id} value={category.id}>
                      <AccordionTrigger>
                        <div className="flex items-center justify-between flex-1 pr-4">
                          <span>{category.name}</span>
                          <span className="text-sm text-gray-500">{items.length} items</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-3 pt-2">
                          {items.map((item) => {
                            const selected = selectedItems.get(item.id);
                            const quantity = selected?.quantity || 0;
                            const selectedVendor = selected?.vendorId || item.vendorPrices[0]?.vendorId || '';
                            const pricing = getPrice(item, selectedVendor);
                            
                            return (
                              <div key={item.id} className="p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-start justify-between mb-2">
                                  <div className="flex-1">
                                    <p className="text-gray-900">{item.name}</p>
                                    <p className="text-sm text-gray-600">{item.description}</p>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Input
                                      type="number"
                                      min="0"
                                      value={quantity}
                                      onChange={(e) => handleQuantityChange(item.id, selectedVendor, e.target.value)}
                                      className="w-16 text-center"
                                      placeholder="0"
                                    />
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="sm"
                                      onClick={() => updateQuantity(item.id, selectedVendor, 1)}
                                    >
                                      <Plus className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </div>
                                {item.vendorPrices.length > 0 && (
                                  <div className="flex items-center justify-between mt-2">
                                    <Select 
                                      value={selectedVendor} 
                                      onValueChange={(value) => updateVendor(item.id, value)}
                                      disabled={quantity === 0}
                                    >
                                      <SelectTrigger className="w-[200px]">
                                        <SelectValue placeholder="Select vendor" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {item.vendorPrices.map((vp) => (
                                          <SelectItem key={vp.vendorId} value={vp.vendorId}>
                                            {getVendorName(vp.vendorId)}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                    {pricing && (
                                      <div className="text-sm">
                                        {userRole === 'admin' && (
                                          <span className="text-gray-500 mr-2">Cost: ₹{pricing.costPrice}</span>
                                        )}
                                        <span className="text-gray-900">Retail: ₹{pricing.retailPrice}</span>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            </Card>

            <Card className="p-6 mt-6">
              <h2 className="text-gray-900 mb-4">Additional Charges & Expenses</h2>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="gst">GST (%)</Label>
                    <Input
                      id="gst"
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={gst}
                      onChange={(e) => setGst(parseFloat(e.target.value) || 0)}
                      placeholder="5"
                    />
                  </div>
                  <div>
                    <Label htmlFor="discount">Discount (%)</Label>
                    <Input
                      id="discount"
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={discount}
                      onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className="border-t pt-4">
                  <Label className="text-gray-900 font-semibold mb-3 block">Miscellaneous Expenses</Label>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2 px-3 text-sm font-medium text-gray-700">Item</th>
                          <th className="text-left py-2 px-3 text-sm font-medium text-gray-700">Quantity</th>
                          <th className="text-left py-2 px-3 text-sm font-medium text-gray-700">Price</th>
                          <th className="text-right py-2 px-3 text-sm font-medium text-gray-700">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { key: 'transport', label: 'Transport' },
                          { key: 'waiters', label: 'Waiters' },
                          { key: 'tables', label: 'Tables' },
                          { key: 'kitchenStaff', label: 'Kitchen Staff' },
                          { key: 'kamlaka', label: 'Kamlaka' },
                          { key: 'ice', label: 'Ice' },
                          { key: 'gas', label: 'Gas' },
                          { key: 'crockeryCutlery', label: 'Crockery / Cutlery' },
                        ].map(({ key, label }) => {
                          const expense = miscExpenses[key as keyof MiscellaneousExpenses];
                          const quantity = expense?.quantity || 0;
                          const price = expense?.price || 0;
                          const total = quantity * price;
                          
                          return (
                            <tr key={key} className="border-b">
                              <td className="py-2 px-3 text-sm text-gray-900">{label}</td>
                              <td className="py-2 px-3">
                                <Input
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  value={quantity}
                                  onChange={(e) => {
                                    setMiscExpenses({
                                      ...miscExpenses,
                                      [key]: { ...expense, quantity: parseFloat(e.target.value) || 0, price: expense?.price || 0 },
                                    });
                                  }}
                                  className="w-20 h-8 text-sm"
                                  placeholder="0"
                                />
                              </td>
                              <td className="py-2 px-3">
                                <Input
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  value={price}
                                  onChange={(e) => {
                                    setMiscExpenses({
                                      ...miscExpenses,
                                      [key]: { ...expense, quantity: expense?.quantity || 0, price: parseFloat(e.target.value) || 0 },
                                    });
                                  }}
                                  className="w-24 h-8 text-sm"
                                  placeholder="0.00"
                                />
                              </td>
                              <td className="py-2 px-3 text-right text-sm text-gray-900 font-medium">
                                ₹{total.toFixed(2)}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-6">
              <h2 className="text-gray-900 mb-4">Quote Summary</h2>
              
              <div className="space-y-3 mb-6">
                {Array.from(selectedItems.entries()).map(([itemId, data]) => {
                  const item = foodItems.find(i => i.id === itemId);
                  if (!item) return null;
                  
                  const pricing = getPrice(item, data.vendorId);
                  if (!pricing) return null;
                  
                  return (
                    <div key={itemId} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">
                          {item.name} × {data.quantity}
                        </span>
                        <span className="text-gray-900">₹{(pricing.retailPrice * data.quantity).toFixed(2)}</span>
                      </div>
                      <div className="text-xs text-gray-500 ml-2">
                        via {getVendorName(data.vendorId)}
                      </div>
                    </div>
                  );
                })}
              </div>

              {selectedItems.size > 0 && (
                <>
                  <div className="border-t pt-4 mb-6 space-y-2">
                    {userRole === 'admin' && (
                      <>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Total Cost</span>
                          <span className="text-gray-600">₹{totals.totalCost.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Subtotal</span>
                          <span className="text-gray-900">₹{totals.totalRetail.toFixed(2)}</span>
                        </div>
                      </>
                    )}
                    {userRole !== 'admin' && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="text-gray-900">₹{totals.totalRetail.toFixed(2)}</span>
                      </div>
                    )}
                    
                    {discount > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Discount ({discount}%)</span>
                        <span className="text-red-600">-₹{totals.discountAmount.toFixed(2)}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">After Discount</span>
                      <span className="text-gray-900">₹{totals.afterDiscount.toFixed(2)}</span>
                    </div>
                    
                    {gst > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">GST ({gst}%)</span>
                        <span className="text-gray-600">₹{totals.gstAmount.toFixed(2)}</span>
                      </div>
                    )}
                    
                    {totals.miscTotal > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Miscellaneous Expenses</span>
                        <span className="text-gray-600">₹{totals.miscTotal.toFixed(2)}</span>
                      </div>
                    )}
                    
                    {userRole === 'admin' && (
                      <div className="flex justify-between text-sm pt-2 border-t">
                        <span className="text-green-600">Profit Margin</span>
                        <span className="text-green-600">₹{(totals.totalRetail - totals.totalCost).toFixed(2)}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between text-lg font-bold pt-2 border-t">
                      <span className="text-gray-900">Grand Total</span>
                      <span className="text-gray-900">₹{totals.finalTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </>
              )}

              <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700">
                <FileText className="w-4 h-4 mr-2" />
                {isEditing ? 'Update Quote' : 'Create Quote'}
              </Button>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
