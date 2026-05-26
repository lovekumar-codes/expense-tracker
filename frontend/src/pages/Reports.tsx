import { useExpenses } from "../hooks/useExpenses";
import {
PieChart,
Pie,
Tooltip,
ResponsiveContainer,
Cell,
BarChart,
Bar,
XAxis,
YAxis,
CartesianGrid,
} from "recharts";
import { useRef } from "react";
import jsPDF from "jspdf";

import html2canvas from "html2canvas";
const COLORS = [
"#2563eb",
"#16a34a",
"#dc2626",
"#9333ea",
"#ea580c",
];

const Reports = () => {
  const reportRef =
  useRef<HTMLDivElement>(null);

  const { data, isLoading } =
    useExpenses();

 if (isLoading) {
  return (
    <div className="space-y-6 animate-pulse">

      <div className="h-40 rounded-3xl bg-slate-200 dark:bg-slate-800" />

      <div className="grid md:grid-cols-2 gap-6">

        <div className="h-96 rounded-3xl bg-slate-200 dark:bg-slate-800" />

        <div className="h-96 rounded-3xl bg-slate-200 dark:bg-slate-800" />

      </div>

      <div className="h-96 rounded-3xl bg-slate-200 dark:bg-slate-800" />

    </div>
  );
}

  const expenses =
    data?.data || [];

    if (expenses.length === 0) {
  return (
    <div className="flex flex-col items-center justify-center py-20">

      <div className="w-24 h-24 rounded-full bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center mb-5">

        <span className="text-4xl">📊</span>

      </div>

      <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
        No Reports Available
      </h1>

      <p className="text-slate-500 dark:text-slate-400 mt-3">
        Add expenses to generate analytics reports.
      </p>

    </div>
  );
}

  // TOTAL

  const total =
    expenses.reduce(
      (acc: number, item: any) =>
        acc + item.amount,
      0
    );

  // CATEGORY TOTALS

  const categoryTotals =
    expenses.reduce(
      (acc: any, item: any) => {

        if (!acc[item.category]) {
          acc[item.category] = 0;
        }

        acc[item.category] +=
          item.amount;

        return acc;

      },
      {}
    );
  const topCategory =
  Object.entries(
    categoryTotals
  ).sort(
    (a: any, b: any) =>
      Number(b[1]) -
      Number(a[1])
  )[0];
  const chartData =
Object.entries(
categoryTotals
).map(
([name, value]) => ({
name,
value,
})
);
const monthlyData =
expenses.reduce(
(acc: any, item: any) => {

  const month =
    new Date(
      item.date
    ).toLocaleString(
      "default",
      {
        month: "short",
      }
    );

  const existing =
    acc.find(
      (i: any) =>
        i.month === month
    );

  if (existing) {
    existing.amount +=
      item.amount;
  } else {
    acc.push({
      month,
      amount:
        item.amount,
    });
  }

  return acc;

},
[]

);

const downloadPDF = async () => {

  const element =
    reportRef.current;
    if(!element) return

  const canvas =
    await html2canvas(
      element
    );

  const data =
    canvas.toDataURL(
      "image/png"
    );

  const pdf =
    new jsPDF();

const imgWidth = 210;

const pageHeight = 295;

const imgHeight =
  (canvas.height * imgWidth) /
  canvas.width;

let heightLeft =
  imgHeight;

let position = 0;

pdf.addImage(
  data,
  "PNG",
  0,
  position,
  imgWidth,
  imgHeight
);

heightLeft -= pageHeight;

while (heightLeft > 0) {

  position =
    heightLeft - imgHeight;

  pdf.addPage();

  pdf.addImage(
    data,
    "PNG",
    0,
    position,
    imgWidth,
    imgHeight
  );

  heightLeft -= pageHeight;
}

  pdf.save(
    "expense-report.pdf"
  );
};

  return (
    <div ref={reportRef} className="space-y-8">

      {/* HEADER */}

      <div>

        <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
          Financial Reports
        </h1>

        <p className="text-slate-500 dark:text-slate-400 mt-2">
          Analyze your spending activity
        </p>
    <button
  onClick={downloadPDF}
  className="
    mt-5
    bg-gradient-to-r
    from-blue-600
    to-blue-700
    hover:scale-105
    transition-all
    duration-300
    text-white
    px-6 py-3
    rounded-2xl
    shadow-xl
    font-semibold
  "
>
  Download Report PDF
</button>
      </div>

      {/* TOTAL CARD */}

      <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-8 rounded-3xl shadow-xl text-white">

        <p className="text-lg opacity-80">
          Total Expenses
        </p>

        <h1 className="text-5xl font-bold mt-3">
          ₹{total}
        </h1>
      </div>
      {/* TOP CATEGORY */}

<div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-xl">

  <p className="text-slate-500 dark:text-slate-400 mb-2">
    Highest Spending Category
  </p>

  <h1 className="text-4xl font-bold text-red-500">
    {topCategory?.[0]}
  </h1>

  <p className="mt-3 text-lg text-slate-700 dark:text-slate-300">
    ₹{ Number(topCategory?.[1])}
  </p>
</div>
{/* CHART SECTION */}

<div className="
bg-white dark:bg-slate-900
border border-slate-200
dark:border-slate-800
rounded-3xl p-8
shadow-xl
">  <h2 className="
    text-2xl font-bold
    text-slate-900
    dark:text-white
    mb-8
  ">
    Expense Analytics
  </h2>  <div className="h-[350px]"><ResponsiveContainer
  width="100%"
  height="100%"
>

  <PieChart>

    <Pie
      data={chartData}
      cx="50%"
      cy="50%"
      outerRadius={120}
      dataKey="value"
      label
    >
{chartData.map((_: any, index: number) => (
  <Cell
    key={index}
    fill={COLORS[index % COLORS.length]}
  />
))}

    </Pie>

    <Tooltip />

  </PieChart>

</ResponsiveContainer>

  </div></div>

  <div className="
bg-white dark:bg-slate-900
border border-slate-200
dark:border-slate-800
rounded-3xl p-8
shadow-xl
">  <h2 className="
    text-2xl font-bold
    text-slate-900
    dark:text-white
    mb-8
  ">
    Monthly Expenses
  </h2>  <div className="h-[350px]"><ResponsiveContainer
  width="100%"
  height="100%"
>

  <BarChart
    data={monthlyData}
  >

    <CartesianGrid
      strokeDasharray="3 3"
    />

    <XAxis
      dataKey="month"
    />

    <YAxis />

    <Tooltip />

    <Bar
      dataKey="amount"
      fill="#2563eb"
      radius={[10,10,0,0]}
    />

  </BarChart>

</ResponsiveContainer>

  </div></div>

      {/* CATEGORY REPORT */}

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-xl">

        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
          Category Breakdown
        </h2>

        <div className="space-y-5">

          {Object.entries(
            categoryTotals
          ).map(
            ([category, amount]: any) => (

              <div
                key={category}
              >

                <div className="flex items-center justify-between mb-2">

                  <h3 className="font-semibold text-slate-700 dark:text-slate-300">
                    {category}
                  </h3>

                  <div className="text-right">
  <p className="font-bold text-blue-600">
    ₹{amount}
  </p>

  <p className="text-sm text-slate-500">
    {(
      (amount / total) *
      100
    ).toFixed(1)}
    %
  </p>
</div>
                </div>

                <div className="w-full h-4 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">

                  <div
                    className="h-full bg-gradient-to-r from-blue-600 to-blue-700 rounded-full"
                    style={{
                      width: `${(amount / total) * 100}%`,
                    }}
                  />
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;