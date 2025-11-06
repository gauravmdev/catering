import { Quote, FoodItem, Category, Vendor } from '../lib/types';
import { Button } from './ui/button';
import { Printer } from 'lucide-react';
import logo from 'figma:asset/8ba9c93b4117a05c74975d26e97d8b624daa00b6.png';

interface QuotePrintProps {
  quote: Quote;
  foodItems: FoodItem[];
  categories: Category[];
  vendors: Vendor[];
}

export function QuotePrint({ quote, foodItems, categories, vendors }: QuotePrintProps) {
  const handlePrint = () => {
    window.print();
  };

  const getItemsByCategory = () => {
    const categoryMap = new Map<string, { category: Category; items: { item: FoodItem; quantity: number; vendorName: string }[] }>();

    quote.items.forEach((quoteItem) => {
      const foodItem = foodItems.find(f => f.id === quoteItem.foodItemId);
      if (!foodItem) return;

      const category = categories.find(c => c.id === foodItem.categoryId);
      if (!category) return;

      const vendor = vendors.find(v => v.id === quoteItem.vendorId);
      const vendorName = vendor?.name || 'Unknown Vendor';

      if (!categoryMap.has(category.id)) {
        categoryMap.set(category.id, { category, items: [] });
      }

      categoryMap.get(category.id)!.items.push({
        item: foodItem,
        quantity: quoteItem.quantity,
        vendorName,
      });
    });

    return Array.from(categoryMap.values());
  };

  const groupedItems = getItemsByCategory();

  return (
    <div>
      <div className="mb-4 print:hidden">
        <Button onClick={handlePrint} className="bg-orange-600 hover:bg-orange-700">
          <Printer className="w-4 h-4 mr-2" />
          Print Quote
        </Button>
      </div>

      <div className="bg-white p-8 print:p-0" id="printable-quote">
        <div className="mb-8 text-center border-b pb-6">
          <img src={logo} alt="Biryani King 52" className="w-32 mx-auto mb-4" />
          <h1 className="text-3xl text-gray-900 mb-2">Catering Quote</h1>
          <p className="text-gray-600">The Legacy Continues</p>
        </div>

        <div className="mb-8">
          <h2 className="text-xl text-gray-900 mb-4">Event Details</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Client Name</p>
              <p className="text-gray-900">{quote.clientName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Event Date</p>
              <p className="text-gray-900">{new Date(quote.eventDate).toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Event Type</p>
              <p className="text-gray-900">{quote.eventType}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Number of Guests</p>
              <p className="text-gray-900">{quote.guestCount}</p>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-600">Venue Address</p>
            <p className="text-gray-900">{quote.venueAddress}</p>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl text-gray-900 mb-4">Menu</h2>
          {groupedItems.map(({ category, items }) => (
            <div key={category.id} className="mb-6">
              <h3 className="text-lg text-gray-900 mb-3 border-b pb-2">{category.name}</h3>
              <div className="space-y-2">
                {items.map(({ item, quantity }, index) => (
                  <div key={index} className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </div>
                    <div className="text-right ml-4">
                      <p className="text-gray-900">Quantity: {quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {quote.notes && (
          <div className="mb-8">
            <h2 className="text-xl text-gray-900 mb-4">Special Instructions</h2>
            <p className="text-gray-700">{quote.notes}</p>
          </div>
        )}

        <div className="mb-8">
          <h2 className="text-xl text-gray-900 mb-4">Pricing Summary</h2>
          
          {(() => {
            // Calculate totals
            let subtotal = 0;
            groupedItems.forEach(({ items }) => {
              items.forEach(({ item, quantity, vendorName }) => {
                const vendor = vendors.find(v => v.name === vendorName);
                if (vendor) {
                  const vendorPrice = item.vendorPrices.find(vp => vp.vendorId === vendor.id);
                  if (vendorPrice) {
                    subtotal += vendorPrice.retailPrice * quantity;
                  }
                }
              });
            });

            const discount = quote.discount || 0;
            const discountAmount = (subtotal * discount) / 100;
            const afterDiscount = subtotal - discountAmount;
            const gst = quote.gst || 0;
            const gstAmount = (afterDiscount * gst) / 100;
            const miscExpenses = quote.miscellaneousExpenses || {};
            const miscTotal = Object.values(miscExpenses).reduce((sum, item) => {
              if (!item) return sum;
              const quantity = item.quantity || 0;
              const price = item.price || 0;
              return sum + (quantity * price);
            }, 0);
            const grandTotal = afterDiscount + gstAmount + miscTotal;

            return (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900">₹{subtotal.toFixed(2)}</span>
                </div>
                
                {discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Discount ({discount}%)</span>
                    <span className="text-red-600">-₹{discountAmount.toFixed(2)}</span>
                  </div>
                )}
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">After Discount</span>
                  <span className="text-gray-900">₹{afterDiscount.toFixed(2)}</span>
                </div>
                
                {gst > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">GST ({gst}%)</span>
                    <span className="text-gray-600">₹{gstAmount.toFixed(2)}</span>
                  </div>
                )}
                
                {miscTotal > 0 && (
                  <>
                    <div className="border-t pt-2 mt-2">
                      <p className="text-sm font-semibold text-gray-900 mb-2">Miscellaneous Expenses:</p>
                      <table className="w-full border-collapse mt-2">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-1 px-2 text-xs font-medium text-gray-700">Item</th>
                            <th className="text-right py-1 px-2 text-xs font-medium text-gray-700">Qty</th>
                            <th className="text-right py-1 px-2 text-xs font-medium text-gray-700">Price</th>
                            <th className="text-right py-1 px-2 text-xs font-medium text-gray-700">Total</th>
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
                            const expense = miscExpenses[key as keyof typeof miscExpenses];
                            if (!expense || (!expense.quantity && !expense.price)) return null;
                            
                            const quantity = expense.quantity || 0;
                            const price = expense.price || 0;
                            const total = quantity * price;
                            
                            if (total === 0) return null;
                            
                            return (
                              <tr key={key} className="border-b">
                                <td className="py-1 px-2 text-xs text-gray-900">{label}</td>
                                <td className="py-1 px-2 text-right text-xs text-gray-600">{quantity}</td>
                                <td className="py-1 px-2 text-right text-xs text-gray-600">₹{price.toFixed(2)}</td>
                                <td className="py-1 px-2 text-right text-xs text-gray-900 font-medium">₹{total.toFixed(2)}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                        <tfoot>
                          <tr className="border-t">
                            <td colSpan={3} className="py-1 px-2 text-right text-xs font-semibold text-gray-900">Total Miscellaneous</td>
                            <td className="py-1 px-2 text-right text-xs font-semibold text-gray-900">₹{miscTotal.toFixed(2)}</td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </>
                )}
                
                <div className="flex justify-between text-lg font-bold pt-2 border-t mt-2">
                  <span className="text-gray-900">Grand Total</span>
                  <span className="text-gray-900">₹{grandTotal.toFixed(2)}</span>
                </div>
              </div>
            );
          })()}
        </div>

        <div className="border-t pt-6">
          <p className="text-sm text-gray-600 text-center">
            Thank you for choosing Biryani King 52. We look forward to making your event memorable!
          </p>
          <p className="text-sm text-gray-600 text-center mt-2">
            For questions, please contact us at info@biryaniking52.com or (555) 123-4567
          </p>
        </div>
      </div>

      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-quote, #printable-quote * {
            visibility: visible;
          }
          #printable-quote {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
