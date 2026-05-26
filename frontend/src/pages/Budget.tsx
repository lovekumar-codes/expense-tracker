import { useState } from "react";
import { useBudget } from "../hooks/useBudget";

import { setBudget as saveBudget } from "../services/budget";

import toast from "react-hot-toast";

import {
  Wallet,
  TrendingUp,
  AlertTriangle,
  PiggyBank,
} from "lucide-react";

const Budget = () => {

  const [input, setInput] =
    useState("");

  // 🔥 budget api
  const {
    data: budgetData,
    refetch,
  } = useBudget();

  // 🔥 backend values
  const budget =
    budgetData?.budget || 0;

  const totalExpenses =
    budgetData?.spent || 0;

  const remaining =
    budgetData?.remaining || 0;

  const warning =
    budgetData?.warning;

  // 🔥 percentage
  const percentage =
    budget > 0
      ? (totalExpenses /
          budget) *
        100
      : 0;

  // 🔥 save budget
  const handleSave =
    async () => {
      try {

        if (
          Number(input) <= 0
        ) {
          return toast.error(
            "Budget must be greater than 0"
          );
        }

        await saveBudget({
          amount: Number(input),
        });

        toast.success(
          "Budget saved successfully"
        );

        setInput("");

        refetch();

      } catch (error: any) {

        toast.error(
          error?.response?.data
            ?.message ||
            "Failed to save budget"
        );
      }
    };

  return (
    <div>

      {/* HEADER */}

      <div className="mb-10">

        <div className="flex items-center gap-4 mb-3">

          <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-lg">

            <Wallet size={26} />

          </div>

          <div>

            <h1 className="text-4xl font-bold text-slate-900 dark:text-white">

              Budget Management

            </h1>

            <p className="text-slate-500 dark:text-slate-400 mt-1">

              Manage your monthly budget and spending

            </p>

          </div>
        </div>
      </div>

      {/* TOP SECTION */}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">

        {/* BUDGET CARD */}

        <div className="xl:col-span-2 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-lg">

          <div className="flex items-center justify-between mb-6">

            <div>

              <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mb-2">

                Monthly Budget

              </h2>

              <h1 className="text-5xl font-bold text-blue-600">

                ₹{budget}

              </h1>

            </div>

            <div className="p-5 rounded-3xl bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-xl">

              <PiggyBank size={28} />

            </div>
          </div>

          {/* INPUT */}

          <div className="flex flex-col md:flex-row gap-4">

            <input
              type="number"
              placeholder="Enter monthly budget"
              value={input}
              onChange={(e) =>
                setInput(
                  e.target.value
                )
              }
              className="flex-1 p-4 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            />

            <button
              onClick={
                handleSave
              }
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:scale-[1.02] transition-all text-white px-8 py-4 rounded-2xl font-semibold shadow-lg"
            >

              Save Budget

            </button>
          </div>
        </div>

        {/* STATUS CARD */}

        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-lg">

          <div className="flex items-center gap-3 mb-5">

            <div className="p-3 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">

              <TrendingUp size={22} />

            </div>

            <h2 className="text-xl font-bold text-slate-900 dark:text-white">

              Budget Status

            </h2>
          </div>

          <div className="space-y-5">

            {/* SPENT */}

            <div>

              <p className="text-slate-500 dark:text-slate-400 mb-1">

                Total Expenses

              </p>

              <h1 className="text-3xl font-bold text-red-500">

                ₹{totalExpenses}

              </h1>

            </div>

            {/* REMAINING */}

            <div>

              <p className="text-slate-500 dark:text-slate-400 mb-1">

                Remaining Budget

              </p>

              <h1
                className={`text-3xl font-bold

                ${
                  remaining < 0
                    ? "text-red-500"
                    : "text-emerald-500"
                }
                `}
              >

                ₹{remaining}

              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* PROGRESS */}

      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-lg">

        <div className="flex items-center justify-between mb-5">

          <div>

            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">

              Budget Usage

            </h2>

            <p className="text-slate-500 dark:text-slate-400">

              Monthly spending progress

            </p>
          </div>

          <div className="text-3xl font-bold text-slate-900 dark:text-white">

            {percentage.toFixed(1)}%

          </div>
        </div>

        {/* PROGRESS BAR */}

        <div className="w-full h-5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">

          <div
            className={`h-full rounded-full transition-all duration-500

            ${
              percentage >= 100
                ? "bg-red-500"
                : percentage >= 80
                ? "bg-yellow-500"
                : "bg-emerald-500"
            }
            `}
            style={{
              width: `${Math.min(
                percentage,
                100
              )}%`,
            }}
          />
        </div>

        {/* WARNING */}

        {(warning ===
          "near_limit" ||
          warning ===
            "exceeded") && (

          <div
            className={`mt-6 flex items-center gap-3 p-5 rounded-2xl font-semibold

            ${
              warning ===
              "exceeded"
                ? "bg-red-100 dark:bg-red-950/40 text-red-600"
                : "bg-yellow-100 dark:bg-yellow-950/40 text-yellow-700"
            }
            `}
          >

            <AlertTriangle size={22} />

            <span>

              {warning ===
              "exceeded"
                ? "Budget limit exceeded!"
                : "Warning: You have used more than 80% of your budget"}

            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Budget;