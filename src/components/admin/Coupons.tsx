import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Plus, Ticket, Percent, Calendar, ToggleLeft, ToggleRight } from 'lucide-react';

export const Coupons = () => {
  const [coupons, setCoupons] = useState([
    {
      id: 1,
      code: 'DIWALI25',
      discountType: 'percentage',
      value: 25,
      validity: '2024-12-31',
      isActive: true,
      usageCount: 45
    },
    {
      id: 2,
      code: 'FLAT100',
      discountType: 'fixed',
      value: 100,
      validity: '2024-11-30',
      isActive: true,
      usageCount: 23
    },
    {
      id: 3,
      code: 'NEWUSER15',
      discountType: 'percentage',
      value: 15,
      validity: '2024-12-15',
      isActive: false,
      usageCount: 12
    }
  ]);

  const [newCoupon, setNewCoupon] = useState({
    code: '',
    discountType: 'percentage',
    value: '',
    validity: ''
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleAddCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const coupon = {
      id: coupons.length + 1,
      ...newCoupon,
      value: parseFloat(newCoupon.value),
      isActive: true,
      usageCount: 0
    };
    setCoupons([...coupons, coupon]);
    setNewCoupon({
      code: '',
      discountType: 'percentage',
      value: '',
      validity: ''
    });
    setIsDialogOpen(false);
  };

  const toggleCouponStatus = (id: number) => {
    setCoupons(coupons.map(coupon =>
      coupon.id === id ? { ...coupon, isActive: !coupon.isActive } : coupon
    ));
  };

  const handleEditCoupon = (coupon: any) => {
    setEditingCoupon(coupon);
    setNewCoupon({
      code: coupon.code,
      discountType: coupon.discountType,
      value: coupon.value.toString(),
      validity: coupon.validity
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCoupon) {
      setCoupons(coupons.map(coupon =>
        coupon.id === editingCoupon.id
          ? {
              ...coupon,
              code: newCoupon.code,
              discountType: newCoupon.discountType,
              value: parseFloat(newCoupon.value),
              validity: newCoupon.validity
            }
          : coupon
      ));
      setNewCoupon({
        code: '',
        discountType: 'percentage',
        value: '',
        validity: ''
      });
      setEditingCoupon(null);
      setIsEditDialogOpen(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Coupon Management</h1>
          <p className="text-gray-600 mt-2">Create and manage discount coupons for your store</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white whitespace-nowrap">
              <Plus className="w-4 h-4 mr-2" />
              Add Coupon
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Coupon</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddCoupon} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code">Coupon Code</Label>
                <Input
                  id="code"
                  value={newCoupon.code}
                  onChange={(e) => setNewCoupon({...newCoupon, code: e.target.value.toUpperCase()})}
                  placeholder="e.g., DIWALI25"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="discountType">Discount Type</Label>
                <Select
                  value={newCoupon.discountType}
                  onValueChange={(value) => setNewCoupon({...newCoupon, discountType: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage</SelectItem>
                    <SelectItem value="fixed">Fixed Amount</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="value">
                  {newCoupon.discountType === 'percentage' ? 'Percentage (%)' : 'Amount (₹)'}
                </Label>
                <Input
                  id="value"
                  type="number"
                  value={newCoupon.value}
                  onChange={(e) => setNewCoupon({...newCoupon, value: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="validity">Valid Until</Label>
                <Input
                  id="validity"
                  type="date"
                  value={newCoupon.validity}
                  onChange={(e) => setNewCoupon({...newCoupon, validity: e.target.value})}
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white">
                Create Coupon
              </Button>
            </form>
          </DialogContent>
        </Dialog>

        {/* Edit Coupon Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Coupon</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleUpdateCoupon} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-code">Coupon Code</Label>
                <Input
                  id="edit-code"
                  value={newCoupon.code}
                  onChange={(e) => setNewCoupon({...newCoupon, code: e.target.value.toUpperCase()})}
                  placeholder="e.g., DIWALI25"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-discountType">Discount Type</Label>
                <Select
                  value={newCoupon.discountType}
                  onValueChange={(value) => setNewCoupon({...newCoupon, discountType: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage</SelectItem>
                    <SelectItem value="fixed">Fixed Amount</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-value">
                  {newCoupon.discountType === 'percentage' ? 'Percentage (%)' : 'Amount (₹)'}
                </Label>
                <Input
                  id="edit-value"
                  type="number"
                  value={newCoupon.value}
                  onChange={(e) => setNewCoupon({...newCoupon, value: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-validity">Valid Until</Label>
                <Input
                  id="edit-validity"
                  type="date"
                  value={newCoupon.validity}
                  onChange={(e) => setNewCoupon({...newCoupon, validity: e.target.value})}
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white">
                Update Coupon
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {coupons.map((coupon) => (
          <Card key={coupon.id} className="shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex items-start sm:items-center space-x-4 flex-1">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-red-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Ticket className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                      <h3 className="text-lg font-mono font-bold truncate">{coupon.code}</h3>
                      <Badge className={coupon.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                        {coupon.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <Percent className="w-4 h-4 text-orange-600 flex-shrink-0" />
                        <span className="font-bold text-orange-600 truncate">
                          {coupon.discountType === 'percentage' ? `${coupon.value}%` : `₹${coupon.value}`}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Calendar className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">Valid until: {coupon.validity}</span>
                      </div>
                      <div className="text-gray-600">
                        <span>Used {coupon.usageCount} times</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full lg:w-auto">
                  <Switch
                    checked={coupon.isActive}
                    onCheckedChange={() => toggleCouponStatus(coupon.id)}
                  />
                  <div className="flex gap-2 w-full sm:w-auto">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="border-blue-300 text-blue-600 hover:bg-blue-50 whitespace-nowrap flex-1 sm:flex-none"
                      onClick={() => handleEditCoupon(coupon)}
                    >
                      Edit
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="border-red-300 text-red-600 hover:bg-red-50 whitespace-nowrap flex-1 sm:flex-none"
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete this coupon?')) {
                          setCoupons(coupons.filter(c => c.id !== coupon.id));
                        }
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {coupons.length === 0 && (
        <Card className="shadow-lg">
          <CardContent className="text-center py-12">
            <Ticket className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No Coupons Created</h3>
            <p className="text-gray-500">Create your first coupon to start offering discounts.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};