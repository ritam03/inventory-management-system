import { useEffect, useState } from "react";
import { getDashboardData } from "../services/dashboard.service";
import SalesChart from "../components/SalesChart";
import StockChart from "../components/StockChart";

const Dashboard = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const load = async () => {
      const res = await getDashboardData();
      setData(res);
    };
    load();
  }, []);

  if (!data) {
    return <p>Loading dashboard...</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">
        Dashboard
      </h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <KPI title="Total Products" value={data.totalProducts} />
        <KPI title="Total Stock Units" value={data.totalStock} />
        <KPI title="Total Sales" value={data.totalSales} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <SalesChart data={data.salesChart} />
        <StockChart data={data.stockChart} />
      </div>

      {/* Low Stock Table */}
      <div className="bg-white rounded-lg shadow p-5">
        <h3 className="font-semibold mb-4">
          Low Stock Products
        </h3>

        {data.lowStock.length === 0 ? (
          <p className="text-sm text-slate-600">
            All products are sufficiently stocked.
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-100">
              <tr>
                <th className="p-3 text-left">Product</th>
                <th className="p-3 text-right">Quantity</th>
              </tr>
            </thead>
            <tbody>
              {data.lowStock.map((p) => (
                <tr key={p.id} className="border-t">
                  <td className="p-3">{p.name}</td>
                  <td className="p-3 text-right">{p.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

const KPI = ({ title, value }) => (
  <div className="bg-white p-5 rounded-lg shadow">
    <p className="text-slate-500 text-sm">{title}</p>
    <p className="text-2xl font-bold">{value}</p>
  </div>
);

export default Dashboard;
