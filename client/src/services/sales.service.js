import api from "./api";

export const createSale = async (items) => {
  const res = await api.post("/sales", { items });
  return res.data;
};

export const getSales = async () => {
  const res = await api.get("/sales");
  return res.data;
};
