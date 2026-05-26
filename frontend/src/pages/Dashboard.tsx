import { useStats } from "../hooks/useStats";
import { useOutletContext } from "react-router-dom";
import ExpenseChart from "../components/dashboard/ExpenseChart";
import { formatCurrency } from "../utils/formatCurrency";

import {
  IndianRupee,
  Wallet,
  CalendarDays,
  TrendingUp,
} from "lucide-react";

const Dashboard = () => {
  const { darkMode }: any =
    useOutletContext();

  const { data, isLoading } =
    useStats();

  if (isLoading) {
  return (
    <div className="space-y-6 animate-pulse">

      <div className="h-10 w-72 bg-slate-300 dark:bg-slate-700 rounded-xl" />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

        {[1,2,3,4].map((item) => (
          <div
            key={item}
            className="h-[220px] rounded-3xl bg-slate-300 dark:bg-slate-800"
          />
        ))}
      </div>

      <div className="h-[400px] rounded-3xl bg-slate-300 dark:bg-slate-800" />
    </div>
  );
}

  const chartData =
    data?.recent?.map((item: any) => ({
      category: item.category,
      amount: item.amount,
    })) || [];

  const cards = [
    {
      title: "Today Expense",
      value: data?.today,
      icon: <IndianRupee size={22} />,
      color:
        "from-blue-600 to-blue-700",
    },

    {
      title: "Monthly Expense",
      value: data?.month,
      icon: <Wallet size={22} />,
      color:
        "from-emerald-500 to-emerald-600",
    },

    {
      title: "Yearly Expense",
      value: data?.year,
      icon: <CalendarDays size={22} />,
      color:
        "from-orange-500 to-orange-600",
    },
  ];

  return (
    <div>

      {/* HEADER */}

      <div className="mb-10">

        <div className="flex items-center gap-3 mb-3">

          <div className="p-3 rounded-2xl bg-blue-600 text-white shadow-lg">
            <TrendingUp size={24} />
          </div>

          <div>
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
              Financial Dashboard
            </h1>

            <p className="text-slate-500 dark:text-slate-400 mt-1">
              Track your expenses and financial activity
            </p>
          </div>
        </div>
      </div>

      {/* ANALYTICS CARDS */}
<div
  className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 items-start"
>

        {cards.map((card, index) => (

          <div
            key={index}
            className="relative overflow-hidden  h-[220px] rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-7 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
          >

            {/* TOP */}

            <div className="flex items-center justify-between mb-6">

              <div>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-2">
                  {card.title}
                </p>

                <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
                  {formatCurrency(card.value)}
                </h1>
              </div>

              <div
                className={`bg-gradient-to-br ${card.color} p-4 rounded-2xl text-white shadow-lg`}
              >
                {card.icon}
              </div>
            </div>

            {/* GLOW */}

            <div
              className={`absolute -right-10 -top-10 w-32 h-32 rounded-full opacity-10 bg-gradient-to-br ${card.color}`}
            />
          </div>
        ))}

        {/* RECENT TRANSACTIONS */}

        <div className="md:col-span-2 xl:col-span-1 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-7 shadow-lg h-[220px] overflow-hidden flex flex-col">

          <div className="flex items-center justify-between mb-6">

            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Recent Transactions
            </h2>

            <span className="text-sm text-blue-600 font-semibold">
              Latest
            </span>
          </div>

          {data?.recent?.length ===
          0 ? (

            <p className="text-slate-500 dark:text-slate-400">
              No recent transactions
            </p>

          ) : (

            <div className="space-y-4 overflow-y-auto pr-2 flex-1">

              {data?.recent?.map(
                (item: any) => (

                  <div
                    key={item._id}
                    className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3"
                  >

                    <div>

                      <h3 className="font-semibold text-slate-800 dark:text-slate-200">
                        {item.title}
                      </h3>

                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {item.category}
                      </p>
                    </div>

                    <div className="text-right">

                      <h2 className="font-bold text-slate-900 dark:text-white">
                        ₹{item.amount}
                      </h2>
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </div>

      {/* CHART */}

      <ExpenseChart
        data={chartData}
        darkMode={darkMode}
      />
    </div>
  );
};

export default Dashboard;