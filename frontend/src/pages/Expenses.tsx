import { useState , useEffect} from "react";
import { useMutation } from "@tanstack/react-query";
import {
  Search,
  Pencil,
  Trash2,
  SlidersHorizontal,
  Receipt
} from "lucide-react";

import { useExpenses } from "../hooks/useExpenses";
import AddExpenseForm from "../components/expenses/AddExpenseForm";
import { deleteExpense } from "../services/expense";
import toast from "react-hot-toast";
import {motion, AnimatePresence} from "framer-motion"
import { useQueryClient } from "@tanstack/react-query";

const categoryColors: any = {
  Food:
    "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400",

  Shopping:
    "bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400",

  Transport:
    "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400",

  Bills:
    "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400",
};

const Expenses = () => {
  const queryClient = useQueryClient();

  const { data, isLoading} = useExpenses();

  const [editExpense, setEditExpense] = useState<any>(null);
  console.log("EDIT STATE", editExpense);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("");
  const [dateFilter, setDateFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
const itemsPerPage = 5;

  // DELETE MUTATION
  const deleteMutation = useMutation({
    mutationFn: deleteExpense,

 onSuccess: async () => {

  toast.success(
    "Expense deleted successfully"
  );

  await queryClient.invalidateQueries({
    queryKey: ["expenses"],
  });
},
  });

  // TOTAL EXPENSES
  const totalExpenses =
    data?.data?.reduce(
      (acc: number, item: any) => acc + item.amount,
      0
    ) || 0;

  // TOTAL COUNT
  const totalCount = data?.data?.length || 0;
  

  // FILTER + SORT
  const filteredExpenses = data?.data
    ?.filter((expense: any) => {
      const matchesSearch = expense.title
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesCategory =
        category === "" ||
        expense.category === category;

      const expenseDate = new Date(expense.date);
      const currentDate = new Date();

      const matchesDate =
        dateFilter === "all"
          ? true
          : dateFilter === "month"
          ? expenseDate.getMonth() ===
              currentDate.getMonth() &&
            expenseDate.getFullYear() ===
              currentDate.getFullYear()
          : expenseDate.getFullYear() ===
            currentDate.getFullYear();

      return (
        matchesSearch &&
        matchesCategory &&
        matchesDate
      );
    })
    ?.sort((a: any, b: any) => {
      if (sort === "amount_asc") {
        return a.amount - b.amount;
      }

      if (sort === "amount_desc") {
        return b.amount - a.amount;
      }

      if (sort === "date_asc") {
        return (
          new Date(a.date).getTime() -
          new Date(b.date).getTime()
        );
      }

      if (sort === "date_desc") {
        return (
          new Date(b.date).getTime() -
          new Date(a.date).getTime()
        );
      }

      return 0;
    });
     const totalPages = Math.ceil(
  (filteredExpenses?.length || 0) / itemsPerPage
);

useEffect(() => {
  if (
    currentPage > totalPages &&
    totalPages > 0
  ) {
    setCurrentPage(1);
  }
}, [totalPages, currentPage]);

const paginatedExpenses =
  filteredExpenses?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
      if (isLoading) {
  return (
    <div className="space-y-6 animate-pulse">

      {/* TOP CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="h-32 rounded-3xl bg-slate-200 dark:bg-slate-800" />
        <div className="h-32 rounded-3xl bg-slate-200 dark:bg-slate-800" />
      </div>

      {/* FILTER */}
      <div className="h-24 rounded-3xl bg-slate-200 dark:bg-slate-800" />

      {/* TABLE */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 space-y-4">
        <div className="h-10 rounded-xl bg-slate-200 dark:bg-slate-800" />
        <div className="h-10 rounded-xl bg-slate-200 dark:bg-slate-800" />
        <div className="h-10 rounded-xl bg-slate-200 dark:bg-slate-800" />
        <div className="h-10 rounded-xl bg-slate-200 dark:bg-slate-800" />
      </div>

    </div>
  );
}
return (
<motion.div
initial={{ opacity: 0, y: 30 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.4 }}
className="space-y-8"
>

      {/* HEADER */}
      <div className="flex items-center justify-between flex-wrap gap-4">

        <div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
            Expense Manager
          </h1>

          <p className="text-slate-500 dark:text-slate-400 mt-2">
            Track, manage and organize your expenses
          </p>
        </div>

      </div>

      {/* ADD FORM */}
     <AddExpenseForm
  key={editExpense?._id || "add"}

  editData={editExpense}

  onSuccess={() => {
    setEditExpense(null);
  }}
/>

      {/* FILTER SECTION */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xl">

        <div className="flex items-center gap-2 mb-5">
          <SlidersHorizontal
            size={18}
            className="text-blue-600"
          />

          <h2 className="font-semibold text-slate-900 dark:text-white">
            Filters & Search
          </h2>
        </div>

        <div className="flex flex-wrap gap-4">

          {/* SEARCH */}
          <div className="relative flex-1 min-w-[240px]">

            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              placeholder="Search expenses..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* CATEGORY */}
          <select
            value={category}
            onChange={(e) =>
              setCategory(e.target.value)
            }
            className="px-4 py-3 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
          >
            <option value="">
              All Categories
            </option>

            <option value="Food">
              Food
            </option>

            <option value="Shopping">
              Shopping
            </option>

            <option value="Bills">
              Bills
            </option>

            <option value="Transport">
              Transport
            </option>
          </select>

          {/* SORT */}
          <select
            value={sort}
            onChange={(e) =>
              setSort(e.target.value)
            }
            className="px-4 py-3 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
          >
            <option value="">
              Sort By
            </option>

            <option value="amount_desc">
              Amount High → Low
            </option>

            <option value="amount_asc">
              Amount Low → High
            </option>

            <option value="date_desc">
              Newest
            </option>

            <option value="date_asc">
              Oldest
            </option>
          </select>

          {/* DATE FILTER */}
          <select
            value={dateFilter}
            onChange={(e) =>
              setDateFilter(e.target.value)
            }
            className="px-4 py-3 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
          >
            <option value="all">
              All Time
            </option>

            <option value="month">
              This Month
            </option>

            <option value="year">
              This Year
            </option>
          </select>

        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        {/* TOTAL EXPENSE */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-3xl p-6 shadow-xl">

          <p className="text-white/70">
            Total Expenses
          </p>

          <h1 className="text-4xl font-bold mt-2">
            ₹{totalExpenses}
          </h1>

        </div>

        {/* TOTAL TRANSACTIONS */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl">

          <p className="text-slate-500 dark:text-slate-400">
            Total Transactions
          </p>

          <h1 className="text-4xl font-bold mt-2 text-slate-900 dark:text-white">
            {totalCount}
          </h1>

        </div>

      </div>

      {/* TABLE */}
      <div className="overflow-x-auto rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl">

        <motion.table
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.4 }}
  className="w-full"
>

          <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">

            <tr>

              <th className="text-left px-6 py-5 text-sm font-semibold text-slate-500 dark:text-slate-400">
                Title
              </th>

              <th className="text-left px-6 py-5 text-sm font-semibold text-slate-500 dark:text-slate-400">
                Amount
              </th>

              <th className="text-left px-6 py-5 text-sm font-semibold text-slate-500 dark:text-slate-400">
                Category
              </th>

              <th className="text-left px-6 py-5 text-sm font-semibold text-slate-500 dark:text-slate-400">
                Date
              </th>

              <th className="text-left px-6 py-5 text-sm font-semibold text-slate-500 dark:text-slate-400">
                Actions
              </th>

            </tr>

          </thead>
        
          <tbody>
            <AnimatePresence mode="popLayout">
            {filteredExpenses?.length === 0 && (
              <motion.tr
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
>
                <td
                  colSpan={5}
                  className="text-center py-10 text-slate-500 dark:text-slate-400"
                >
                  <div className="flex flex-col items-center justify-center py-10">  <div className="
    w-20 h-20 rounded-full
    bg-blue-100 dark:bg-blue-500/20
    flex items-center justify-center
    mb-4
  "><Receipt
  size={35}
  className="
    text-blue-600
    dark:text-blue-400
  "
/>

  </div>  <h2 className="
    text-xl font-bold
    text-slate-800
    dark:text-white
  ">
    No Expenses Found
  </h2>  <p className="
    text-slate-500
    dark:text-slate-400
    mt-2
  ">
    Start adding expenses to
    track your spending.
  </p></div>
                </td>
              </motion.tr>
            )}

            {paginatedExpenses?.map(
              (expense: any) => (
          <motion.tr
                 key={expense._id}
                 whileHover={{
                  scale:1.01
                 }}
                 initial={{
                  opacity: 0,
                  y: 20,}}
                animate={{
                   opacity: 1,
                   y: 0,}}
                exit={{
                  opacity: 0,
                   y: -100,}}
                transition={{
                  duration: 0.3,}}
                  className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-all duration-300"
                >

                  {/* TITLE */}
                  <td className="px-6 py-5 font-semibold text-slate-900 dark:text-white">
                    {expense.title}
                  </td>

                  {/* AMOUNT */}
                  <td className="px-6 py-5 font-bold text-blue-600 dark:text-blue-400">
                    ₹ {expense.amount}
                  </td>

                  {/* CATEGORY */}
                  <td className="px-6 py-5">

                    <span
                      className={`px-4 py-2 rounded-full text-sm font-semibold ${
                        categoryColors[
                          expense.category
                        ] ||
                        "bg-slate-200 text-slate-700"
                      }`}
                    >
                      {expense.category}
                    </span>

                  </td>

                  {/* DATE */}
                  <td className="px-6 py-5 text-slate-600 dark:text-slate-400">
                    {new Date(
                      expense.date
                    ).toLocaleDateString()}
                  </td>

                  {/* ACTIONS */}
                  <td className="px-6 py-5">

                    <div className="flex gap-3">

                      {/* EDIT */}
                      <button
                        onClick={() => {
  console.log("CLICKED", expense);

  setEditExpense({
    ...expense,
  });
}}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 hover:scale-105 text-white px-4 py-2 rounded-xl transition-all shadow-lg"
                      >
                        <Pencil size={16} />
                        Edit
                      </button>

                      {/* DELETE */}
                     <button
  onClick={() => {
    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this expense?"
      );

    if (confirmDelete) {
      deleteMutation.mutate(
        expense._id
      );
    }
  }}
  disabled={deleteMutation.isPending}
  className="
    flex items-center gap-2
    bg-red-500 hover:bg-red-600
    hover:scale-105
    disabled:opacity-50
    disabled:cursor-not-allowed
    text-white px-4 py-2
    rounded-xl transition-all shadow-lg
  "
>
  <Trash2 size={16} />

  {deleteMutation.isPending
    ? "Deleting..."
    : "Delete"}
</button>

                    </div>

                  </td>

                </motion.tr>
              )
            )}
            </AnimatePresence>

          </tbody>

        </motion.table>
        <div className="flex justify-center items-center gap-3 mt-6">

  <button
    onClick={() =>
      setCurrentPage((prev) =>
        Math.max(prev - 1, 1)
      )
    }
    disabled={currentPage === 1}
    className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 disabled:opacity-50"
  >
    Prev
  </button>

  <span className="text-slate-700 dark:text-white font-semibold">
    Page {currentPage} of {totalPages}
  </span>

  <button
    onClick={() =>
      setCurrentPage((prev) =>
        Math.min(prev + 1, totalPages)
      )
    }
    disabled={currentPage === totalPages}
    className="px-4 py-2 rounded-xl bg-blue-600 text-white disabled:opacity-50"
  >
    Next
  </button>

</div>

      </div>
    </motion.div>
  );
};

export default Expenses;
