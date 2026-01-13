import api from "./api";

export const exportProductsCSV = async () => {
  const res = await api.get("/csv/export/products", {
    responseType: "blob"
  });
  return res.data;
};

export const importProductsCSV = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await api.post("/csv/import/products", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });

  return res.data;
};
