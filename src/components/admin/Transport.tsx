
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { 
  Truck, 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Edit3, 
  MapPin, 
  Package,
  Phone,
  User,
  Calendar,
  CreditCard,
  CheckCircle,
  Clock,
  AlertCircle,
  Trash2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getDistrictNames, getPickupPoints, getDropPoints } from '@/data/tamilNaduDistricts';

interface DeliveryBreakdown {
  id: string;
  destination: string;
  routeName: string;
  packagesAssigned: number;
  customerName: string;
  district: string;
  pickupPoint: string;
  dropPoint: string;
  chargesAmount: number;
  paymentMethod: string;
  paymentStatus: 'Paid' | 'Unpaid';
}

interface TransportOrder {
  id: string;
  orderId: string;
  vehicleType: string;
  vehicleNumber: string;
  driverName: string;
  driverContact: string;
  totalCartons: number;
  deliveries: DeliveryBreakdown[];
  status: 'Confirmed' | 'In Transit' | 'Delivered';
  createdDate: string;
  totalPackages: number;
}

// Initialize with localStorage data if available
const getStoredOrders = (): TransportOrder[] => {
  try {
    const stored = localStorage.getItem('crackers_craze_transport_orders');
    return stored ? JSON.parse(stored) : [
      {
        id: '1',
        orderId: 'TRN001',
        vehicleType: 'Mini Truck',
        vehicleNumber: 'TN01AB1234',
        driverName: 'Rajesh Kumar',
        driverContact: '9876543210',
        totalCartons: 50,
        deliveries: [
          {
            id: '1',
            destination: 'Chennai',
            routeName: 'Chennai Route',
            packagesAssigned: 25,
            customerName: 'Priya Sharma',
            district: 'Chennai',
            pickupPoint: 'Koyambedu',
            dropPoint: 'T. Nagar',
            chargesAmount: 1500,
            paymentMethod: 'Card',
            paymentStatus: 'Paid'
          }
        ],
        status: 'In Transit',
        createdDate: '2024-01-15',
        totalPackages: 25
      }
    ];
  } catch {
    return [];
  }
};

