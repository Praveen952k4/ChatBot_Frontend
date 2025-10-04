
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Search, Users, Phone, Trash2, Calendar, MapPin, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { exportCustomersToExcel } from '@/utils/excelExport';

interface Customer {
  id: number;
  name: string;
  mobile: string;
  email: string;
  address: string;
  registrationDate: string;
  totalOrders: number;
  totalSpent?: number;
  status: 'Active' | 'Inactive';
}

export const Customers = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Enhanced customer data with total spent information
  const [customers, setCustomers] = useState<Customer[]>([
    {
      id: 1,
      name: 'Rajesh Kumar',
      mobile: '+91 98765 43210',
      email: 'rajesh@gmail.com',
      address: '123 Main St, Mumbai, Maharashtra 400001',
      registrationDate: '2024-01-15',
      totalOrders: 5,
      totalSpent: 15750,
      status: 'Active'
    },
    {
      id: 2,
      name: 'Priya Sharma',
      mobile: '+91 87654 32109',
      email: 'priya@yahoo.com',
      address: '456 Park Avenue, Delhi, NCR 110001',
      registrationDate: '2024-01-10',
      totalOrders: 3,
      totalSpent: 8900,
      status: 'Active'
    },
    {
      id: 3,
      name: 'Amit Patel',
      mobile: '+91 76543 21098',
      email: 'amit@hotmail.com',
      address: '789 Garden Road, Pune, Maharashtra 411001',
      registrationDate: '2024-01-05',
      totalOrders: 1,
      totalSpent: 2500,
      status: 'Inactive'
    },
    {
      id: 4,
      name: 'Sunita Reddy',
      mobile: '+91 65432 10987',
      email: 'sunita@gmail.com',
      address: '321 Temple Street, Chennai, Tamil Nadu 600001',
      registrationDate: '2024-01-20',
      totalOrders: 7,
      totalSpent: 22300,
      status: 'Active'
    },
    {
      id: 5,
      name: 'Vikash Singh',
      mobile: '+91 54321 09876',
      email: 'vikash@yahoo.com',
      address: '654 Market Road, Kolkata, West Bengal 700001',
      registrationDate: '2024-01-12',
      totalOrders: 2,
      totalSpent: 4750,
      status: 'Active'
    }
  ]);

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.mobile.includes(searchTerm) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteCustomer = (customerId: number) => {
    setCustomers(customers.filter(customer => customer.id !== customerId));
    toast({
      title: "Success",
      description: "Customer deleted successfully!"
    });
  };

  const getStatusBadge = (status: string) => {
    return status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
  };

  const handleExportToExcel = () => {
    // Create sample orders data for calculation purposes
    const sampleOrders: any[] = [];
    exportCustomersToExcel(customers, sampleOrders);
    
    toast({
      title: "Success",
      description: "Customer data exported to Excel successfully!"
    });
  };

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-orange-50 to-red-50 min-h-screen">
      {/* Header */}
      <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-orange-500">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-orange-100 rounded-lg">
              <Users className="w-8 h-8 text-orange-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">👥 Customer Management</h1>
              <p className="text-gray-600">View and manage customer registrations</p>
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
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="w-5 h-5 text-orange-600" />
            <span>Search Customers</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search by name, mobile, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-orange-200 focus:border-orange-400"
            />
          </div>
        </CardContent>
      </Card>

      {/* Customer List */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Customer Registration Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-orange-50">
                <TableHead>Customer Name</TableHead>
                <TableHead>Mobile Number</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Registration Date</TableHead>
                <TableHead>Total Orders</TableHead>
                <TableHead>Total Spent</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map((customer) => (
                <TableRow key={customer.id} className="hover:bg-orange-25">
                  <TableCell className="font-medium">{customer.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span>{customer.mobile}</span>
                    </div>
                  </TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span className="max-w-xs truncate">{customer.address}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span>{customer.registrationDate}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{customer.totalOrders}</Badge>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium text-green-600">₹{customer.totalSpent?.toLocaleString() || '0'}</span>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusBadge(customer.status)}>
                      {customer.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
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
                          <AlertDialogTitle>Delete Customer</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete customer "{customer.name}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeleteCustomer(customer.id)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {filteredCustomers.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No customers found matching your search.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
