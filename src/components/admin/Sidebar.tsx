
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  User, 
  ShoppingCart, 
  Store, 
  Package, 
  Ticket, 
  MessageSquare, 
  Users,
  Zap,
  Target,
  Truck,
  LogOut
} from 'lucide-react';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  onToggleMobile?: () => void;
  isMobileMenuOpen?: boolean;
  onLogout: () => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'orders', label: 'Orders', icon: ShoppingCart },
  { id: 'suppliers', label: 'Suppliers', icon: Store },
  { id: 'products', label: 'Products', icon: Zap },
  { id: 'transport', label: 'Transport', icon: Truck },
  { id: 'coupons', label: 'Coupons', icon: Ticket },
  { id: 'enquiries', label: 'Enquiries', icon: MessageSquare },
  { id: 'customers', label: 'Customers', icon: Users },
  { id: 'logout', label: 'Logout', icon: LogOut, isSpecial: true },
];

export const Sidebar = ({ activeSection, onSectionChange, onToggleMobile, isMobileMenuOpen, onLogout }: SidebarProps) => {
  const handleItemClick = (itemId: string) => {
    if (itemId === 'logout') {
      onLogout();
    } else {
      onSectionChange(itemId);
    }
  };

  return (
    <div className="w-56 h-screen gradient-sidebar text-white shadow-festive-lg flex flex-col">
      <div className="p-4 lg:p-6 border-b border-white/20 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 lg:w-10 lg:h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <img 
                src="/lovable-uploads/63d95643-faed-4321-8694-2ebed77ad127.png" 
                alt="Crackers Craze" 
                className="w-6 h-6 lg:w-8 lg:h-8 object-contain"
              />
            </div>
            <div>
              <h1 className="text-lg lg:text-xl font-bold">🎆 Crackers Craze</h1>
              <p className="text-white/80 text-xs lg:text-sm">Admin Panel ✨</p>
            </div>
          </div>
          {/* Mobile close button */}
          <button
            onClick={onToggleMobile}
            className="lg:hidden p-1 hover:bg-white/10 rounded"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
      
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-hidden">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isLogout = item.isSpecial;
          return (
            <button
              key={item.id}
              onClick={() => handleItemClick(item.id)}
              className={cn(
                "w-full flex items-center space-x-3 px-3 lg:px-4 py-3 text-left transition-all duration-300 hover:bg-white/20 hover-glow text-sm lg:text-base rounded-lg group",
                activeSection === item.id && !isLogout && "bg-white/25 border-l-4 border-accent shadow-lg ring-2 ring-accent/30",
                isLogout && "text-red-300 hover:text-red-200 hover:bg-red-500/20"
              )}
            >
              <Icon className="w-5 h-5 flex-shrink-0 group-hover:scale-110 transition-transform duration-200" />
              <span className="font-medium truncate">{item.label}</span>
              {activeSection === item.id && !isLogout && <div className="w-2 h-2 bg-accent rounded-full animate-pulse ml-auto"></div>}
            </button>
          );
        })}
      </nav>
    </div>
  );
};
