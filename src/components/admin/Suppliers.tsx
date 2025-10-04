import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Search, Plus, Store, Phone, Mail, MapPin, Star, ArrowLeft, User, Building2, Shield, Clock } from 'lucide-react';

interface Supplier {
  id: number;
  name: string;
  shopName: string;
  contact: string;
  email: string;
  location: string;
  experience: string;
  categories: string[];
  city?: string;
  district?: string;
  state?: string;
  shopQuality?: string;
  shopAddress?: string;
  supplierAddress?: string;
  supplierUsername?: string;
  password?: string;
}

interface SuppliersProps {
  suppliers: Supplier[];
  setSuppliers: React.Dispatch<React.SetStateAction<Supplier[]>>;
  highlightId?: string | number;
}

export const Suppliers = ({ suppliers, setSuppliers, highlightId }: SuppliersProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [newSupplier, setNewSupplier] = useState({
    name: '',
    contact: '',
    city: '',
    district: '',
    state: '',
    shopName: '',
    shopQuality: '',
    shopAddress: '',
    supplierAddress: '',
    supplierUsername: '',
    password: '',
    experience: '',
    categories: ''
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [blockedSuppliers, setBlockedSuppliers] = useState<number[]>([]);

  // Scroll to highlighted supplier when highlightId changes
  useEffect(() => {
    if (highlightId) {
      const element = document.getElementById(`supplier-${highlightId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [highlightId]);

  const filteredSuppliers = suppliers.filter(supplier =>
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.shopName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.contact.includes(searchTerm) ||
    (supplier.city && supplier.city.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (supplier.district && supplier.district.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAddSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    const supplier = {
      id: suppliers.length + 1,
      ...newSupplier,
      email: `${newSupplier.supplierUsername}@crackers.com`,
      location: `${newSupplier.city}, ${newSupplier.district}, ${newSupplier.state}`,
      categories: newSupplier.categories.split(',').map(cat => cat.trim())
    };
    setSuppliers([...suppliers, supplier]);
    setNewSupplier({
      name: '',
      contact: '',
      city: '',
      district: '',
      state: '',
      shopName: '',
      shopQuality: '',
      shopAddress: '',
      supplierAddress: '',
      supplierUsername: '',
      password: '',
      experience: '',
      categories: ''
    });
    setIsDialogOpen(false);
  };

  const toggleSupplierBlock = (id: number) => {
    if (blockedSuppliers.includes(id)) {
      setBlockedSuppliers(blockedSuppliers.filter(supplierId => supplierId !== id));
    } else {
      setBlockedSuppliers([...blockedSuppliers, id]);
    }
  };

  const shopQualityOptions = [
    'Premium Quality',
    'High Quality',
    'Good Quality',
    'Standard Quality',
    'Budget Quality'
  ];

  const states = [
    'Tamil Nadu',
    'Karnataka',
    'Kerala',
    'Andhra Pradesh',
    'Telangana',
    'Maharashtra',
    'Gujarat',
    'Rajasthan',
    'Delhi',
    'West Bengal'
  ];

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Supplier Management</h1>
          <p className="text-gray-600 mt-2">Manage your cracker suppliers and vendors</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white whitespace-nowrap">
              <Plus className="w-4 h-4 mr-2" />
              Add Supplier
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <Store className="w-5 h-5 text-orange-600" />
                <span>Register New Supplier</span>
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddSupplier} className="space-y-6">
              {/* Back Button */}
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                className="flex items-center space-x-2 mb-4"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Suppliers</span>
              </Button>
              
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                  <User className="w-5 h-5 text-orange-600" />
                  <span>Personal Information</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Supplier Name *</Label>
                    <Input
                      id="name"
                      value={newSupplier.name}
                      onChange={(e) => setNewSupplier({...newSupplier, name: e.target.value})}
                      placeholder="Enter supplier full name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact">Phone Number *</Label>
                    <Input
                      id="contact"
                      value={newSupplier.contact}
                      onChange={(e) => setNewSupplier({...newSupplier, contact: e.target.value})}
                      placeholder="+91 98765 43210"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={newSupplier.city}
                      onChange={(e) => setNewSupplier({...newSupplier, city: e.target.value})}
                      placeholder="Enter city name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="district">District *</Label>
                    <Input
                      id="district"
                      value={newSupplier.district}
                      onChange={(e) => setNewSupplier({...newSupplier, district: e.target.value})}
                      placeholder="Enter district name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State *</Label>
                    <Select
                      value={newSupplier.state}
                      onValueChange={(value) => setNewSupplier({...newSupplier, state: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        {states.map((state) => (
                          <SelectItem key={state} value={state}>{state}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="experience">Years of Experience *</Label>
                    <Input
                      id="experience"
                      value={newSupplier.experience}
                      onChange={(e) => setNewSupplier({...newSupplier, experience: e.target.value})}
                      placeholder="e.g., 10 years"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="supplierAddress">Supplier Address *</Label>
                  <Textarea
                    id="supplierAddress"
                    value={newSupplier.supplierAddress}
                    onChange={(e) => setNewSupplier({...newSupplier, supplierAddress: e.target.value})}
                    placeholder="Enter complete supplier address"
                    rows={3}
                    required
                  />
                </div>
              </div>

              {/* Shop Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                  <Building2 className="w-5 h-5 text-orange-600" />
                  <span>Shop Information</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="shopName">Shop Name *</Label>
                    <Input
                      id="shopName"
                      value={newSupplier.shopName}
                      onChange={(e) => setNewSupplier({...newSupplier, shopName: e.target.value})}
                      placeholder="Enter shop name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="shopQuality">Shop Quality *</Label>
                    <Select
                      value={newSupplier.shopQuality}
                      onValueChange={(value) => setNewSupplier({...newSupplier, shopQuality: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select shop quality" />
                      </SelectTrigger>
                      <SelectContent>
                        {shopQualityOptions.map((quality) => (
                          <SelectItem key={quality} value={quality}>{quality}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shopAddress">Shop Address *</Label>
                  <Textarea
                    id="shopAddress"
                    value={newSupplier.shopAddress}
                    onChange={(e) => setNewSupplier({...newSupplier, shopAddress: e.target.value})}
                    placeholder="Enter complete shop address"
                    rows={3}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="categories">Product Categories *</Label>
                  <Input
                    id="categories"
                    placeholder="e.g., Sparklers, Rockets, Flower Pots"
                    value={newSupplier.categories}
                    onChange={(e) => setNewSupplier({...newSupplier, categories: e.target.value})}
                    required
                  />
                </div>
              </div>

              {/* Account Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-orange-600" />
                  <span>Account Information</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="supplierUsername">Supplier Username *</Label>
                    <Input
                      id="supplierUsername"
                      value={newSupplier.supplierUsername}
                      onChange={(e) => setNewSupplier({...newSupplier, supplierUsername: e.target.value})}
                      placeholder="Enter unique username"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password *</Label>
                    <Input
                      id="password"
                      type="password"
                      value={newSupplier.password}
                      onChange={(e) => setNewSupplier({...newSupplier, password: e.target.value})}
                      placeholder="Enter secure password"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="flex space-x-4 pt-6 border-t">
                <Button type="submit" className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white">
                  Register Supplier
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="mb-6 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="w-5 h-5 text-orange-600" />
            <span>Search Suppliers</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search by name, shop, contact, city, or district..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-orange-200 focus:border-orange-400"
            />
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {filteredSuppliers.map((supplier) => (
          <Card 
            key={supplier.id} 
            id={`supplier-${supplier.id}`}
            className={`shadow-lg hover:shadow-xl transition-shadow ${
              highlightId === supplier.id ? 'ring-2 ring-orange-500 bg-orange-50' : ''
            }`}
          >
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row justify-between gap-4">
                <div className="flex items-start space-x-4 flex-1">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-red-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Store className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                      <h3 className="text-lg font-bold text-gray-900">{supplier.name}</h3>
                      <div className="flex flex-wrap gap-2">
                        <Badge className="bg-yellow-100 text-yellow-800 w-fit">
                          <Clock className="w-3 h-3 mr-1" />
                          {supplier.experience}
                        </Badge>
                        {supplier.shopQuality && (
                          <Badge className="bg-blue-100 text-blue-800 w-fit">
                            <Star className="w-3 h-3 mr-1" />
                            {supplier.shopQuality}
                          </Badge>
                        )}
                        {blockedSuppliers.includes(supplier.id) && (
                          <Badge className="bg-red-100 text-red-800 w-fit">
                            Blocked
                          </Badge>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{supplier.shopName}</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Phone className="w-4 h-4 flex-shrink-0" />
                        <span className="break-all">{supplier.contact}</span>
                      </div>
                      {supplier.email && (
                        <div className="flex items-center space-x-2 text-gray-600">
                          <Mail className="w-4 h-4 flex-shrink-0" />
                          <span className="break-all">{supplier.email}</span>
                        </div>
                      )}
                      <div className="flex items-center space-x-2 text-gray-600">
                        <MapPin className="w-4 h-4 flex-shrink-0" />
                        <span>{supplier.location}</span>
                      </div>
                      {supplier.supplierUsername && (
                        <div className="flex items-center space-x-2 text-gray-600">
                          <User className="w-4 h-4 flex-shrink-0" />
                          <span>Username: {supplier.supplierUsername}</span>
                        </div>
                      )}
                    </div>
                    <div className="mt-3">
                      <p className="text-sm font-medium text-gray-700 mb-2">Categories:</p>
                      <div className="flex flex-wrap gap-1">
                        {supplier.categories.map((category, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {category}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2 lg:flex-shrink-0 lg:w-auto w-full">
                  <Button
                    variant="outline"
                    size="sm"
                    className={`w-full lg:w-auto whitespace-nowrap ${blockedSuppliers.includes(supplier.id) 
                      ? "border-green-300 text-green-600 hover:bg-green-50" 
                      : "border-red-300 text-red-600 hover:bg-red-50"
                    }`}
                    onClick={() => toggleSupplierBlock(supplier.id)}
                  >
                    {blockedSuppliers.includes(supplier.id) ? 'Unblock' : 'Block'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full lg:w-auto border-red-300 text-red-600 hover:bg-red-50 whitespace-nowrap"
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this supplier?')) {
                        setSuppliers(suppliers.filter(s => s.id !== supplier.id));
                      }
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredSuppliers.length === 0 && (
        <Card className="shadow-lg">
          <CardContent className="text-center py-12">
            <Store className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No Suppliers Found</h3>
            <p className="text-gray-500">No suppliers match your search criteria.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
