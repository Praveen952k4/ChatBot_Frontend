
import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Dashboard } from './Dashboard';
import { Profile } from './Profile';
import { NewOrders } from './NewOrders';
import { Suppliers } from './Suppliers';
import { ProductsNew } from './ProductsNew';
import { Transport } from './Transport';
import { Coupons } from './Coupons';
import { Enquiries } from './Enquiries';
import { Customers } from './Customers';
import axios from 'axios';

interface AdminDashboardProps {
  onLogout: () => void;
}

type DBProduct = {
  id: string
  name: string
  categoryId: string | null
  description: string
  originalMRP: number
  isActive: boolean
  image: string
  youtubeUrl: string | null
  stock: number
  createdAt: string
  updatedAt: string
  productCategory: { id: string; name: string; image: string } | null
}

type UIProduct = {
  id: string
  name: string
  category: string
  description: string
  image: string
  video: string
  salePrice: number
  originalPrice: number
}

export const AdminDashboard = ({ onLogout }: AdminDashboardProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // State for highlighting specific items
  const [highlightId, setHighlightId] = useState<string | number | undefined>(undefined);
  
  // Get active section from URL
  const getActiveSectionFromPath = useCallback((pathname: string) => {
    const path = pathname.substring(1); // Remove leading slash
    if (path === '' || path === 'login') return 'dashboard';
    return path;
  }, []);

  const [activeSection, setActiveSection] = useState(() => 
    getActiveSectionFromPath(location.pathname)
  );

  // Centralized state for suppliers
  const [suppliers, setSuppliers] = useState([
    {
      id: 1,
      name: 'Rajesh Fireworks',
      shopName: 'Sparkle Fireworks',
      contact: '+91 98765 43210',
      email: 'rajesh@sparkle.com',
      location: 'Mumbai, Maharashtra',
      experience: '15 years',
      categories: ['Sparklers', 'Flower Pots', 'Rockets']
    },
    {
      id: 2,
      name: 'Priya Crackers',
      shopName: 'Diwali Delights',
      contact: '+91 87654 32109',
      email: 'priya@diwali.com',
      location: 'Delhi, NCR',
      experience: '10 years',
      categories: ['Chakri', 'Anar', 'Serpent']
    }
  ]);

  const [products, setProducts] = useState<UIProduct[]>([]);

  const mapProducts = (dbProducts: DBProduct[]): UIProduct[] => {
    return dbProducts.map((p) => ({
      id: p.id,
      name: p.name,
      category: p.productCategory ? p.productCategory.name : "Uncategorized",
      description: p.description,
      image: p.image,



      
      video: p.youtubeUrl || "",
      // example: discount 20% if active, else full price
      salePrice: p.isActive ? Math.round(p.originalMRP * 0.8) : p.originalMRP,
      originalPrice: p.originalMRP
    }))
  }

  // Update active section when URL changes
  useEffect(() => {
    const newSection = getActiveSectionFromPath(location.pathname);
    if (newSection !== activeSection) {
      setActiveSection(newSection);
    }
    const getProducts = async() => {
      const data = await axios.get("https://crackers-backend-pi.vercel.app/api/products");
      const productsFromDB = mapProducts(data.data.products);
      setProducts(productsFromDB);
    } 
    getProducts();
  }, [location.pathname, activeSection, getActiveSectionFromPath]);

  // Enhanced section change handler to support highlighting
  const handleSectionChange = useCallback((section: string, highlightItemId?: string | number) => {
    setActiveSection(section);
    setHighlightId(highlightItemId);
    navigate(`/${section}`, { replace: true });
    
    // Clear highlight after a short delay to allow the component to process it
    if (highlightItemId) {
      setTimeout(() => setHighlightId(undefined), 3000);
    }
  }, [navigate]);

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard suppliers={suppliers} products={products} onSectionChange={handleSectionChange} />;
      case 'profile':
        return <Profile />;
      case 'orders':
        return <NewOrders highlightId={highlightId} />;
      case 'suppliers':
        return <Suppliers suppliers={suppliers} setSuppliers={setSuppliers} highlightId={highlightId} />;
      case 'products':
        return <ProductsNew products={products} setProducts={setProducts} highlightId={highlightId} />;
      case 'transport':
        return <Transport />;
      case 'coupons':
        return <Coupons />;
      case 'enquiries':
        return <Enquiries />;
      case 'customers':
        return <Customers />;
      default:
        return <Dashboard suppliers={suppliers} products={products} onSectionChange={handleSectionChange} />;
    }
  };

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile menu overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      
      {/* Sidebar - Fixed height, no separate scroll */}
      <div className={`${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-in-out fixed lg:relative z-50 lg:z-auto h-full`}>
        <Sidebar 
          activeSection={activeSection} 
          onSectionChange={(section) => {
            handleSectionChange(section);
            setIsMobileMenuOpen(false);
          }}
          onToggleMobile={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          isMobileMenuOpen={isMobileMenuOpen}
          onLogout={onLogout}
        />
      </div>
      
      {/* Main content - Full height container */}
      <div className="flex-1 flex flex-col h-full min-w-0">
        {/* Mobile header */}
        <div className="lg:hidden bg-white shadow-sm border-b px-4 py-3 flex items-center justify-between flex-shrink-0">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex items-center space-x-2">
            <img 
              src="/lovable-uploads/63d95643-faed-4321-8694-2ebed77ad127.png" 
              alt="Crackers Craze" 
              className="w-6 h-6"
            />
            <h1 className="text-lg font-semibold text-gray-800">Crackers Craze</h1>
          </div>
          <div className="w-10"></div>
        </div>
        
        {/* Main content area - Each component handles its own scrolling */}
        <div className="flex-1 h-full">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};
