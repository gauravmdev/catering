import { useState } from 'react';
import { Dashboard } from './components/Dashboard';
import { FoodItemsManager } from './components/FoodItemsManager';
import { CategoriesManager } from './components/CategoriesManager';
import { QuoteGenerator } from './components/QuoteGenerator';
import { QuotesList } from './components/QuotesList';
import { CateringTeamView } from './components/CateringTeamView';
import { VendorsManager } from './components/VendorsManager';
import { Toaster } from './components/ui/sonner';
import { Home, Package, FolderOpen, FileText, Users, Truck } from 'lucide-react';
import { UserRole } from './lib/types';
import logo from 'figma:asset/8ba9c93b4117a05c74975d26e97d8b624daa00b6.png';

type View = 'dashboard' | 'categories' | 'food-items' | 'quotes' | 'generate-quote' | 'catering-team' | 'vendors';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [userRole, setUserRole] = useState<UserRole>('admin'); // Can be changed for testing
  const [editingQuoteId, setEditingQuoteId] = useState<string | null>(null);

  const navigation = [
    { id: 'dashboard' as View, label: 'Dashboard', icon: Home },
    { id: 'categories' as View, label: 'Categories', icon: FolderOpen },
    { id: 'vendors' as View, label: 'Vendors', icon: Truck },
    { id: 'food-items' as View, label: 'Food Items', icon: Package },
    { id: 'quotes' as View, label: 'Quotes', icon: FileText },
    { id: 'generate-quote' as View, label: 'Generate Quote', icon: FileText },
    { id: 'catering-team' as View, label: 'Catering Team', icon: Users },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <img src={logo} alt="Biryani King 52" className="w-32 mx-auto mb-3" />
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">Role: <span className="text-gray-900">{userRole}</span></p>
            <select
              value={userRole}
              onChange={(e) => setUserRole(e.target.value as UserRole)}
              className="text-xs border rounded px-2 py-1"
            >
              <option value="admin">Admin</option>
              <option value="staff">Staff</option>
              <option value="catering">Catering</option>
            </select>
          </div>
        </div>
        
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => {
                      setCurrentView(item.id);
                      if (item.id === 'generate-quote') {
                        setEditingQuoteId(null);
                      }
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                      currentView === item.id
                        ? 'bg-orange-50 text-orange-600'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {currentView === 'dashboard' && <Dashboard onNavigate={setCurrentView} />}
          {currentView === 'categories' && <CategoriesManager userRole={userRole} />}
          {currentView === 'vendors' && <VendorsManager userRole={userRole} />}
          {currentView === 'food-items' && <FoodItemsManager userRole={userRole} />}
          {currentView === 'quotes' && (
            <QuotesList 
              userRole={userRole} 
              onEditQuote={(quoteId) => {
                setEditingQuoteId(quoteId);
                setCurrentView('generate-quote');
              }}
            />
          )}
          {currentView === 'generate-quote' && (
            <QuoteGenerator 
              userRole={userRole} 
              quoteId={editingQuoteId || undefined}
              onQuoteSaved={() => {
                setEditingQuoteId(null);
                setCurrentView('quotes');
              }}
            />
          )}
          {currentView === 'catering-team' && <CateringTeamView />}
        </div>
      </div>

      <Toaster />
    </div>
  );
}
