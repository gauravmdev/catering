import { useState, useEffect } from 'react';
import { dataStore } from '../lib/store';
import { Quote, FoodItem, Category, Vendor } from '../lib/types';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ChefHat, CheckCircle, Clock } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export function CateringTeamView() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const allQuotes = dataStore.getQuotes();
    // Only show approved and in-progress quotes to catering team
    setQuotes(allQuotes.filter(q => q.status === 'approved' || q.status === 'in-progress' || q.status === 'completed'));
    setFoodItems(dataStore.getFoodItems());
    setCategories(dataStore.getCategories());
    setVendors(dataStore.getVendors());
  };

  const updateQuoteStatus = (quoteId: string, status: 'in-progress' | 'completed') => {
    dataStore.updateQuote(quoteId, { status });
    loadData();
    toast.success(`Quote marked as ${status}`);
  };

  const getVendorName = (vendorId: string) => {
    return vendors.find(v => v.id === vendorId)?.name || 'Unknown';
  };

  const getItemsByCategory = (quote: Quote) => {
    const categoryMap = new Map<string, { category: Category; items: { item: FoodItem; quantity: number; vendorName: string }[] }>();

    quote.items.forEach((quoteItem) => {
      const foodItem = foodItems.find(f => f.id === quoteItem.foodItemId);
      if (!foodItem) return;

      const category = categories.find(c => c.id === foodItem.categoryId);
      if (!category) return;

      if (!categoryMap.has(category.id)) {
        categoryMap.set(category.id, { category, items: [] });
      }

      categoryMap.get(category.id)!.items.push({
        item: foodItem,
        quantity: quoteItem.quantity,
        vendorName: getVendorName(quoteItem.vendorId),
      });
    });

    return Array.from(categoryMap.values());
  };

  const approvedQuotes = quotes.filter(q => q.status === 'approved');
  const inProgressQuotes = quotes.filter(q => q.status === 'in-progress');
  const completedQuotes = quotes.filter(q => q.status === 'completed');

  const QuoteCard = ({ quote }: { quote: Quote }) => {
    const groupedItems = getItemsByCategory(quote);
    
    return (
      <Card className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-gray-900 mb-1">{quote.clientName}</h3>
            <p className="text-sm text-gray-600">{quote.eventType}</p>
            <p className="text-sm text-gray-500">{quote.clientPhone}</p>
          </div>
          <Badge className={
            quote.status === 'approved' ? 'bg-green-100 text-green-700' :
            quote.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
            'bg-purple-100 text-purple-700'
          }>
            {quote.status}
          </Badge>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Event Date:</span>
            <span className="text-gray-900">{new Date(quote.eventDate).toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Guest Count:</span>
            <span className="text-gray-900">{quote.guestCount}</span>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-1">Venue Address:</p>
          <p className="text-sm text-gray-900">{quote.venueAddress}</p>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">Menu Items</p>
          <div className="space-y-3">
            {groupedItems.map(({ category, items }) => (
              <div key={category.id}>
                <p className="text-sm text-gray-900 mb-1">{category.name}</p>
                <ul className="space-y-1 ml-4">
                  {items.map(({ item, quantity, vendorName }, index) => (
                    <li key={index} className="text-sm text-gray-600">
                      • {item.name} (qty: {quantity}) - <span className="text-xs text-gray-500">via {vendorName}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {quote.notes && (
          <div className="mb-4 p-3 bg-yellow-50 rounded">
            <p className="text-sm text-gray-600 mb-1">Special Instructions:</p>
            <p className="text-sm text-gray-900">{quote.notes}</p>
          </div>
        )}

        <div className="flex gap-2">
          {quote.status === 'approved' && (
            <Button
              size="sm"
              onClick={() => updateQuoteStatus(quote.id, 'in-progress')}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Clock className="w-4 h-4 mr-1" />
              Start Preparation
            </Button>
          )}
          {quote.status === 'in-progress' && (
            <Button
              size="sm"
              onClick={() => updateQuoteStatus(quote.id, 'completed')}
              className="bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="w-4 h-4 mr-1" />
              Mark Completed
            </Button>
          )}
        </div>
      </Card>
    );
  };

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <ChefHat className="w-8 h-8 text-orange-600" />
          <h1 className="text-gray-900">Catering Team Dashboard</h1>
        </div>
        <p className="text-gray-600">Manage approved orders and track progress</p>
      </div>

      <Tabs defaultValue="approved" className="w-full">
        <TabsList>
          <TabsTrigger value="approved">
            New Orders ({approvedQuotes.length})
          </TabsTrigger>
          <TabsTrigger value="in-progress">
            In Progress ({inProgressQuotes.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({completedQuotes.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="approved" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {approvedQuotes.map(quote => <QuoteCard key={quote.id} quote={quote} />)}
          </div>
          {approvedQuotes.length === 0 && (
            <Card className="p-12 text-center">
              <p className="text-gray-500">No new orders</p>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="in-progress" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {inProgressQuotes.map(quote => <QuoteCard key={quote.id} quote={quote} />)}
          </div>
          {inProgressQuotes.length === 0 && (
            <Card className="p-12 text-center">
              <p className="text-gray-500">No orders in progress</p>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="completed" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {completedQuotes.map(quote => <QuoteCard key={quote.id} quote={quote} />)}
          </div>
          {completedQuotes.length === 0 && (
            <Card className="p-12 text-center">
              <p className="text-gray-500">No completed orders yet</p>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
