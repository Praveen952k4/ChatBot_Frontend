import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Search, 
  Eye, 
  Trash2, 
  Package,
  User,
  Phone,
  MapPin,
  Calendar,
  CreditCard,
  FileText,
  Truck,
  AlertCircle,
  Sparkles,
  Download
} from 'lucide-react';
import { exportOrdersOnlyToExcel } from '@/utils/excelExport';
import { useToast } from '@/hooks/use-toast';

interface NewOrdersProps {
  highlightId?: string | number;
}

export const NewOrders = ({ highlightId }: NewOrdersProps) => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isViewingOrder, setIsViewingOrder] = useState(false);

  const [orders, setOrders] = useState([
    {
      id: 'ORD001',
      date: '2024-01-15',
      customerName: 'Rahul Sharma',
      contactNumber: '+91 98765 43210',
      transportationStatus: 'Paid',
      assignedBy: 'Sparkle Fireworks',
      paymentStatus: 'Paid',
      receiptNo: 'RCP001',
      boxNumber: '1',
      shippingAmount: 150,
      shopName: 'Sparkle Fireworks',
      orderNumber: 'ORD001',
      products: [
        { name: 'Premium Sparklers', quantity: 5, price: 200 },
        { name: 'Flower Pots', quantity: 3, price: 150 }
      ],
      totalCost: 1150,
      buyerEmail: 'rahul@email.com',
      buyerAddress: '123 MG Road, Mumbai, Maharashtra 400001',
      deliveryPoint: 'Home Delivery',
      paymentMethod: 'UPI',
      remark: 'Handle with care - fragile items'
    },
    {
      id: 'ORD002',
      date: '2024-01-14',
      customerName: 'Priya Patel',
      contactNumber: '+91 87654 32109',
      transportationStatus: 'Unpaid',
      assignedBy: 'Diwali Delights',
      paymentStatus: 'Unpaid',
      receiptNo: 'RCP002',
      boxNumber: '2',
      shippingAmount: 200,
      shopName: 'Diwali Delights',
      orderNumber: 'ORD002',
      products: [
        { name: 'Rocket Items', quantity: 10, price: 300 },
        { name: 'Chakkar Crackers', quantity: 5, price: 250 }
      ],
      totalCost: 3250,
      buyerEmail: 'priya@email.com',
      buyerAddress: '456 Park Street, Delhi, NCR 110001',
      deliveryPoint: 'Shop Pickup',
      paymentMethod: 'Cash on Delivery',
      remark: 'Customer prefers evening delivery'
    },
    {
      id: 'ORD003',
      date: '2024-01-13',
      customerName: 'Amit Patel',
      contactNumber: '+91 76543 21098',
      transportationStatus: 'Paid',
      assignedBy: 'Festival Fireworks',
      paymentStatus: 'Paid',
      receiptNo: 'RCP003',
      boxNumber: '3',
      shippingAmount: 120,
      shopName: 'Festival Fireworks',
      orderNumber: 'ORD003',
      products: [
        { name: 'Ground Spinners', quantity: 8, price: 180 },
        { name: 'Aerial Shots', quantity: 4, price: 400 }
      ],
      totalCost: 2040,
      buyerEmail: 'amit@hotmail.com',
      buyerAddress: '789 Garden Road, Pune, Maharashtra 411001',
      deliveryPoint: 'Home Delivery',
      paymentMethod: 'Credit Card',
      remark: 'Special occasion - anniversary celebration'
    }
  ]);

  // Handle highlighting when highlightId is provided
  useEffect(() => {
    if (highlightId) {
      const element = document.getElementById(`order-${highlightId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.classList.add('ring-2', 'ring-orange-500', 'ring-opacity-75');
        setTimeout(() => {
          element.classList.remove('ring-2', 'ring-orange-500', 'ring-opacity-75');
        }, 3000);
      }
    }
  }, [highlightId]);

  const filteredOrders = orders.filter(order =>
    order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.assignedBy.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteOrder = (orderId: string) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      setOrders(orders.filter(order => order.id !== orderId));
      toast({
        title: "Success",
        description: "Order deleted successfully!"
      });
    }
  };

  const handleViewOrder = (order: any) => {
    setSelectedOrder(order);
    setIsViewingOrder(true);
  };

  const updateOrderField = (orderId: string, field: string, value: string) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, [field]: value } : order
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid':
        return 'badge-success';
      case 'Unpaid':
        return 'badge-danger';
      default:
        return 'badge-warning';
    }
  };

  const handleExportToExcel = () => {
    exportOrdersOnlyToExcel(orders);
    toast({
      title: "Success",
      description: "Orders data exported to Excel successfully!"
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="gradient-warm rounded-lg p-6 border border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Package className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gradient">Order Management 📦</h1>
              <p className="text-muted-foreground">Track and manage all customer orders</p>
            </div>
          </div>
          <Button
            onClick={handleExportToExcel}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
          >
            <Download className="w-4 h-4" />
            Download as Excel
          </Button>
        </div>
      </div>

      {/* Search */}
      <Card className="border-border/50">
        <CardContent className="p-6">
          <div className="flex items-center space-x-2">
            <Search className="w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search orders by customer name, order ID, or shop..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Orders List ({filteredOrders.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Transportation</TableHead>
                  <TableHead>Assigned By</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Receipt No.</TableHead>
                  <TableHead>Box No.</TableHead>
                  <TableHead>Shipping</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow 
                    key={order.id} 
                    id={`order-${order.id}`}
                    className="hover:bg-muted/50"
                  >
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        {order.date}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4 text-muted-foreground" />
                        {order.customerName}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        {order.contactNumber}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Select 
                        value={order.transportationStatus} 
                        onValueChange={(value) => updateOrderField(order.id, 'transportationStatus', value)}
                      >
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Paid">Paid</SelectItem>
                          <SelectItem value="Unpaid">Unpaid</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>{order.assignedBy}</TableCell>
                    <TableCell>
                      <Select 
                        value={order.paymentStatus} 
                        onValueChange={(value) => updateOrderField(order.id, 'paymentStatus', value)}
                      >
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Paid">Paid</SelectItem>
                          <SelectItem value="Unpaid">Unpaid</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>{order.receiptNo}</TableCell>
                    <TableCell>{order.boxNumber}</TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={order.shippingAmount}
                        onChange={(e) => updateOrderField(order.id, 'shippingAmount', e.target.value)}
                        className="w-20"
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewOrder(order)}
                          className="hover:bg-primary hover:text-white"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteOrder(order.id)}
                          className="hover:bg-destructive hover:text-white"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredOrders.length === 0 && (
            <div className="text-center py-8">
              <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium text-muted-foreground">No orders found</p>
              <p className="text-sm text-muted-foreground">Try adjusting your search criteria</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* View Order Dialog */}
      <Dialog open={isViewingOrder} onOpenChange={setIsViewingOrder}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Order Details - {selectedOrder?.id}
            </DialogTitle>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-6">
              {/* Order Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border-border/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Package className="w-5 h-5" />
                      Order Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Shop Name</label>
                      <p className="font-medium">{selectedOrder.shopName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Order Number</label>
                      <p className="font-medium">{selectedOrder.orderNumber}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Total Cost</label>
                      <p className="font-medium text-primary">₹{selectedOrder.totalCost}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Receipt Number</label>
                      <p className="font-medium">{selectedOrder.receiptNo}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Shipping Amount</label>
                      <p className="font-medium">₹{selectedOrder.shippingAmount}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Customer Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Buyer Name</label>
                      <p className="font-medium">{selectedOrder.customerName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Phone Number</label>
                      <p className="font-medium">{selectedOrder.contactNumber}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Email</label>
                      <p className="font-medium">{selectedOrder.buyerEmail}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Address</label>
                      <p className="font-medium">{selectedOrder.buyerAddress}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Delivery Point</label>
                      <p className="font-medium">{selectedOrder.deliveryPoint}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Products */}
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    Products Ordered
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {selectedOrder.products.map((product: any, index: number) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-muted-foreground">Quantity: {product.quantity}</p>
                        </div>
                        <p className="font-medium">₹{product.price}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Payment & Additional Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border-border/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <CreditCard className="w-5 h-5" />
                      Payment Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Payment Method</label>
                      <p className="font-medium">{selectedOrder.paymentMethod}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Payment Status</label>
                      <Badge className={getStatusColor(selectedOrder.paymentStatus)}>
                        {selectedOrder.paymentStatus}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Additional Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Remark</label>
                      <p className="font-medium">{selectedOrder.remark}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Delete Button */}
              <div className="flex justify-end pt-4 border-t">
                <Button
                  variant="destructive"
                  onClick={() => {
                    handleDeleteOrder(selectedOrder.id);
                    setIsViewingOrder(false);
                  }}
                  className="flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Order
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
