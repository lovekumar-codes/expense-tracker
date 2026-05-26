import { useQuery } from "@tanstack/react-query";

import { getBudget }
from "../services/budget";


export const useBudget =
() => {

  return useQuery({
    queryKey: ["budget"],

    queryFn: getBudget,
  });
};