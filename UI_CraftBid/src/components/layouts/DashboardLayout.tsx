import React from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/ui/navbar';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Wallet, 
  User, 
  Settings, 
  Package, 
  Gavel,
  Home
} from 'lucide-react';

const DashboardSidebar: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const isArtisan = user?.roles?.some(role => role.name === 'artisan');

  return (
    <div className="w-64 h-screen bg-white border-r border-gray-200 p-4 flex flex-col sticky top-0">
      
      
      <nav className="flex-1 space-y-1">
        <NavLink
          to="/dashboard"
          className={({ isActive }) => 
            `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors font-montserrat ${
              isActive 
                ? 'bg-accent1/10 text-accent1 font-semibold' 
                : 'text-gray-700 hover:bg-gray-100'
            }`
          }
        >
          <LayoutDashboard size={18} />
          Dashboard
        </NavLink>

        {isArtisan ? (
          <>
            <NavLink
              to="/dashboard/my-products"
              className={({ isActive }) => 
                `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors font-montserrat ${
                  isActive 
                    ? 'bg-accent1/10 text-accent1 font-semibold' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`
              }
            >
              <Package size={18} />
              My Products
            </NavLink>
            <NavLink
              to="/dashboard/my-auctions"
              className={({ isActive }) => 
                `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors font-montserrat ${
                  isActive 
                    ? 'bg-accent1/10 text-accent1 font-semibold' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`
              }
            >
              <Gavel size={18} />
              My Auctions
            </NavLink>
          </>
        ) : (
          <NavLink
            to="/dashboard/my-bids"
            className={({ isActive }) => 
              `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors font-montserrat ${
                isActive 
                  ? 'bg-accent1/10 text-accent1 font-semibold' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`
            }
          >
            <ShoppingBag size={18} />
            My Bids
          </NavLink>
        )}

        <NavLink
          to="/dashboard/wallet"
          className={({ isActive }) => 
            `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors font-montserrat ${
              isActive 
                ? 'bg-accent1/10 text-accent1 font-semibold' 
                : 'text-gray-700 hover:bg-gray-100'
            }`
          }
        >
          <Wallet size={18} />
          Wallet
        </NavLink>

        <NavLink
          to="/dashboard/profile"
          className={({ isActive }) => 
            `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors font-montserrat ${
              isActive 
                ? 'bg-accent1/10 text-accent1 font-semibold' 
                : 'text-gray-700 hover:bg-gray-100'
            }`
          }
        >
          <User size={18} />
          Profile
        </NavLink>

        <NavLink
          to="/dashboard/settings"
          className={({ isActive }) => 
            `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors font-montserrat ${
              isActive 
                ? 'bg-accent1/10 text-accent1 font-semibold' 
                : 'text-gray-700 hover:bg-gray-100'
            }`
          }
        >
          <Settings size={18} />
          Settings
        </NavLink>

        <div className="pt-4 mt-4 border-t border-gray-200">
          <NavLink
            to="/auctions"
            className={({ isActive }) => 
              `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors font-montserrat ${
                isActive 
                  ? 'bg-accent1/10 text-accent1 font-semibold' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`
            }
          >
            <Home size={18} />
            Browse Auctions
          </NavLink>
        </div>
      </nav>
    </div>
  );
};

const DashboardLayout: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">
      <p className="text-lg font-montserrat">Loading dashboard...</p>
    </div>;
  }

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">
      <p className="text-lg font-montserrat">Error: User not found.</p>
    </div>;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="sticky top-0 w-full z-50">
        <Navbar />
      </div>
      <div className="flex">
        <DashboardSidebar />
        <main className="flex-1 p-4 md:p-6 lg:p-8 relative z-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
