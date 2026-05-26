import API from "../api/axios";

export const getStats = async () => {
  const res = await API.get("/expenses/stats");
  return res.data;
};

export const getExpenses = async () => {
  const res = await API.get("/expenses");
  return res.data;
};

export const addExpense = async (data: any) => {
  const res = await API.post("/expenses", data);
  return res.data;
};

export const deleteExpense = async (id: string) => {
  const res = await API.delete(`/expenses/${id}`);
  return res.data;
};

export const updateExpense = async (
  id: string,
  data: any
) => {
  const res = await API.put(`/expenses/${id}`, data);
  return res.data;
};

export const getChartData = async () => {
  const res = await API.get("/expenses/chart");
  return res.data;
};
