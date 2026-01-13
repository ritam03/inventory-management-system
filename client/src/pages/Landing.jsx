import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Package, BarChart3, ScanLine } from "lucide-react";

const Landing = () => {
  const { token, loading } = useAuth();

  if (loading) return null;

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }
  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">InventoryPro</h1>
          <div className="flex gap-3">
            <Link
              to="/login"
              className="px-4 py-2 text-sm border rounded"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 text-sm bg-slate-900 text-white rounded"
            >
              Register
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-4xl font-bold mb-4">
          Smart Inventory & Sales Management
        </h2>
        <p className="text-slate-600 mb-10 max-w-xl">
          Manage products, track inventory, process barcode-based
          sales, and analyze performance — all in one place.
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          <Feature
            icon={Package}
            title="Inventory Control"
            desc="Real-time stock tracking and low-stock alerts."
          />
          <Feature
            icon={ScanLine}
            title="Barcode Sales"
            desc="Fast POS-style barcode-based sales workflow."
          />
          <Feature
            icon={BarChart3}
            title="Analytics Dashboard"
            desc="Visual insights into sales and inventory."
          />
        </div>
      </main>
    </div>
  );
};

const Feature = ({ icon: Icon, title, desc }) => (
  <div className="bg-white p-6 rounded-lg shadow">
    <Icon className="mb-3 text-slate-700" />
    <h3 className="font-semibold mb-1">{title}</h3>
    <p className="text-sm text-slate-600">{desc}</p>
  </div>
);

export default Landing;
