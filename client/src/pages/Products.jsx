import { useEffect, useState } from "react";
import {
  getProducts,
  deleteProduct
} from "../services/product.service";
import AddProductModal from "../components/AddProductModal";
import EditProductModal from "../components/EditProductModal";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Products = () => {
  const { user } = useAuth();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [editProduct, setEditProduct] = useState(null);

  const fetchProducts = async () => {
    setLoading(true);
    const data = await getProducts();
    setProducts(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product permanently?")) return;

    await deleteProduct(id);
    fetchProducts();
  };

  if (loading) return <p>Loading products...</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Products</h1>

        {user?.role === "ADMIN" && (
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded"
          >
            <Plus size={18} />
            Add Product
          </button>
        )}
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">SKU</th>
              <th className="p-3 text-left">Barcode</th>
              <th className="p-3 text-right">Price</th>
              <th className="p-3 text-right">Qty</th>
              {user?.role === "ADMIN" && (
                <th className="p-3 text-right">Actions</th>
              )}
            </tr>
          </thead>

          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-t hover:bg-slate-50">
                <td className="p-3">{p.name}</td>
                <td className="p-3">{p.sku}</td>
                <td className="p-3">{p.barcode}</td>
                <td className="p-3 text-right">₹{p.price}</td>
                <td className="p-3 text-right">{p.quantity}</td>

                {user?.role === "ADMIN" && (
                  <td className="p-3 text-right space-x-2">
                    <button
                      onClick={() => setEditProduct(p)}
                      className="text-slate-600 hover:text-slate-900"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="text-red-500"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAdd && (
        <AddProductModal
          onClose={() => setShowAdd(false)}
          onSuccess={fetchProducts}
        />
      )}

      {editProduct && (
        <EditProductModal
          product={editProduct}
          onClose={() => setEditProduct(null)}
          onSuccess={fetchProducts}
        />
      )}
    </div>
  );
};

export default Products;
