
import * as XLSX from 'xlsx';

interface OrderData {
  id: string;
  date: string;
  customerName: string;
  contactNumber: string;
  buyerEmail: string;
  buyerAddress: string;
  products: { name: string; quantity: number; price: number }[];
  totalCost: number;
  paymentStatus: string;
  paymentMethod: string;
  assignedBy: string;
  deliveryPoint: string;
  receiptNo: string;
  shippingAmount: number;
}

interface CustomerData {
  id: number;
  name: string;
  mobile: string;
  email: string;
  address: string;
  registrationDate: string;
  totalOrders: number;
  totalSpent?: number;
  status: string;
}

export const exportOrdersToExcel = (orders: OrderData[], customers: CustomerData[]) => {
  // Prepare orders data for export - flatten products into separate rows
  const ordersForExport = orders.flatMap(order => 
    order.products.map(product => ({
      'Order ID': order.id,
      'Date': order.date,
      'Customer Name': order.customerName,
      'Contact Number': order.contactNumber,
      'Email': order.buyerEmail,
      'Address': order.buyerAddress,
      'Product Name': product.name,
      'Quantity': product.quantity,
      'Product Price': `₹${product.price}`,
      'Order Total': `₹${order.totalCost}`,
      'Payment Status': order.paymentStatus,
      'Payment Method': order.paymentMethod,
      'Assigned By': order.assignedBy,
      'Delivery Point': order.deliveryPoint,
      'Receipt No': order.receiptNo,
      'Shipping Amount': `₹${order.shippingAmount}`,
    }))
  );

  // Calculate total spent for each customer if not provided
  const customersWithSpent = customers.map(customer => {
    const customerOrders = orders.filter(order => 
      order.customerName.toLowerCase() === customer.name.toLowerCase() ||
      order.buyerEmail.toLowerCase() === customer.email.toLowerCase()
    );
    
    const totalSpent = customerOrders.reduce((sum, order) => sum + order.totalCost, 0);
    
    return {
      ...customer,
      totalSpent: customer.totalSpent || totalSpent
    };
  });

  // Prepare customers data for export with complete information
  const customersForExport = customersWithSpent.map(customer => ({
    'Customer ID': customer.id,
    'Name': customer.name,
    'Mobile': customer.mobile,
    'Email': customer.email,
    'Address': customer.address,
    'Registration Date': customer.registrationDate,
    'Total Orders': customer.totalOrders,
    'Total Spent': `₹${customer.totalSpent || 0}`,
    'Status': customer.status,
  }));

  // Create workbook
  const workbook = XLSX.utils.book_new();
  
  // Create worksheets with proper formatting
  const ordersWorksheet = XLSX.utils.json_to_sheet(ordersForExport);
  const customersWorksheet = XLSX.utils.json_to_sheet(customersForExport);
  
  // Set column widths for better readability
  const ordersCols = [
    { wch: 12 }, // Order ID
    { wch: 12 }, // Date
    { wch: 18 }, // Customer Name
    { wch: 15 }, // Contact
    { wch: 25 }, // Email
    { wch: 30 }, // Address
    { wch: 20 }, // Product Name
    { wch: 8 },  // Quantity
    { wch: 12 }, // Product Price
    { wch: 12 }, // Order Total
    { wch: 12 }, // Payment Status
    { wch: 15 }, // Payment Method
    { wch: 18 }, // Assigned By
    { wch: 15 }, // Delivery Point
    { wch: 12 }, // Receipt No
    { wch: 12 }, // Shipping Amount
  ];

  const customersCols = [
    { wch: 12 }, // Customer ID
    { wch: 18 }, // Name
    { wch: 15 }, // Mobile
    { wch: 25 }, // Email
    { wch: 30 }, // Address
    { wch: 15 }, // Registration Date
    { wch: 12 }, // Total Orders
    { wch: 12 }, // Total Spent
    { wch: 10 }, // Status
  ];

  ordersWorksheet['!cols'] = ordersCols;
  customersWorksheet['!cols'] = customersCols;
  
  // Add worksheets to workbook
  XLSX.utils.book_append_sheet(workbook, ordersWorksheet, 'Orders');
  XLSX.utils.book_append_sheet(workbook, customersWorksheet, 'Customers');
  
  // Generate and download file
  const fileName = `Orders_Customer_Data_${new Date().toISOString().split('T')[0]}.xlsx`;
  XLSX.writeFile(workbook, fileName);
};

