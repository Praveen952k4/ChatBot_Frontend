
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Store, Sparkles, TrendingUp, Users, Package, Plus, Search, Filter, Trash2 } from 'lucide-react';
import { getAllStates, getDistrictsForState } from '@/data/indianStatesDistricts';
import { getPickupPoints } from '@/data/tamilNaduDistricts';

interface DeliveryPoint {
  id: number;
  state: string;
  district: string;
  pickupPoint: string;
  enabled: boolean;
  createdAt: Date;
}

interface DashboardProps {
  suppliers: any[];
  products: any[];
  onSectionChange: (section: string, highlightId?: string | number) => void;
}

export const Dashboard = ({ suppliers, products, onSectionChange }: DashboardProps) => {
  const [deliveryPoints, setDeliveryPoints] = useState<DeliveryPoint[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  
  // Form states
  const [selectedState, setSelectedState] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [pickupPoint, setPickupPoint] = useState('');

  const handleSaveDeliveryPoint = () => {
    if (!selectedState || !selectedDistrict || !pickupPoint.trim()) return;

    const newDeliveryPoint: DeliveryPoint = {
      id: Date.now(),
      state: selectedState,
      district: selectedDistrict,
      pickupPoint: pickupPoint.trim(),
      enabled: true,
      createdAt: new Date()
    };

    setDeliveryPoints(prev => [...prev, newDeliveryPoint]);
    
    // Reset form
    setSelectedState('');
    setSelectedDistrict('');
    setPickupPoint('');
    setIsDialogOpen(false);
  };

  const handleDeletePoint = (id: number) => {
    setDeliveryPoints(prev => prev.filter(point => point.id !== id));
  };

  const handleToggleEnabled = (id: number) => {
    setDeliveryPoints(prev => 
      prev.map(point => 
        point.id === id ? { ...point, enabled: !point.enabled } : point
      )
    );
  };

  // Filter and sort delivery points
  const filteredAndSortedPoints = deliveryPoints
    .filter(point => 
      point.pickupPoint.toLowerCase().includes(searchTerm.toLowerCase()) ||
      point.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
      point.state.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortOrder) {
        case 'az':
          return a.pickupPoint.localeCompare(b.pickupPoint);
        case 'za':
          return b.pickupPoint.localeCompare(a.pickupPoint);
        case 'oldest':
          return a.createdAt.getTime() - b.createdAt.getTime();
        case 'newest':
        default:
          return b.createdAt.getTime() - a.createdAt.getTime();
      }
    });

  return (
    <div className="p-6 space-y-8 h-full overflow-y-auto">
      {/* Festive Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-2">
          <Sparkles className="w-8 h-8 text-primary animate-pulse" />
          <h1 className="text-3xl font-bold text-gradient">🎉 Login Successfully! 🎉</h1>
          <Sparkles className="w-8 h-8 text-secondary animate-pulse" />
        </div>
        <p className="text-muted-foreground text-lg">Welcome to your festive cracker store dashboard! 🎆</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="gradient-warm border-0 shadow-festive card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-primary">🏪 Total Suppliers</CardTitle>
            <Store className="h-6 w-6 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary mb-2">{suppliers.length}</div>
            <div className="flex items-center space-x-1">
              <TrendingUp className="h-4 w-4 text-success" />
              <p className="text-sm text-success">Active suppliers ready</p>
            </div>
          </CardContent>
        </Card>

        <Card className="gradient-warm border-0 shadow-festive card-hover opacity-75">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-secondary">🎆 Products</CardTitle>
            <Package className="h-6 w-6 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-secondary mb-2">{products.length}</div>
            <p className="text-sm text-muted-foreground">Festive items</p>
          </CardContent>
        </Card>

        <Card className="gradient-warm border-0 shadow-festive card-hover opacity-75">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-accent">👥 Customers</CardTitle>
            <Users className="h-6 w-6 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-accent mb-2">847</div>
            <p className="text-sm text-muted-foreground">Happy customers</p>
          </CardContent>
        </Card>
      </div>

      {/* Add Delivery Points Section */}
      <Card className="border-0 shadow-festive">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gradient flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5" />
              <span>🚚 Delivery Points Management</span>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center space-x-2 bg-primary hover:bg-primary/90 text-white">
                  <Plus className="w-4 h-4" />
                  <span>Add Delivery Point</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Add New Delivery Point</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="state">Select State</Label>
                    <Select value={selectedState} onValueChange={(value) => {
                      setSelectedState(value);
                      setSelectedDistrict(''); // Reset district when state changes
                    }}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a state" />
                      </SelectTrigger>
                      <SelectContent>
                        {getAllStates().map((state) => (
                          <SelectItem key={state} value={state}>
                            {state}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="district">Select District</Label>
                    <Select 
                      value={selectedDistrict} 
                      onValueChange={setSelectedDistrict}
                      disabled={!selectedState}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a district" />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedState && getDistrictsForState(selectedState).map((district) => (
                          <SelectItem key={district} value={district}>
                            {district}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="pickupPoint">Customer Pickup Point</Label>
                    <Input
                      id="pickupPoint"
                      value={pickupPoint}
                      onChange={(e) => setPickupPoint(e.target.value)}
                      placeholder="Enter pickup point name"
                    />
                  </div>

                  <Button 
                    onClick={handleSaveDeliveryPoint}
                    disabled={!selectedState || !selectedDistrict || !pickupPoint.trim()}
                    className="w-full"
                  >
                    Save Delivery Point
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Search and Filter Controls */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search delivery points..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <Select value={sortOrder} onValueChange={setSortOrder}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="az">Alphabetical (A-Z)</SelectItem>
                  <SelectItem value="za">Alphabetical (Z-A)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Delivery Points List */}
          {deliveryPoints.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No delivery points added yet. Click "Add Delivery Point" to get started.</p>
            </div>
          ) : (
            <ScrollArea className="h-80">
              <div className="space-y-3">
                {filteredAndSortedPoints.map((point) => (
                  <div
                    key={point.id}
                    className="flex items-center justify-between p-4 border rounded-lg bg-background/50"
                  >
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-foreground truncate">
                        {point.pickupPoint}
                      </h4>
                      <p className="text-sm text-muted-foreground truncate">
                        {point.district}, {point.state}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Added {point.createdAt.toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-3 flex-shrink-0">
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={point.enabled}
                          onCheckedChange={() => handleToggleEnabled(point.id)}
                        />
                        <span className="text-xs text-muted-foreground">
                          {point.enabled ? 'Enabled' : 'Disabled'}
                        </span>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeletePoint(point.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}

          {filteredAndSortedPoints.length !== deliveryPoints.length && (
            <p className="text-sm text-muted-foreground mt-4">
              Showing {filteredAndSortedPoints.length} of {deliveryPoints.length} delivery points
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
