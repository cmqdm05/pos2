import React from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Store, 
  Package, 
  ShoppingCart, 
  BarChart2,
  LogOut 
} from 'lucide-react';
import { useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';

const NavItem = ({ to, icon: Icon, children }: { to: string; icon: any; children: React.ReactNode }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
        isActive
          ? 'bg-indigo-800 text-white'
          : 'text-indigo-100 hover:bg-indigo-800'
      }`}
    >
      <Icon className="mr-3 h-5 w-5" />
      {children}
    </Link>
  );
};

const Sidebar = () => {
  const dispatch = useDispatch();
  const { storeId } = useParams();

  const handleLogout = () => {
    localStorage.removeItem('selectedStoreId');
    dispatch(logout());
  };

  if (!storeId) {
    return (
      <div className="hidden md:flex md:w-64 md:flex-col">
        <div className="flex flex-col flex-grow pt-5 bg-indigo-700 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4">
            <Store className="h-8 w-8 text-white" />
            <span className="ml-2 text-white text-lg font-semibold">POS System</span>
          </div>
          <div className="mt-5 flex-1 flex flex-col">
            <nav className="flex-1 px-2 pb-4 space-y-1">
              <NavItem to="/stores" icon={Store}>Stores</NavItem>
            </nav>
            <div className="px-2 pb-4">
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-2 text-sm font-medium text-indigo-100 hover:bg-indigo-800 rounded-md"
              >
                <LogOut className="mr-3 h-5 w-5" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="hidden md:flex md:w-64 md:flex-col">
      <div className="flex flex-col flex-grow pt-5 bg-indigo-700 overflow-y-auto">
        <div className="flex items-center flex-shrink-0 px-4">
          <Store className="h-8 w-8 text-white" />
          <span className="ml-2 text-white text-lg font-semibold">POS System</span>
        </div>
        <div className="mt-5 flex-1 flex flex-col">
          <nav className="flex-1 px-2 pb-4 space-y-1">
            <NavItem to={`/stores/${storeId}/dashboard`} icon={LayoutDashboard}>Dashboard</NavItem>
            <NavItem to={`/stores/${storeId}/products`} icon={Package}>Products</NavItem>
            <NavItem to={`/stores/${storeId}/sales`} icon={ShoppingCart}>Sales</NavItem>
            <NavItem to={`/stores/${storeId}/reports`} icon={BarChart2}>Reports</NavItem>
            <NavItem to="/stores" icon={Store}>Switch Store</NavItem>
          </nav>
          <div className="px-2 pb-4">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 text-sm font-medium text-indigo-100 hover:bg-indigo-800 rounded-md"
            >
              <LogOut className="mr-3 h-5 w-5" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;