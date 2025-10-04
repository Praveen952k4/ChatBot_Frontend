import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Textarea } from '@/components/ui/textarea';
import { Search, Package, User, CreditCard, Calendar, Eye, Edit, CheckCircle, XCircle, Trash2, MapPin, Phone, ShoppingCart } from 'lucide-react';

export const Orders = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isEditingOrder, setIsEditingOrder] = useState(false);
  const [isViewingOrder, setIsViewingOrder] = useState(false);
  const [orders, setOrders] = useState([
    {
      id: 'ORD450',
      customer: 'Rajesh Kumar',
      customerPhone: '+91 98765 43210',
      customerEmail: 'rajesh@gmail.com',
      customerAddress: '123 Main St, Mumbai, Maharashtra 400001',
      products: [
        { name: 'Premium Sparkler Pack', quantity: 2, price: 150 },
        { name: 'Flower Pot Deluxe', quantity: 1, price: 80 }
      ],
      status: 'Delivered',
      paymentStatus: 'Paid',
      paymentMethod: 'UPI',
      amount: 450,
      date: '2024-01-15',
      address: 'Mumbai, Maharashtra',
      transportationStatus: 'Paid' as 'Paid' | 'Unpaid',
      assignedBy: 'Rajesh Fireworks Co.',
      receiptNumber: '4503',
      cartonBoxes: 2,
      shippingAmount: 50,
      deliveryPoint: 'Home Delivery',
      remarks: 'Handle with care',
      captionBoxing: 'Box 1'
    },
    {
      id: 'ORD320',
      customer: 'Priya Sharma',
      customerPhone: '+91 87654 32109',
      customerEmail: 'priya@yahoo.com',
      customerAddress: '456 Park Avenue, Delhi, NCR 110001',
      products: [
        { name: 'Chakri Special', quantity: 3, price: 120 },
        { name: 'Rocket Set', quantity: 2, price: 100 }
      ],
      status: 'Processing',
      paymentStatus: 'Unpaid',
      paymentMethod: 'COD',
      amount: 320,
      date: '2024-01-14',
      address: 'Delhi, NCR',
      transportationStatus: 'Unpaid' as 'Paid' | 'Unpaid',
      assignedBy: 'Mumbai Fireworks Ltd.',
      receiptNumber: '3205',
      cartonBoxes: 1,
      shippingAmount: 75,
      deliveryPoint: 'Office Delivery',
      remarks: 'Call before delivery',
      captionBoxing: 'Box 1'
    }
  ]);
  
  const [orderFormData, setOrderFormData] = useState({
    transportationStatus: 'Unpaid' as 'Paid' | 'Unpaid',
    assignedBy: '',
    orderId: '',
    numberOfItems: '',
    receiptNumber: '',
    cartonBoxes: '',
    paymentStatus: 'Unpaid' as 'Paid' | 'Unpaid',
    shippingAmount: '',
    captionBoxing: '',
    remarks: ''
  });

  // Sample vendors for dropdown (could be fetched from suppliers)
  const vendors = [
    'Rajesh Fireworks Co.',
    'Mumbai Fireworks Ltd.',
    'Delhi Pyro Works',
    'Bangalore Crackers Co.',
    'Chennai Fireworks Hub'
  ];

  const filteredOrders = orders.filter(order =>
    order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customerPhone.includes(searchTerm) ||
    order.products.some(product => product.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const customerOrders = selectedCustomer 
    ? orders.filter(order => order.customer === selectedCustomer)
    : [];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'shipped': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'cash on delivery': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTransportationStatusColor = (status: string) => {
    return status === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  // Auto-generate receipt number when orderId or numberOfItems changes
  useEffect(() => {
    if (orderFormData.orderId && orderFormData.numberOfItems) {
      const receiptNumber = `${orderFormData.orderId}${orderFormData.numberOfItems}`;
      setOrderFormData(prev => ({ ...prev, receiptNumber }));
    } else {
      setOrderFormData(prev => ({ ...prev, receiptNumber: '' }));
    }
  }, [orderFormData.orderId, orderFormData.numberOfItems]);

  const handleDeleteOrder = (orderId: string) => {
    setOrders(orders.filter(order => order.id !== orderId));
  };

  const handleEditOrder = (order: any) => {
    setSelectedOrder(order);
    setOrderFormData({
      transportationStatus: order.transportationStatus || 'Unpaid',
      assignedBy: order.assignedBy || '',
      orderId: order.id,
      numberOfItems: order.products.length.toString(),
      receiptNumber: order.receiptNumber || '',
      cartonBoxes: order.cartonBoxes?.toString() || '',
      paymentStatus: order.paymentStatus === 'Paid' ? 'Paid' : 'Unpaid',
      shippingAmount: order.shippingAmount?.toString() || '',
      captionBoxing: order.captionBoxing || '',
      remarks: order.remarks || ''
    });
    setIsEditingOrder(true);
  };

  const handleViewOrder = (order: any) => {
    setSelectedOrder(order);
    setIsViewingOrder(true);
  };

  const handleSaveOrder = () => {
    setOrders(orders.map(order => 
      order.id === selectedOrder.id 
        ? {
            ...order,
            transportationStatus: orderFormData.transportationStatus,
            assignedBy: orderFormData.assignedBy,
            receiptNumber: orderFormData.receiptNumber,
            cartonBoxes: parseInt(orderFormData.cartonBoxes) || 0,
            paymentStatus: orderFormData.paymentStatus,
            shippingAmount: parseInt(orderFormData.shippingAmount) || 0,
            captionBoxing: orderFormData.captionBoxing,
            remarks: orderFormData.remarks
          }
        : order
    ));
    setIsEditingOrder(false);
    setSelectedOrder(null);
  };

  const renderTransportationStatusIcon = (status: 'Paid' | 'Unpaid') => {
    if (status === 'Paid') {
      return (
        <div className="flex items-center space-x-2">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <Badge className="bg-green-100 text-green-800">Paid</Badge>
        </div>
      );
    } else {
      return (
        <div className="flex items-center space-x-2">
          <XCircle className="w-5 h-5 text-red-600" />
          <Badge className="bg-red-100 text-red-800">Unpaid</Badge>
        </div>
      );
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center space-x-2">
          <ShoppingCart className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold text-gradient">Order Management 📦</h1>
        </div>
        <p className="text-muted-foreground">Track and manage customer orders efficiently</p>
      </div>

      {/* Search Card */}
      <Card className="border-border/50 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center space-x-2 text-lg">
            <Search className="w-5 h-5 text-primary" />
            <span>Search Orders</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search by order ID, customer name, phone, or product..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-border/30 focus:border-primary"
            />
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((order) => (
          <Card key={order.id} className="border-l-4 border-l-primary shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-background to-muted/20">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Order Basic Info */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-md">
                        <Package className="w-6 h-6 text-primary-foreground" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-foreground">#{order.id}</h3>
                        <p className="text-sm text-muted-foreground flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {order.date}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Badge className={getStatusColor(order.status)} variant="secondary">
                        {order.status}
                      </Badge>
                      <Badge className={getPaymentStatusColor(order.paymentStatus)} variant="secondary">
                        {order.paymentStatus}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-sm">
                        <User className="w-4 h-4 text-primary" />
                        <span className="font-medium">{order.customer}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <Phone className="w-4 h-4 text-primary" />
                        <span>{order.customerPhone}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <MapPin className="w-4 h-4 text-primary" />
                        <span>{order.address}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-sm">
                        <CreditCard className="w-4 h-4 text-primary" />
                        <span className="font-bold text-primary">₹{order.amount}</span>
                        <span className="text-muted-foreground">via {order.paymentMethod}</span>
                      </div>
                      <div className="text-sm">
                        <span className="font-medium text-foreground">Products: </span>
                        <span className="text-muted-foreground">
                          {order.products.map((product, idx) => (
                            <span key={idx}>
                              {product.name} ({product.quantity}x)
                              {idx < order.products.length - 1 ? ', ' : ''}
                            </span>
                          ))}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium">Transport:</span>
                        {renderTransportationStatusIcon(order.transportationStatus)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons - Enhanced Design */}
                <div className="lg:col-span-2 flex flex-col justify-center">
                  <div className="grid grid-cols-3 gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewOrder(order)}
                      className="flex flex-col items-center space-y-1 h-auto py-3 border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200"
                    >
                      <Eye className="w-5 h-5" />
                      <span className="text-xs font-medium">View</span>
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditOrder(order)}
                      className="flex flex-col items-center space-y-1 h-auto py-3 border-orange-200 text-orange-600 hover:bg-orange-50 hover:border-orange-300 transition-all duration-200"
                    >
                      <Edit className="w-5 h-5" />
                      <span className="text-xs font-medium">Edit</span>
                    </Button>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex flex-col items-center space-y-1 h-auto py-3 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-all duration-200"
                        >
                          <Trash2 className="w-5 h-5" />
                          <span className="text-xs font-medium">Delete</span>
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Order</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete order #{order.id}? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => handleDeleteOrder(order.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                  
                  {/* Additional Info Row */}
                  <div className="mt-3 text-center">
                    <p className="text-xs text-muted-foreground">
                      Assigned to: <span className="font-medium">{order.assignedBy}</span>
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredOrders.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No Orders Found</h3>
              <p className="text-muted-foreground">Try adjusting your search criteria or add new orders</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Edit Order Dialog */}
      <Dialog open={isEditingOrder} onOpenChange={setIsEditingOrder}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Order Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 mt-4">
            {/* Transportation Status */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">Transportation Status</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Select
                    value={orderFormData.transportationStatus}
                    onValueChange={(value: 'Paid' | 'Unpaid') => setOrderFormData({...orderFormData, transportationStatus: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Paid">Paid</SelectItem>
                      <SelectItem value="Unpaid">Unpaid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  {renderTransportationStatusIcon(orderFormData.transportationStatus)}
                </div>
              </div>
            </div>

            {/* Assigned By (Vendor Selection) */}
            <div className="space-y-2">
              <Label htmlFor="assignedBy">Assigned By (Vendor)</Label>
              <Select
                value={orderFormData.assignedBy}
                onValueChange={(value) => setOrderFormData({...orderFormData, assignedBy: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select vendor" />
                </SelectTrigger>
                <SelectContent>
                  {vendors.map((vendor) => (
                    <SelectItem key={vendor} value={vendor}>
                      {vendor}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Receipt Number Generation */}
            <div className="space-y-4">
              <Label className="text-base font-semibold">Receipt Information</Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="orderId">Order ID</Label>
                  <Input
                    id="orderId"
                    value={orderFormData.orderId}
                    onChange={(e) => setOrderFormData({...orderFormData, orderId: e.target.value})}
                    placeholder="ORD001"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="numberOfItems">Number of Items</Label>
                  <Input
                    id="numberOfItems"
                    type="number"
                    value={orderFormData.numberOfItems}
                    onChange={(e) => setOrderFormData({...orderFormData, numberOfItems: e.target.value})}
                    placeholder="3"
                    min="1"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="receiptNumber">Receipt Number (Auto-generated)</Label>
                  <Input
                    id="receiptNumber"
                    value={orderFormData.receiptNumber}
                    placeholder="Will be auto-generated"
                    readOnly
                    className="bg-gray-50"
                  />
                </div>
              </div>
            </div>

             {/* Carton Box (Shipped Quantity) */}
             <div className="space-y-2">
               <Label htmlFor="cartonBoxes">Carton Box (Shipped Qty)</Label>
               <Input
                 id="cartonBoxes"
                 type="number"
                 value={orderFormData.cartonBoxes}
                 onChange={(e) => setOrderFormData({...orderFormData, cartonBoxes: e.target.value})}
                 placeholder="Enter number of cartons/boxes shipped"
                 min="1"
               />
             </div>

             {/* Payment Status */}
             <div className="space-y-2">
               <Label htmlFor="paymentStatus">Payment Status</Label>
               <Select
                 value={orderFormData.paymentStatus}
                 onValueChange={(value: 'Paid' | 'Unpaid') => setOrderFormData({...orderFormData, paymentStatus: value})}
               >
                 <SelectTrigger>
                   <SelectValue placeholder="Select payment status" />
                 </SelectTrigger>
                 <SelectContent>
                   <SelectItem value="Paid">Paid</SelectItem>
                   <SelectItem value="Unpaid">Unpaid</SelectItem>
                 </SelectContent>
               </Select>
             </div>

             {/* Shipping Amount */}
             <div className="space-y-2">
               <Label htmlFor="shippingAmount">Shipping Amount (₹)</Label>
               <Input
                 id="shippingAmount"
                 type="number"
                 value={orderFormData.shippingAmount}
                 onChange={(e) => setOrderFormData({...orderFormData, shippingAmount: e.target.value})}
                 placeholder="Enter shipping amount based on location"
                 min="0"
               />
             </div>

             {/* Caption Boxing */}
             <div className="space-y-2">
               <Label htmlFor="captionBoxing">Caption Boxing</Label>
               <Input
                 id="captionBoxing"
                 value={orderFormData.captionBoxing}
                 onChange={(e) => setOrderFormData({...orderFormData, captionBoxing: e.target.value})}
                 placeholder="e.g., Box 1, Box 2 for large orders"
               />
             </div>

             {/* Remarks */}
             <div className="space-y-2">
               <Label htmlFor="remarks">Remarks</Label>
               <Textarea
                 id="remarks"
                 value={orderFormData.remarks}
                 onChange={(e) => setOrderFormData({...orderFormData, remarks: e.target.value})}
                 placeholder="Additional notes or remarks"
                 rows={3}
               />
             </div>

            {/* Form Actions */}
            <div className="flex space-x-4 pt-6 border-t">
              <Button
                onClick={handleSaveOrder}
                className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
              >
                Save Changes
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditingOrder(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
         </DialogContent>
       </Dialog>

       {/* Order View Dialog */}
       <Dialog open={isViewingOrder} onOpenChange={setIsViewingOrder}>
         <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
           <DialogHeader>
             <DialogTitle>Order Details - #{selectedOrder?.id}</DialogTitle>
           </DialogHeader>
           {selectedOrder && (
             <div className="space-y-6 mt-4">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <Card>
                   <CardHeader>
                     <CardTitle className="text-lg">Shop Information</CardTitle>
                   </CardHeader>
                   <CardContent className="space-y-2">
                     <p><strong>Shop Name:</strong> {selectedOrder.assignedBy}</p>
                     <p><strong>Order Number:</strong> #{selectedOrder.id}</p>
                   </CardContent>
                 </Card>
                 
                 <Card>
                   <CardHeader>
                     <CardTitle className="text-lg">Customer Information</CardTitle>
                   </CardHeader>
                   <CardContent className="space-y-2">
                     <p><strong>Buyer Name:</strong> {selectedOrder.customer}</p>
                     <p><strong>Phone Number:</strong> {selectedOrder.customerPhone}</p>
                     <p><strong>Email:</strong> {selectedOrder.customerEmail}</p>
                     <p><strong>Address:</strong> {selectedOrder.customerAddress}</p>
                     <p><strong>Delivery Point:</strong> {selectedOrder.deliveryPoint}</p>
                   </CardContent>
                 </Card>
               </div>

               <Card>
                 <CardHeader>
                   <CardTitle className="text-lg">Products</CardTitle>
                 </CardHeader>
                 <CardContent>
                   <Table>
                     <TableHeader>
                       <TableRow>
                         <TableHead>Product Name</TableHead>
                         <TableHead>Quantity</TableHead>
                         <TableHead>Price</TableHead>
                         <TableHead>Total</TableHead>
                       </TableRow>
                     </TableHeader>
                     <TableBody>
                       {selectedOrder.products.map((product: any, index: number) => (
                         <TableRow key={index}>
                           <TableCell>{product.name}</TableCell>
                           <TableCell>{product.quantity}</TableCell>
                           <TableCell>₹{product.price}</TableCell>
                           <TableCell>₹{product.quantity * product.price}</TableCell>
                         </TableRow>
                       ))}
                     </TableBody>
                   </Table>
                 </CardContent>
               </Card>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <Card>
                   <CardHeader>
                     <CardTitle className="text-lg">Payment Information</CardTitle>
                   </CardHeader>
                   <CardContent className="space-y-2">
                     <p><strong>Total Cost:</strong> ₹{selectedOrder.amount}</p>
                     <p><strong>Payment Method:</strong> {selectedOrder.paymentMethod}</p>
                     <p><strong>Payment Status:</strong> 
                       <Badge className={`ml-2 ${getPaymentStatusColor(selectedOrder.paymentStatus)}`}>
                         {selectedOrder.paymentStatus}
                       </Badge>
                     </p>
                     <p><strong>Receipt Number:</strong> {selectedOrder.receiptNumber}</p>
                     <p><strong>Shipping Amount:</strong> ₹{selectedOrder.shippingAmount}</p>
                   </CardContent>
                 </Card>
                 
                 <Card>
                   <CardHeader>
                     <CardTitle className="text-lg">Additional Information</CardTitle>
                   </CardHeader>
                   <CardContent className="space-y-2">
                     <p><strong>Transportation Status:</strong> {renderTransportationStatusIcon(selectedOrder.transportationStatus)}</p>
                     <p><strong>Caption Boxing:</strong> {selectedOrder.captionBoxing || `Box ${selectedOrder.cartonBoxes}`}</p>
                     <p><strong>Remarks:</strong> {selectedOrder.remarks}</p>
                   </CardContent>
                 </Card>
               </div>
             </div>
           )}
         </DialogContent>
       </Dialog>
    </div>
  );
};
