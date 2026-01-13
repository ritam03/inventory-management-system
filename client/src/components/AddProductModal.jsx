import { useState } from "react";
import { createProduct } from "../services/product.service";

const AddProductModal = ({ onClose, onSuccess }) => {
  const [form, setForm] = useState({
    name: "",
    sku: "",
    barcode: "",
    price: "",
    quantity: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await createProduct({
        ...form,
        price: Number(form.price),
        quantity: Number(form.quantity)
      });

      onSuccess();
      onClose();
    } catch (err) {
      setError("Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-96 rounded-lg shadow p-6"
      >
        <h2 className="text-lg font-semibold mb-4">
          Add Product
        </h2>

        {error && (
          <p className="text-red-500 text-sm mb-3">
            {error}
          </p>
        )}

        {["name", "sku", "barcode", "price", "quantity"].map((field) => (
          <input
            key={field}
            name={field}
            placeholder={field.toUpperCase()}
            className="w-full mb-3 p-2 border rounded"
            value={form[field]}
            onChange={handleChange}
            required
          />
        ))}

        <div className="flex justify-end gap-2 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm border rounded"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 text-sm bg-slate-900 text-white rounded disabled:opacity-60"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProductModal;
