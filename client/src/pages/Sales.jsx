import { useEffect, useState } from "react";
import { getProductByBarcode } from "../services/product.service";
import { createSale, getSales } from "../services/sales.service";

const Sales = () => {
  const [barcode, setBarcode] = useState("");
  const [cart, setCart] = useState([]);
  const [sales, setSales] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchSales = async () => {
    try {
      const data = await getSales();
      setSales(data);
    } catch (err) {
      console.error("Failed to load sales");
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  const handleBarcodeSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const product = await getProductByBarcode(barcode);

      setCart((prev) => {
        const existing = prev.find(
          (item) => item.barcode === product.barcode
        );

        if (existing) {
          return prev.map((item) =>
            item.barcode === product.barcode
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        }

        return [
          ...prev,
          {
            barcode: product.barcode,
            name: product.name,
            price: Number(product.price),
            quantity: 1
          }
        ];
      });

      setBarcode("");
    } catch (err) {
      setError("Product not found");
    }
  };

  const updateQty = (barcode, qty) => {
    setCart((prev) =>
      prev.map((item) =>
        item.barcode === barcode
          ? { ...item, quantity: Number(qty) }
          : item
      )
    );
  };

  const removeItem = (barcode) => {
    setCart((prev) =>
      prev.filter((item) => item.barcode !== barcode)
    );
  };

  const checkout = async () => {
    if (cart.length === 0) return;

    setLoading(true);
    setError("");

    try {
      await createSale(
        cart.map((item) => ({
          barcode: item.barcode,
          quantity: item.quantity
        }))
      );

      setCart([]);
      await fetchSales(); // 🔥 refresh sales list
    } catch (err) {
      setError("Sale failed. Check stock.");
    } finally {
      setLoading(false);
    }
  };

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Sales</h1>

      {/* POS SECTION */}
      <form onSubmit={handleBarcodeSubmit} className="mb-4">
        <input
          type="text"
          placeholder="Scan or enter barcode"
          className="p-2 border rounded w-80"
          value={barcode}
          onChange={(e) => setBarcode(e.target.value)}
          autoFocus
        />
      </form>

      {error && <p className="text-red-500 mb-3">{error}</p>}

      <div className="bg-white rounded-lg shadow overflow-x-auto mb-4">
        <table className="w-full text-sm">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-3 text-left">Product</th>
              <th className="p-3 text-right">Price</th>
              <th className="p-3 text-right">Qty</th>
              <th className="p-3 text-right">Subtotal</th>
              <th className="p-3"></th>
            </tr>
          </thead>

          <tbody>
            {cart.map((item) => (
              <tr key={item.barcode} className="border-t">
                <td className="p-3">{item.name}</td>
                <td className="p-3 text-right">₹{item.price}</td>
                <td className="p-3 text-right">
                  <input
                    type="number"
                    min="1"
                    className="w-16 border rounded p-1 text-right"
                    value={item.quantity}
                    onChange={(e) =>
                      updateQty(item.barcode, e.target.value)
                    }
                  />
                </td>
                <td className="p-3 text-right">
                  ₹{item.price * item.quantity}
                </td>
                <td className="p-3 text-right">
                  <button
                    onClick={() => removeItem(item.barcode)}
                    className="text-red-500"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mb-10">
        <p className="text-lg font-semibold">Total: ₹{total}</p>
        <button
          onClick={checkout}
          disabled={loading}
          className="bg-slate-900 text-white px-6 py-2 rounded disabled:opacity-60"
        >
          {loading ? "Processing..." : "Checkout"}
        </button>
      </div>

      {/* SALES HISTORY */}
      <h2 className="text-xl font-semibold mb-3">Recent Sales</h2>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-3 text-left">Sale ID</th>
              <th className="p-3 text-right">Total</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Date</th>
            </tr>
          </thead>
          <tbody>
            {sales.map((sale) => (
              <tr key={sale.id} className="border-t">
                <td className="p-3">#{sale.id}</td>
                <td className="p-3 text-right">₹{sale.total_amount}</td>
                <td className="p-3">{sale.status}</td>
                <td className="p-3">
                  {new Date(sale.created_at).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Sales;