export const Transport = () => {
  const { toast } = useToast();
  const [orders, setOrders] = useState<TransportOrder[]>(getStoredOrders());

  // Save to localStorage whenever orders change
  const saveOrders = (newOrders: TransportOrder[]) => {
    setOrders(newOrders);
    localStorage.setItem('crackers_craze_transport_orders', JSON.stringify(newOrders));
  };

  // Form states
  const [isAddingOrder, setIsAddingOrder] = useState(false);
  const [isEditingOrder, setIsEditingOrder] = useState(false);
  const [editingOrderId, setEditingOrderId] = useState<string | null>(null);
  const [vehicleType, setVehicleType] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [driverName, setDriverName] = useState('');
  const [driverContact, setDriverContact] = useState('');
  const [totalCartons, setTotalCartons] = useState(0);
  const [deliveries, setDeliveries] = useState<DeliveryBreakdown[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState('');

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [paymentFilter, setPaymentFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const vehicleTypes = ['Van', 'Mini Truck', 'Lorry', 'Pickup', 'Container'];
  const paymentMethods = ['Cash', 'Card', 'Bank Transfer'];
  const districts = getDistrictNames();

  const addDeliveryBreakdown = () => {
    const newDelivery: DeliveryBreakdown = {
      id: Date.now().toString(),
      destination: '',
      routeName: '',
      packagesAssigned: 0,
      customerName: '',
      district: '',
      pickupPoint: '',
      dropPoint: '',
      chargesAmount: 0,
      paymentMethod: 'Cash',
      paymentStatus: 'Unpaid'
    };
    setDeliveries([...deliveries, newDelivery]);
  };

  const updateDelivery = (id: string, field: keyof DeliveryBreakdown, value: any) => {
    setDeliveries(deliveries.map(delivery => 
      delivery.id === id ? { 
        ...delivery, 
        [field]: value,
        // Reset pickup and drop points when district changes
        ...(field === 'district' ? { pickupPoint: '', dropPoint: '' } : {})
      } : delivery
    ));
  };

  const removeDelivery = (id: string) => {
    setDeliveries(deliveries.filter(delivery => delivery.id !== id));
  };

  const validateForm = () => {
    // Check basic vehicle and driver details
    if (!vehicleType.trim() || !vehicleNumber.trim() || !driverName.trim() || !driverContact.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill all vehicle and driver details",
        variant: "destructive"
      });
      return false;
    }

    // Validate driver contact
    if (!/^\d{10}$/.test(driverContact.trim())) {
      toast({
        title: "Validation Error",
        description: "Driver contact must be a 10-digit number",
        variant: "destructive"
      });
      return false;
    }

    // Check if at least one delivery is added
    if (deliveries.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please add at least one delivery breakdown",
        variant: "destructive"
      });
      return false;
    }

    // Check total cartons
    if (totalCartons <= 0) {
      toast({
        title: "Validation Error",
        description: "Total cartons must be greater than 0",
        variant: "destructive"
      });
      return false;
    }

    // Validate each delivery
    for (const delivery of deliveries) {
      // Check required fields
      if (!delivery.customerName.trim() || 
          !delivery.district.trim() || 
          !delivery.pickupPoint.trim() || 
          !delivery.dropPoint.trim() || 
          !delivery.routeName.trim()) {
        toast({
          title: "Validation Error",
          description: "Please fill all delivery details including customer name, district, pickup point, drop point, and route name",
          variant: "destructive"
        });
        return false;
      }

      // Check packages assigned
      if (delivery.packagesAssigned <= 0) {
        toast({
          title: "Validation Error",
          description: "Packages assigned must be greater than 0 for all deliveries",
          variant: "destructive"
        });
        return false;
      }
    }

    // Check total packages vs total cartons
    const totalPackages = deliveries.reduce((sum, delivery) => sum + delivery.packagesAssigned, 0);
    if (totalPackages > totalCartons) {
      toast({
        title: "Validation Error",
        description: `Total packages (${totalPackages}) cannot exceed total cartons (${totalCartons})`,
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const resetForm = () => {
    setVehicleType('');
    setVehicleNumber('');
    setDriverName('');
    setDriverContact('');
    setTotalCartons(0);
    setDeliveries([]);
    setEditingOrderId(null);
    setSelectedDistrict('');
  };

  const submitOrder = () => {
    if (!validateForm()) return;

    const totalPackages = deliveries.reduce((sum, delivery) => sum + delivery.packagesAssigned, 0);
    
    if (isEditingOrder && editingOrderId) {
      // Update existing order
      const updatedOrders = orders.map(order => 
        order.id === editingOrderId ? {
          ...order,
          vehicleType,
          vehicleNumber,
          driverName,
          driverContact,
          totalCartons,
          deliveries,
          totalPackages
        } : order
      );
      saveOrders(updatedOrders);
      toast({
        title: "Success",
        description: "Transport order updated successfully!"
      });
    } else {
      // Create new order
      const newOrder: TransportOrder = {
        id: Date.now().toString(),
        orderId: `TRN${String(orders.length + 1).padStart(3, '0')}`,
        vehicleType,
        vehicleNumber,
        driverName,
        driverContact,
        totalCartons,
        deliveries,
        status: 'Confirmed',
        createdDate: new Date().toISOString().split('T')[0],
        totalPackages
      };
      saveOrders([...orders, newOrder]);
      toast({
        title: "Success",
        description: `Transport order ${newOrder.orderId} created successfully!`
      });
    }

    resetForm();
    setIsAddingOrder(false);
    setIsEditingOrder(false);
  };

  const editOrder = (order: TransportOrder) => {
    setVehicleType(order.vehicleType);
    setVehicleNumber(order.vehicleNumber);
    setDriverName(order.driverName);
    setDriverContact(order.driverContact);
    setTotalCartons(order.totalCartons);
    setDeliveries(order.deliveries);
    setEditingOrderId(order.id);
    setIsEditingOrder(true);
    setIsAddingOrder(true);
  };

  const deleteOrder = (orderId: string) => {
    const updatedOrders = orders.filter(order => order.id !== orderId);
    saveOrders(updatedOrders);
    toast({
      title: "Success",
      description: "Transport order deleted successfully!"
    });
  };

  const updateOrderStatus = (orderId: string, newStatus: 'Confirmed' | 'In Transit' | 'Delivered') => {
    const updatedOrders = orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    );
    saveOrders(updatedOrders);
    toast({
      title: "Status Updated",
      description: `Order status changed to ${newStatus}`
    });
  };

  const updatePaymentStatus = (orderId: string, deliveryId: string, paymentStatus: 'Paid' | 'Unpaid') => {
    const updatedOrders = orders.map(order => 
      order.id === orderId ? {
        ...order,
        deliveries: order.deliveries.map(delivery =>
          delivery.id === deliveryId ? { ...delivery, paymentStatus } : delivery
        )
      } : order
    );
    saveOrders(updatedOrders);
    toast({
      title: "Payment Status Updated",
      description: `Payment marked as ${paymentStatus}`
    });
  };

  // Filter orders
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.driverName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || order.status === statusFilter;
    
    // Fix payment filtering logic
    let matchesPayment = true;
    if (paymentFilter === 'Paid') {
      matchesPayment = order.deliveries.every(d => d.paymentStatus === 'Paid');
    } else if (paymentFilter === 'Unpaid') {
      matchesPayment = order.deliveries.some(d => d.paymentStatus === 'Unpaid');
    }
    // If paymentFilter is 'All', matchesPayment remains true
    
    return matchesSearch && matchesStatus && matchesPayment;
  });

  // Pagination
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusBadge = (status: string) => {
    const variants = {
      'Confirmed': 'bg-blue-100 text-blue-800',
      'In Transit': 'bg-yellow-100 text-yellow-800',
      'Delivered': 'bg-green-100 text-green-800'
    };
    return variants[status as keyof typeof variants] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Confirmed': return <CheckCircle className="w-4 h-4" />;
      case 'In Transit': return <Clock className="w-4 h-4" />;
      case 'Delivered': return <Package className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-orange-50 to-red-50">
      {/* Header - Fixed */}
      <div className="flex-shrink-0 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white p-6 shadow-lg border-l-4 border-orange-500">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-orange-100 rounded-lg">
            <Truck className="w-8 h-8 text-orange-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">🚛 Transport Management</h1>
            <p className="text-gray-600">Manage deliveries, vehicles & tracking</p>
          </div>
        </div>
        
        <Button 
          onClick={() => {
            resetForm();
            setIsAddingOrder(true);
          }}
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Create Delivery Order</span>
        </Button>
      </div>

      {/* Content Area - Scrollable */}
      <div className="flex-1 overflow-auto p-6 space-y-6">
        {/* Search and Filters */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <Input
                placeholder="Search orders, drivers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="All">All Status</option>
              <option value="Confirmed">Confirmed</option>
              <option value="In Transit">In Transit</option>
              <option value="Delivered">Delivered</option>
            </select>

            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="All">All Payments</option>
              <option value="Paid">Paid</option>
              <option value="Unpaid">Unpaid</option>
            </select>

            <select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              className="border border-gray-300 rounded-md px-3 py-2"
            >
              <option value={10}>10 per page</option>
              <option value={25}>25 per page</option>
              <option value={50}>50 per page</option>
            </select>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-orange-50">
                <TableHead>Order ID</TableHead>
                <TableHead>Driver Name</TableHead>
                <TableHead>Vehicle No.</TableHead>
                <TableHead>Route Name</TableHead>
                <TableHead>Packages</TableHead>
                <TableHead>Payment Status</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedOrders.map((order) => (
                <TableRow key={order.id} className="hover:bg-orange-25">
                  <TableCell className="font-medium">{order.orderId}</TableCell>
                  <TableCell>{order.driverName}</TableCell>
                  <TableCell>{order.vehicleNumber}</TableCell>
                  <TableCell>{order.deliveries[0]?.routeName || 'Multiple Routes'}</TableCell>
                  <TableCell>{order.totalPackages}</TableCell>
                  <TableCell>
                    <Badge className={order.deliveries.every(d => d.paymentStatus === 'Paid') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                      {order.deliveries.every(d => d.paymentStatus === 'Paid') ? 'Paid' : 'Unpaid'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(order.status)}
                      <Badge className={getStatusBadge(order.status)}>
                        {order.status}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>{order.createdDate}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Order Details - {order.orderId}</DialogTitle>
                          </DialogHeader>
                          <OrderDetailsModal 
                            order={order}
                            onStatusUpdate={updateOrderStatus}
                            onPaymentUpdate={updatePaymentStatus}
                          />
                        </DialogContent>
                      </Dialog>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => editOrder(order)}
                        className="border-orange-300 text-orange-600 hover:bg-orange-50"
                      >
                        <Edit3 className="w-4 h-4" />
                      </Button>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-red-300 text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Transport Order</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete order {order.orderId}? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => deleteOrder(order.id)}>
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
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center p-4 border-t">
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <span className="px-3 py-1 text-sm">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create/Edit Order Modal */}
      <Dialog open={isAddingOrder} onOpenChange={setIsAddingOrder}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isEditingOrder ? 'Edit Transport Order' : 'Create New Transport Order'}
            </DialogTitle>
          </DialogHeader>
          <CreateOrderForm 
            vehicleType={vehicleType}
            setVehicleType={setVehicleType}
            vehicleNumber={vehicleNumber}
            setVehicleNumber={setVehicleNumber}
            driverName={driverName}
            setDriverName={setDriverName}
            driverContact={driverContact}
            setDriverContact={setDriverContact}
            totalCartons={totalCartons}
            setTotalCartons={setTotalCartons}
            deliveries={deliveries}
            addDeliveryBreakdown={addDeliveryBreakdown}
            updateDelivery={updateDelivery}
            removeDelivery={removeDelivery}
            submitOrder={submitOrder}
            vehicleTypes={vehicleTypes}
            paymentMethods={paymentMethods}
            districts={districts}
            isEditing={isEditingOrder}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Order Details Modal Component
const OrderDetailsModal = ({ order, onStatusUpdate, onPaymentUpdate }: {
  order: TransportOrder;
  onStatusUpdate: (orderId: string, status: 'Confirmed' | 'In Transit' | 'Delivered') => void;
  onPaymentUpdate: (orderId: string, deliveryId: string, paymentStatus: 'Paid' | 'Unpaid') => void;
}) => {
  return (
    <div className="space-y-6">
      {/* Vehicle Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-orange-50 rounded-lg">
        <div>
          <h3 className="font-semibold text-gray-700 mb-2">Vehicle Details</h3>
          <p><strong>Type:</strong> {order.vehicleType}</p>
          <p><strong>Number:</strong> {order.vehicleNumber}</p>
          <p><strong>Total Cartons:</strong> {order.totalCartons}</p>
        </div>
        <div>
          <h3 className="font-semibold text-gray-700 mb-2">Driver Details</h3>
          <p><strong>Name:</strong> {order.driverName}</p>
          <p><strong>Contact:</strong> {order.driverContact}</p>
          <div className="mt-2">
            <label className="block text-sm font-medium mb-1">Status:</label>
            <select
              value={order.status}
              onChange={(e) => onStatusUpdate(order.id, e.target.value as any)}
              className="border border-gray-300 rounded px-2 py-1"
            >
              <option value="Confirmed">Confirmed</option>
              <option value="In Transit">In Transit</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>
        </div>
      </div>

      {/* Deliveries */}
      <div>
        <h3 className="font-semibold text-gray-700 mb-4">Delivery Details</h3>
        {order.deliveries.map((delivery, index) => (
          <div key={delivery.id} className="border rounded-lg p-4 mb-4 bg-white">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <p><strong>Customer:</strong> {delivery.customerName}</p>
                <p><strong>District:</strong> {delivery.district}</p>
                <p><strong>Route:</strong> {delivery.routeName}</p>
              </div>
              <div>
                <p><strong>Pickup:</strong> {delivery.pickupPoint}</p>
                <p><strong>Drop Point:</strong> {delivery.dropPoint}</p>
                <p><strong>Packages:</strong> {delivery.packagesAssigned}</p>
              </div>
              <div>
                <p><strong>Amount:</strong> ₹{delivery.chargesAmount}</p>
                <p><strong>Method:</strong> {delivery.paymentMethod}</p>
                <div className="mt-2">
                  <label className="block text-sm font-medium mb-1">Payment:</label>
                  <select
                    value={delivery.paymentStatus}
                    onChange={(e) => onPaymentUpdate(order.id, delivery.id, e.target.value as any)}
                    className="border border-gray-300 rounded px-2 py-1"
                  >
                    <option value="Unpaid">Unpaid</option>
                    <option value="Paid">Paid</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Create Order Form Component with Enhanced Number Input
const CreateOrderForm = ({ ...props }: any) => {
  // Enhanced number input handler with proper manual typing support
  const handleNumberInputChange = (value: string, setter: (value: number) => void) => {
    // Handle empty string - set to 0
    if (value === '' || value === '0') {
      setter(0);
      return;
    }
    
    // Remove any non-digit characters
    const cleanValue = value.replace(/\D/g, '');
    
    // If clean value is empty after removing non-digits, set to 0
    if (cleanValue === '') {
      setter(0);
      return;
    }
    
    // Convert to number and update
    const numValue = parseInt(cleanValue, 10);
    if (!isNaN(numValue)) {
      setter(numValue);
    }
  };

  // Handle focus - select all text for easy replacement
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select();
  };

  // Handle key events for better UX
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, setter: (value: number) => void) => {
    // Allow backspace, delete, tab, escape, enter, and arrow keys
    if ([8, 9, 27, 13, 46, 37, 38, 39, 40].includes(e.keyCode) ||
        // Allow Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
        (e.keyCode === 65 && e.ctrlKey) ||
        (e.keyCode === 67 && e.ctrlKey) ||
        (e.keyCode === 86 && e.ctrlKey) ||
        (e.keyCode === 88 && e.ctrlKey)) {
      return;
    }
    
    // Ensure that it's a number
    if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
      e.preventDefault();
    }
    
    // Special handling for backspace on selected text or empty field
    if (e.keyCode === 8) {
      const input = e.target as HTMLInputElement;
      if (input.selectionStart === 0 && input.selectionEnd === input.value.length) {
        e.preventDefault();
        setter(0);
        setTimeout(() => {
          input.value = '';
        }, 0);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Vehicle Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Vehicle Type <span className="text-red-500">*</span></label>
          <select
            value={props.vehicleType}
            onChange={(e) => props.setVehicleType(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            required
          >
            <option value="">Select Vehicle Type</option>
            {props.vehicleTypes.map((type: string) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Vehicle Number <span className="text-red-500">*</span></label>
          <Input
            value={props.vehicleNumber}
            onChange={(e) => props.setVehicleNumber(e.target.value)}
            placeholder="TN01AB1234"
            className="focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Driver Name <span className="text-red-500">*</span></label>
          <Input
            value={props.driverName}
            onChange={(e) => props.setDriverName(e.target.value)}
            placeholder="Driver name"
            className="focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Driver Contact Number <span className="text-red-500">*</span></label>
          <Input
            value={props.driverContact}
            onChange={(e) => props.setDriverContact(e.target.value)}
            placeholder="10-digit mobile number"
            pattern="[0-9]{10}"
            maxLength={10}
            className="focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            required
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Total Cartons for Delivery <span className="text-red-500">*</span></label>
          <Input
            type="number"
            value={props.totalCartons || ''}
            onChange={(e) => handleNumberInputChange(e.target.value, props.setTotalCartons)}
            onFocus={handleFocus}
            onKeyDown={(e) => handleKeyDown(e, props.setTotalCartons)}
            placeholder="Enter total cartons"
            min="0"
            className="focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            required
          />
        </div>
      </div>

      {/* Delivery Breakdown */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Delivery Breakdown</h3>
          <Button
            onClick={props.addDeliveryBreakdown}
            variant="outline"
            className="flex items-center space-x-2 border-orange-300 text-orange-600 hover:bg-orange-50"
          >
            <Plus className="w-4 h-4" />
            <span>Add Delivery</span>
          </Button>
        </div>

        {props.deliveries.map((delivery: DeliveryBreakdown, index: number) => (
          <div key={delivery.id} className="border rounded-lg p-4 mb-4 bg-gray-50">
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-medium">Delivery #{index + 1}</h4>
              {props.deliveries.length > 1 && (
                <Button
                  onClick={() => props.removeDelivery(delivery.id)}
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-800 border-red-300 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">District <span className="text-red-500">*</span></label>
                <select
                  value={delivery.district}
                  onChange={(e) => props.updateDelivery(delivery.id, 'district', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="">Select District</option>
                  {props.districts.map((district: string) => (
                    <option key={district} value={district}>{district}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Pickup Point <span className="text-red-500">*</span></label>
                <select
                  value={delivery.pickupPoint}
                  onChange={(e) => props.updateDelivery(delivery.id, 'pickupPoint', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  disabled={!delivery.district}
                >
                  <option value="">Select Pickup Point</option>
                  {delivery.district && getPickupPoints(delivery.district).map((point: string) => (
                    <option key={point} value={point}>{point}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Drop Point <span className="text-red-500">*</span></label>
                <select
                  value={delivery.dropPoint}
                  onChange={(e) => props.updateDelivery(delivery.id, 'dropPoint', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  disabled={!delivery.district}
                >
                  <option value="">Select Drop Point</option>
                  {delivery.district && getDropPoints(delivery.district).map((point: string) => (
                    <option key={point} value={point}>{point}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Route Name <span className="text-red-500">*</span></label>
                <Input
                  value={delivery.routeName}
                  onChange={(e) => props.updateDelivery(delivery.id, 'routeName', e.target.value)}
                  placeholder="e.g., Chennai Route"
                  className="focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Packages Assigned <span className="text-red-500">*</span></label>
                <Input
                  type="number"
                  value={delivery.packagesAssigned || ''}
                  onChange={(e) => handleNumberInputChange(e.target.value, (value) => props.updateDelivery(delivery.id, 'packagesAssigned', value))}
                  onFocus={handleFocus}
                  onKeyDown={(e) => handleKeyDown(e, (value) => props.updateDelivery(delivery.id, 'packagesAssigned', value))}
                  placeholder="Enter packages"
                  min="0"
                  className="focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Customer Name <span className="text-red-500">*</span></label>
                <Input
                  value={delivery.customerName}
                  onChange={(e) => props.updateDelivery(delivery.id, 'customerName', e.target.value)}
                  placeholder="Customer name"
                  className="focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Charges Amount</label>
                <Input
                  type="number"
                  value={delivery.chargesAmount || ''}
                  onChange={(e) => handleNumberInputChange(e.target.value, (value) => props.updateDelivery(delivery.id, 'chargesAmount', value))}
                  onFocus={handleFocus}
                  onKeyDown={(e) => handleKeyDown(e, (value) => props.updateDelivery(delivery.id, 'chargesAmount', value))}
                  placeholder="Amount in ₹"
                  min="0"
                  className="focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Payment Method</label>
                <select
                  value={delivery.paymentMethod}
                  onChange={(e) => props.updateDelivery(delivery.id, 'paymentMethod', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  {props.paymentMethods.map((method: string) => (
                    <option key={method} value={method}>{method}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Payment Status</label>
                <select
                  value={delivery.paymentStatus}
                  onChange={(e) => props.updateDelivery(delivery.id, 'paymentStatus', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="Unpaid">Unpaid</option>
                  <option value="Paid">Paid</option>
                </select>
              </div>
            </div>
          </div>
        ))}

        {props.deliveries.length === 0 && (
          <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <Package className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-lg font-medium mb-2">No delivery breakdown added yet</p>
            <p>Click "Add Delivery" to create your first delivery breakdown</p>
          </div>
        )}
      </div>

      {/* Submit Button */}
      <div className="flex justify-end space-x-4 pt-4 border-t">
        <Button
          onClick={() => {
            props.setVehicleType('');
            props.setVehicleNumber('');
            props.setDriverName('');
            props.setDriverContact('');
            props.setTotalCartons(0);
            props.setDeliveries([]);
          }}
          variant="outline"
          className="border-gray-300 text-gray-600 hover:bg-gray-50"
        >
          Reset Form
        </Button>
        <Button
          onClick={props.submitOrder}
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2"
          disabled={props.deliveries.length === 0}
        >
          {props.isEditing ? 'Update Transport Order' : 'Create Transport Order'}
        </Button>
      </div>
    </div>
  );
};
