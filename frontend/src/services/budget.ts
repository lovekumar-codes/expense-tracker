import API from "../api/axios";

export const setBudget = async (
  data: {
    amount: number;
  }
) => {
  const res = await API.post(
    "/budget",
    data
  );

  return res.data;
};

export const getBudget =
  async () => {
    const res =
      await API.get("/budget");

    return res.data;
  };