import { useState, useEffect } from 'react';
import { dataStore } from '../lib/store';
import { Quote, FoodItem, Category, QuoteStatus, Vendor, UserRole } from '../lib/types';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Eye, Printer, CheckCircle, XCircle, Search, Edit } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { QuotePrint } from './QuotePrint';

interface QuotesListProps {
  userRole: UserRole;
  onEditQuote?: (quoteId: string) => void;
}

export function QuotesList({ userRole, onEditQuote }: QuotesListProps) {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isPrintDialogOpen, setIsPrintDialogOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setQuotes(dataStore.getQuotes());
    setFoodItems(dataStore.getFoodItems());
    setCategories(dataStore.getCategories());
    setVendors(dataStore.getVendors());
  };

  const updateQuoteStatus = (quoteId: string, status: QuoteStatus) => {
    const updates: Partial<Quote> = { status };
    if (status === 'approved') {
      updates.approvedAt = new Date();
      updates.approvedBy = 'Admin';
    }
    dataStore.updateQuote(quoteId, updates);
    loadData();
    toast.success(`Quote ${status} successfully`);
  };

  const calculateQuoteTotal = (quote: Quote) => {
    let totalCost = 0;
    let totalRetail = 0;

    quote.items.forEach((item) => {
      const foodItem = foodItems.find(f => f.id === item.foodItemId);
      if (foodItem) {
        const vendorPrice = foodItem.vendorPrices.find(vp => vp.vendorId === item.vendorId);
        if (vendorPrice) {
          totalCost += vendorPrice.costPrice * item.quantity;
          totalRetail += vendorPrice.retailPrice * item.quantity;
        }
      }
    });

    return { totalCost, totalRetail };
  };

  const getStatusColor = (status: QuoteStatus) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'rejected': return 'bg-red-100 text-red-700';
      case 'in-progress': return 'bg-blue-100 text-blue-700';
      case 'completed': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getVendorName = (vendorId: string) => {
    return vendors.find(v => v.id === vendorId)?.name || 'Unknown';
  };

  // Search filter
  const filteredQuotes = quotes.filter(quote => {
    const matchesSearch = searchTerm === '' || 
      quote.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.clientPhone.includes(searchTerm) ||
      quote.eventType.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || quote.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const groupedQuotes = {
    pending: filteredQuotes.filter(q => q.status === 'pending'),
    approved: filteredQuotes.filter(q => q.status === 'approved'),
    inProgress: filteredQuotes.filter(q => q.status === 'in-progress'),
    completed: filteredQuotes.filter(q => q.status === 'completed'),
  };

  const QuoteCard = ({ quote }: { quote: Quote }) => {
    const totals = calculateQuoteTotal(quote);
    
    return (
      <Card className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-gray-900 mb-1">{quote.clientName}</h3>
            <p className="text-sm text-gray-600">{quote.eventType}</p>
            <p className="text-sm text-gray-500">{quote.clientPhone}</p>
          </div>
          <Badge className={getStatusColor(quote.status)}>
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
          {userRole === 'admin' && (
            <>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total Cost:</span>
                <span className="text-gray-900">₹{totals.totalCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total Retail:</span>
                <span className="text-gray-900">₹{totals.totalRetail.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-green-600">Profit:</span>
                <span className="text-green-600">₹{(totals.totalRetail - totals.totalCost).toFixed(2)}</span>
              </div>
            </>
          )}
          {userRole === 'staff' && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Total:</span>
              <span className="text-gray-900">₹{totals.totalRetail.toFixed(2)}</span>
            </div>
          )}
        </div>

        <div className="flex gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedQuote(quote);
              setIsViewDialogOpen(true);
            }}
          >
            <Eye className="w-4 h-4 mr-1" />
            View
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedQuote(quote);
              setIsPrintDialogOpen(true);
            }}
          >
            <Printer className="w-4 h-4 mr-1" />
            Print
          </Button>
          {(quote.status === 'draft' || quote.status === 'pending' || quote.status === 'rejected') && onEditQuote && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEditQuote(quote.id)}
            >
              <Edit className="w-4 h-4 mr-1" />
              Edit
            </Button>
          )}
          {quote.status === 'pending' && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => updateQuoteStatus(quote.id, 'approved')}
              >
                <CheckCircle className="w-4 h-4 mr-1" />
                Approve
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => updateQuoteStatus(quote.id, 'rejected')}
              >
                <XCircle className="w-4 h-4 mr-1" />
                Reject
              </Button>
            </>
          )}
        </div>
      </Card>
    );
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-gray-900 mb-2">Quotes</h1>
          <p className="text-gray-600">Manage all quotes</p>
        </div>
      </div>

      <Card className="p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search by name, phone, or event type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Quotes</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All ({filteredQuotes.length})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({groupedQuotes.pending.length})</TabsTrigger>
          <TabsTrigger value="approved">Approved ({groupedQuotes.approved.length})</TabsTrigger>
          <TabsTrigger value="in-progress">In Progress ({groupedQuotes.inProgress.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({groupedQuotes.completed.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredQuotes.map(quote => <QuoteCard key={quote.id} quote={quote} />)}
          </div>
        </TabsContent>

        <TabsContent value="pending" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groupedQuotes.pending.map(quote => <QuoteCard key={quote.id} quote={quote} />)}
          </div>
        </TabsContent>

        <TabsContent value="approved" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groupedQuotes.approved.map(quote => <QuoteCard key={quote.id} quote={quote} />)}
          </div>
        </TabsContent>

        <TabsContent value="in-progress" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groupedQuotes.inProgress.map(quote => <QuoteCard key={quote.id} quote={quote} />)}
          </div>
        </TabsContent>

        <TabsContent value="completed" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groupedQuotes.completed.map(quote => <QuoteCard key={quote.id} quote={quote} />)}
          </div>
        </TabsContent>
      </Tabs>

      {filteredQuotes.length === 0 && (
        <Card className="p-12 text-center mt-6">
          <p className="text-gray-500">No quotes found</p>
        </Card>
      )}

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Quote Details</DialogTitle>
            <DialogDescription>
              View complete quote information and pricing details
            </DialogDescription>
          </DialogHeader>
          {selectedQuote && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Client Name</p>
                  <p className="text-gray-900">{selectedQuote.clientName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="text-gray-900">{selectedQuote.clientEmail}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="text-gray-900">{selectedQuote.clientPhone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Event Date</p>
                  <p className="text-gray-900">{new Date(selectedQuote.eventDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Event Type</p>
                  <p className="text-gray-900">{selectedQuote.eventType}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Guest Count</p>
                  <p className="text-gray-900">{selectedQuote.guestCount}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-1">Venue Address</p>
                <p className="text-gray-900">{selectedQuote.venueAddress}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-2">Menu Items</p>
                <div className="space-y-2">
                  {selectedQuote.items.map((item, index) => {
                    const foodItem = foodItems.find(f => f.id === item.foodItemId);
                    if (!foodItem) return null;
                    
                    const vendorPrice = foodItem.vendorPrices.find(vp => vp.vendorId === item.vendorId);
                    if (!vendorPrice) return null;

                    return (
                      <div key={index} className="p-2 bg-gray-50 rounded">
                        <div className="flex justify-between">
                          <span className="text-gray-900">{foodItem.name} × {item.quantity}</span>
                          <span className="text-gray-900">₹{(vendorPrice.retailPrice * item.quantity).toFixed(2)}</span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Vendor: {getVendorName(item.vendorId)}
                          {userRole === 'admin' && (
                            <span className="ml-2">
                              (Cost: ₹{vendorPrice.costPrice} / Retail: ₹{vendorPrice.retailPrice})
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="border-t pt-4">
                {(() => {
                  const totals = calculateQuoteTotal(selectedQuote);
                  return (
                    <>
                      {userRole === 'admin' && (
                        <>
                          <div className="flex justify-between mb-2">
                            <span className="text-gray-600">Total Cost</span>
                            <span className="text-gray-900">₹{totals.totalCost.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between mb-2">
                            <span className="text-gray-600">Total Retail</span>
                            <span className="text-gray-900">₹{totals.totalRetail.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-green-600">Profit Margin</span>
                            <span className="text-green-600">₹{(totals.totalRetail - totals.totalCost).toFixed(2)}</span>
                          </div>
                        </>
                      )}
                      {userRole === 'staff' && (
                        <div className="flex justify-between">
                          <span className="text-gray-900">Total</span>
                          <span className="text-gray-900">₹{totals.totalRetail.toFixed(2)}</span>
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>

              {selectedQuote.notes && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">Notes</p>
                  <p className="text-gray-900">{selectedQuote.notes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Print Dialog */}
      <Dialog open={isPrintDialogOpen} onOpenChange={setIsPrintDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Print Quote</DialogTitle>
            <DialogDescription>
              Print or save quote for client (prices excluded)
            </DialogDescription>
          </DialogHeader>
          {selectedQuote && (
            <QuotePrint 
              quote={selectedQuote} 
              foodItems={foodItems}
              categories={categories}
              vendors={vendors}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
