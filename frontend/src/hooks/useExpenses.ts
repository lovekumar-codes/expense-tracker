import { useQuery } from "@tanstack/react-query";
import { getExpenses } from "../services/expense";

export const useExpenses = () => {
  return useQuery({
    queryKey: ["expenses"],
    queryFn: getExpenses,
  });
};