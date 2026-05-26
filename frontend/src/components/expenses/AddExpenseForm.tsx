import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  addExpense,
  updateExpense,
} from "../../services/expense";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import ButtonLoader from "../common/ButtonLoder";

interface Props {
  editData?: any;
  onSuccess?: () => void;
}

const AddExpenseForm = ({
  editData,
  onSuccess,
}: Props) => {
  const queryClient = useQueryClient();
  const {
  register,
  handleSubmit,
  reset,
  formState: { errors, isSubmitting },
} = useForm({
  defaultValues: {
    title: "",
    amount: "",
    category: "",
    date: "",
    description: "",
  },
});

useEffect(() => {
  if (editData) {
    reset({
      title: editData.title || "",
      amount: editData.amount || "",
      category: editData.category || "",
      date: editData.date?.split("T")[0] || "",
      description: editData.description || "",
    });
  }
}, [editData, reset]);

  const onSubmit = async (
  data: any
) => {

  data.amount = Number(data.amount);

  try {

    // ✅ EDIT

    if (editData) {

      await updateExpense(
        editData._id,
        data
      );

      toast.success(
        "Expense updated successfully"
      );

    }

    // ✅ ADD

    else {

      await addExpense(data);

      toast.success(
        "Expense added successfully"
      );
    }

    // ✅ REFRESH EXPENSES

    await queryClient.invalidateQueries({
      queryKey: ["expenses"],
    });

    // ✅ RESET FORM

    reset({
      title: "",
      amount: "",
      category: "",
      date: "",
      description: "",
    });

    // ✅ REMOVE EDIT MODE

    onSuccess?.();

  } catch (error) {

    console.log(error);

    toast.error(
      "Something went wrong"
    );
  }
};
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-7 shadow-xl mb-8">

      {/* HEADER */}

      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          {editData
            ? "Edit Expense"
            : "Add New Expense"}
        </h2>

        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Manage your financial records
        </p>
      </div>

      {/* FORM */}

      <form
        onSubmit={handleSubmit(
          onSubmit
        )}
        className="grid grid-cols-1 md:grid-cols-2 gap-5"
      >
        {/* TITLE */}

        <div>
          <label className="block mb-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
            Title
          </label>

          <input
            placeholder="Enter expense title"
            {...register("title", {
  required: "Title is required",
  minLength: {
    value: 3,
    message:
      "Title must be at least 3 characters",
  },
})}
          className={`w-full p-4 rounded-2xl border bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white outline-none focus:ring-2 transition-all duration-300 ${
  errors.title
    ? "border-red-500 focus:ring-red-500"
    : "border-slate-300 dark:border-slate-700 focus:ring-blue-500"
}`}
          />
          {errors.title && (
  <p className="text-red-500 text-sm mt-2">
    {errors.title.message as string}
  </p>
)}
        </div>

        {/* AMOUNT */}

        <div>
          <label className="block mb-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
            Amount
          </label>

          <input
            type="number"
            placeholder="Enter amount"
            {...register("amount", {
  required: "Amount is required",
  min: {
    value: 1,
    message: "Amount must be greater than 0",
  },
})}
            className={`w-full p-4 rounded-2xl border bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white outline-none focus:ring-2 transition-all duration-300 ${
  errors.amount
    ? "border-red-500 focus:ring-red-500"
    : "border-slate-300 dark:border-slate-700 focus:ring-blue-500"
}`}
          />
          {/* ERROR MESSAGE */}
  {errors.amount && (
    <p className="text-red-500 text-sm mt-2">
      {errors.amount.message as string}
    </p>
  )}
        </div>

        {/* CATEGORY */}

        <div>
          <label className="block mb-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
            Category
          </label>

          <select
            {...register("category", {
  required: "Category is required",
})}
            className={`w-full p-4 rounded-2xl border bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white outline-none focus:ring-2 transition-all duration-300 ${
  errors.category
    ? "border-red-500 focus:ring-red-500"
    : "border-slate-300 dark:border-slate-700 focus:ring-blue-500"
}`}
          >
            <option value="">
              Select category
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
          {errors.category && (
  <p className="text-red-500 text-sm mt-2">
    {errors.category.message as string}
  </p>
)}
        </div>

        {/* DATE */}

        <div>
          <label className="block mb-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
            Date
          </label>

          <input
            type="date"
            {...register("date", {
  required: "Date is required",
})}
          className={`w-full p-4 rounded-2xl border bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white outline-none focus:ring-2 transition-all duration-300 ${
  errors.date
    ? "border-red-500 focus:ring-red-500"
    : "border-slate-300 dark:border-slate-700 focus:ring-blue-500"
}`}
          />
          {errors.date && (
  <p className="text-red-500 text-sm mt-2">
    {errors.date.message as string}
  </p>
)}
        </div>

        {/* DESCRIPTION */}

        <div className="md:col-span-2">
          <label className="block mb-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
            Description
          </label>

          <textarea
            rows={5}
            placeholder="Write expense details..."
            {...register("description")}
            className="w-full p-4 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        {/* BUTTON */}

        <div className="md:col-span-2">
         <button
  type="submit"
  disabled={isSubmitting}
  className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-white py-4 rounded-2xl font-semibold shadow-lg"
>
{isSubmitting ? (
  <ButtonLoader />
) : editData ? (
  "Update Expense"
) : (
  "Add Expense"
)}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddExpenseForm;