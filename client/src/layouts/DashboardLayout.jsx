import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  FileUp,
  LogOut
} from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const SidebarLink = ({ to, icon: Icon, label }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium
         ${
           isActive
             ? "bg-slate-200 text-slate-900"
             : "text-slate-600 hover:bg-slate-100"
         }`
      }
    >
      <Icon size={18} />
      {label}
    </NavLink>
  );
};

const DashboardLayout = () => {
  const { user, logout } = useAuth();

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r px-3 py-4">
        <h1 className="text-xl font-bold px-4 mb-6">
          InventoryPro
        </h1>

        <nav className="flex flex-col gap-1">
          <SidebarLink
            to="/dashboard"
            icon={LayoutDashboard}
            label="Dashboard"
          />
          <SidebarLink
            to="/products"
            icon={Package}
            label="Products"
          />
          <SidebarLink
            to="/sales"
            icon={ShoppingCart}
            label="Sales"
          />
          <SidebarLink
            to="/csv"
            icon={FileUp}
            label="CSV Import / Export"
          />
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 bg-slate-100">
        {/* Header */}
        <header className="h-14 bg-white border-b flex items-center justify-between px-6">
          <h2 className="font-semibold text-slate-700">
            Inventory Management System
          </h2>

          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-600">
              {user?.email} ({user?.role})
            </span>

            <button
              onClick={logout}
              className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </header>

        {/* Page content */}
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
