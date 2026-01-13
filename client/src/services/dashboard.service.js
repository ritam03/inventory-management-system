import api from "./api";

export const getDashboardData = async () => {
  const [productsRes, salesRes] = await Promise.all([
    api.get("/products"),
    api.get("/sales")
  ]);

  const products = productsRes.data;
  const sales = salesRes.data;

  // Sales grouped by date
  const salesMap = {};
  sales.forEach((sale) => {
    const date = new Date(sale.created_at).toLocaleDateString();
    salesMap[date] = (salesMap[date] || 0) + Number(sale.total_amount);
  });

  const salesChart = Object.keys(salesMap).map((date) => ({
    date,
    total: salesMap[date]
  }));

  // Stock chart
  const stockChart = products.map((p) => ({
    name: p.name,
    quantity: p.quantity
  }));

  // Low stock
  const lowStock = products.filter(
    (p) => p.quantity <= p.low_stock_threshold
  );

  return {
    totalProducts: products.length,
    totalStock: products.reduce((s, p) => s + p.quantity, 0),
    totalSales: sales.length,
    salesChart,
    stockChart,
    lowStock
  };
};
