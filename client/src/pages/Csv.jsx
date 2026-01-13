import { useState } from "react";
import {
  exportProductsCSV,
  importProductsCSV
} from "../services/csv.service";
import { Download, Upload } from "lucide-react";

const Csv = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleExport = async () => {
    const blob = await exportProductsCSV();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "products.csv";
    a.click();

    window.URL.revokeObjectURL(url);
  };

  const handleImport = async () => {
    if (!file) return;

    try {
      await importProductsCSV(file);
      setMessage("CSV imported successfully");
    } catch (err) {
      setMessage("CSV import failed");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">
        CSV Import / Export
      </h1>

      <div className="bg-white p-6 rounded-lg shadow max-w-xl">
        <div className="mb-6">
          <h2 className="font-semibold mb-2">
            Export Products
          </h2>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded"
          >
            <Download size={18} />
            Download CSV
          </button>
        </div>

        <div>
          <h2 className="font-semibold mb-2">
            Import Products
          </h2>

          <input
            type="file"
            accept=".csv"
            onChange={(e) => setFile(e.target.files[0])}
            className="mb-3"
          />

          <button
            onClick={handleImport}
            className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded"
          >
            <Upload size={18} />
            Upload CSV
          </button>
        </div>

        {message && (
          <p className="mt-4 text-sm text-slate-600">
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default Csv;
