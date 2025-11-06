import { useEffect, useState } from 'react';
import { Card } from './ui/card';
import { dataStore } from '../lib/store';
import { Quote } from '../lib/types';
import { FileText, CheckCircle, Clock, TrendingUp } from 'lucide-react';

interface DashboardProps {
  onNavigate: (view: string) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const [quotes, setQuotes] = useState<Quote[]>([]);

  useEffect(() => {
    setQuotes(dataStore.getQuotes());
  }, []);

  const stats = {
    total: quotes.length,
    pending: quotes.filter(q => q.status === 'pending').length,
    approved: quotes.filter(q => q.status === 'approved').length,
    inProgress: quotes.filter(q => q.status === 'in-progress').length,
  };

  const statCards = [
    { label: 'Total Quotes', value: stats.total, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Pending Approval', value: stats.pending, icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50' },
    { label: 'Approved', value: stats.approved, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'In Progress', value: stats.inProgress, icon: TrendingUp, color: 'text-orange-600', bg: 'bg-orange-50' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome to BiryaniKing52 Quotation Dashboard</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-3xl text-gray-900">{stat.value}</p>
                </div>
                <div className={`${stat.bg} p-3 rounded-lg`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-gray-900 mb-4">Recent Quotes</h2>
          <div className="space-y-3">
            {quotes.slice(0, 5).map((quote) => (
              <div key={quote.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-gray-900">{quote.clientName}</p>
                  <p className="text-sm text-gray-600">{quote.eventType} - {quote.guestCount} guests</p>
                </div>
                <div className="text-right">
                  <span className={`inline-block px-2 py-1 text-xs rounded ${
                    quote.status === 'approved' ? 'bg-green-100 text-green-700' :
                    quote.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    quote.status === 'rejected' ? 'bg-red-100 text-red-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {quote.status}
                  </span>
                  <p className="text-sm text-gray-600 mt-1">{new Date(quote.eventDate).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
          {quotes.length === 0 && (
            <p className="text-gray-500 text-center py-8">No quotes yet</p>
          )}
        </Card>

        <Card className="p-6">
          <h2 className="text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <button
              onClick={() => onNavigate('generate-quote')}
              className="w-full p-4 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-left"
            >
              <p className="mb-1">Generate New Quote</p>
              <p className="text-sm opacity-90">Create a quote for a new client</p>
            </button>
            <button
              onClick={() => onNavigate('food-items')}
              className="w-full p-4 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition-colors text-left"
            >
              <p className="mb-1">Manage Food Items</p>
              <p className="text-sm text-gray-600">Add or edit menu items</p>
            </button>
            <button
              onClick={() => onNavigate('categories')}
              className="w-full p-4 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition-colors text-left"
            >
              <p className="mb-1">Manage Categories</p>
              <p className="text-sm text-gray-600">Organize your menu</p>
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}