// Export function for customers only
export const exportCustomersToExcel = (customers: CustomerData[], orders: OrderData[] = []) => {
  // Calculate total spent for each customer
  const customersWithSpent = customers.map(customer => {
    const customerOrders = orders.filter(order => 
      order.customerName.toLowerCase() === customer.name.toLowerCase() ||
      order.buyerEmail.toLowerCase() === customer.email.toLowerCase()
    );
    
    const totalSpent = customerOrders.reduce((sum, order) => sum + order.totalCost, 0);
    
    return {
      ...customer,
      totalSpent: customer.totalSpent || totalSpent
    };
  });

  const customersForExport = customersWithSpent.map(customer => ({
    'Customer ID': customer.id,
    'Name': customer.name,
    'Mobile': customer.mobile,
    'Email': customer.email,
    'Address': customer.address,
    'Registration Date': customer.registrationDate,
    'Total Orders': customer.totalOrders,
    'Total Spent': `₹${customer.totalSpent || 0}`,
    'Status': customer.status,
  }));

  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(customersForExport);
  
  // Set column widths
  worksheet['!cols'] = [
    { wch: 12 }, // Customer ID
    { wch: 18 }, // Name
    { wch: 15 }, // Mobile
    { wch: 25 }, // Email
    { wch: 30 }, // Address
    { wch: 15 }, // Registration Date
    { wch: 12 }, // Total Orders
    { wch: 12 }, // Total Spent
    { wch: 10 }, // Status
  ];
  
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Customers');
  
  const fileName = `Customer_Data_${new Date().toISOString().split('T')[0]}.xlsx`;
  XLSX.writeFile(workbook, fileName);
};

// Export function for orders only
export const exportOrdersOnlyToExcel = (orders: OrderData[]) => {
  const ordersForExport = orders.flatMap(order => 
    order.products.map(product => ({
      'Order ID': order.id,
      'Date': order.date,
      'Customer Name': order.customerName,
      'Contact Number': order.contactNumber,
      'Email': order.buyerEmail,
      'Address': order.buyerAddress,
      'Product Name': product.name,
      'Quantity': product.quantity,
      'Product Price': `₹${product.price}`,
      'Order Total': `₹${order.totalCost}`,
      'Payment Status': order.paymentStatus,
      'Payment Method': order.paymentMethod,
      'Assigned By': order.assignedBy,
      'Delivery Point': order.deliveryPoint,
      'Receipt No': order.receiptNo,
      'Shipping Amount': `₹${order.shippingAmount}`,
    }))
  );

  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(ordersForExport);
  
  // Set column widths
  worksheet['!cols'] = [
    { wch: 12 }, // Order ID
    { wch: 12 }, // Date
    { wch: 18 }, // Customer Name
    { wch: 15 }, // Contact
    { wch: 25 }, // Email
    { wch: 30 }, // Address
    { wch: 20 }, // Product Name
    { wch: 8 },  // Quantity
    { wch: 12 }, // Product Price
    { wch: 12 }, // Order Total
    { wch: 12 }, // Payment Status
    { wch: 15 }, // Payment Method
    { wch: 18 }, // Assigned By
    { wch: 15 }, // Delivery Point
    { wch: 12 }, // Receipt No
    { wch: 12 }, // Shipping Amount
  ];
  
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Orders');
  
  const fileName = `Orders_Data_${new Date().toISOString().split('T')[0]}.xlsx`;
  XLSX.writeFile(workbook, fileName);
};
