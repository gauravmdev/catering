import { useState, useEffect } from 'react';
import { dataStore } from '../lib/store';
import { FoodItem, Category, Vendor, VendorPrice, UserRole, DietType } from '../lib/types';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Plus, Pencil, Trash2, Search, X } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface FoodItemsManagerProps {
  userRole: UserRole;
}

export function FoodItemsManager({ userRole }: FoodItemsManagerProps) {
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<FoodItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    categoryId: '',
    diet: 'veg' as DietType,
  });
  const [vendorPrices, setVendorPrices] = useState<VendorPrice[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setFoodItems(dataStore.getFoodItems());
    setCategories(dataStore.getCategories());
    setVendors(dataStore.getVendors());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (vendorPrices.length === 0) {
      toast.error('Please add at least one vendor with pricing');
      return;
    }

    const itemData = {
      ...formData,
      vendorPrices,
    };

    if (editingItem) {
      dataStore.updateFoodItem(editingItem.id, itemData);
      toast.success('Food item updated successfully');
    } else {
      dataStore.addFoodItem(itemData);
      toast.success('Food item added successfully');
    }
    
    loadData();
    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = (id: string) => {
    dataStore.deleteFoodItem(id);
    toast.success('Food item deleted successfully');
    loadData();
  };

  const openEditDialog = (item: FoodItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      categoryId: item.categoryId,
      diet: item.diet,
    });
    setVendorPrices([...item.vendorPrices]);
    setIsDialogOpen(true);
  };

  const addVendorPrice = () => {
    setVendorPrices([...vendorPrices, { vendorId: '', costPrice: 0, retailPrice: 0 }]);
  };

  const updateVendorPrice = (index: number, field: keyof VendorPrice, value: string | number) => {
    const updated = [...vendorPrices];
    if (field === 'vendorId') {
      updated[index][field] = value as string;
    } else {
      updated[index][field] = parseFloat(value as string) || 0;
    }
    setVendorPrices(updated);
  };

  const removeVendorPrice = (index: number) => {
    setVendorPrices(vendorPrices.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    setFormData({ name: '', description: '', categoryId: '', diet: 'veg' });
    setVendorPrices([]);
    setEditingItem(null);
  };

  const filteredItems = foodItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || item.categoryId === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryName = (categoryId: string) => {
    return categories.find(c => c.id === categoryId)?.name || 'Unknown';
  };

  const getVendorName = (vendorId: string) => {
    return vendors.find(v => v.id === vendorId)?.name || 'Unknown';
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-gray-900 mb-2">Food Items</h1>
          <p className="text-gray-600">Manage your menu items</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button className="bg-orange-600 hover:bg-orange-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Food Item
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-auto">
            <DialogHeader>
              <DialogTitle>{editingItem ? 'Edit Food Item' : 'Add New Food Item'}</DialogTitle>
              <DialogDescription>
                {editingItem ? 'Update food item details and vendor pricing' : 'Add a new food item with vendor pricing'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Item Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Chicken Biryani"
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of the dish"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={formData.categoryId} onValueChange={(value) => setFormData({ ...formData, categoryId: value })} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="diet">Diet Type</Label>
                <Select value={formData.diet} onValueChange={(value: DietType) => setFormData({ ...formData, diet: value })} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select diet type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="veg">Veg</SelectItem>
                    <SelectItem value="non-veg">Non-Veg</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Vendor Pricing</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addVendorPrice}>
                    <Plus className="w-4 h-4 mr-1" />
                    Add Vendor
                  </Button>
                </div>
                <div className="space-y-3">
                  {vendorPrices.map((vp, index) => (
                    <Card key={index} className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="flex-1 space-y-3">
                          <div>
                            <Label>Vendor</Label>
                            <Select 
                              value={vp.vendorId} 
                              onValueChange={(value) => updateVendorPrice(index, 'vendorId', value)}
                              required
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select vendor" />
                              </SelectTrigger>
                              <SelectContent>
                                {vendors.map((vendor) => (
                                  <SelectItem key={vendor.id} value={vendor.id}>
                                    {vendor.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <Label>Cost Price (₹)</Label>
                              <Input
                                type="number"
                                step="0.01"
                                value={vp.costPrice}
                                onChange={(e) => updateVendorPrice(index, 'costPrice', e.target.value)}
                                placeholder="0.00"
                                required
                              />
                            </div>
                            <div>
                              <Label>Retail Price (₹)</Label>
                              <Input
                                type="number"
                                step="0.01"
                                value={vp.retailPrice}
                                onChange={(e) => updateVendorPrice(index, 'retailPrice', e.target.value)}
                                placeholder="0.00"
                                required
                              />
                            </div>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeVendorPrice(index)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                  {vendorPrices.length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-4">No vendors added yet</p>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-orange-600 hover:bg-orange-700">
                  {editingItem ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search food items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Diet</TableHead>
              <TableHead>Vendors & Pricing</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.name}</TableCell>
                <TableCell className="max-w-md truncate">{item.description}</TableCell>
                <TableCell>
                  <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                    {getCategoryName(item.categoryId)}
                  </span>
                </TableCell>
                <TableCell>
                  <span className={`inline-block px-2 py-1 text-xs rounded ${
                    item.diet === 'veg' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {item.diet === 'veg' ? '🟢 Veg' : '🔴 Non-Veg'}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    {item.vendorPrices.map((vp, idx) => (
                      <div key={idx} className="text-sm">
                        <span className="text-gray-600">{getVendorName(vp.vendorId)}:</span>{' '}
                        {userRole === 'admin' && (
                          <span className="text-gray-500">Cost: ₹{vp.costPrice.toFixed(2)} / </span>
                        )}
                        <span className="text-gray-900">Retail: ₹{vp.retailPrice.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditDialog(item)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete "{item.name}".
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(item.id)} className="bg-red-600 hover:bg-red-700">
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No food items found</p>
          </div>
        )}
      </Card>
    </div>
  );
}
