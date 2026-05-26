import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const COLORS = [
  "#3b82f6",
  "#22c55e",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
];

interface Props {
  data: any[];
  darkMode?: boolean;
}

const ExpenseChart = ({
  data,
  darkMode,
}: Props) => {
  return (
    <div
      style={{
        background: darkMode
          ? "linear-gradient(135deg,#1e293b,#0f172a)"
          : "white",

        padding: "25px",

        borderRadius: "20px",

        marginTop: "20px",

        height: "400px",

        border: darkMode
          ? "1px solid #334155"
          : "1px solid #e5e7eb",

        boxShadow: darkMode
          ? "0 10px 30px rgba(0,0,0,0.35)"
          : "0 10px 30px rgba(0,0,0,0.08)",
      }}
    >
      <h2
        style={{
          marginBottom: "20px",

          fontSize: "22px",

          fontWeight: "bold",

          color: darkMode
            ? "white"
            : "#111827",
        }}
      >
        Expense Analytics
      </h2>

      <ResponsiveContainer
        width="100%"
        height="85%"
      >
        <PieChart>
          <Pie
            data={data}
            dataKey="amount"
            nameKey="category"
            outerRadius={120}
            label
          >
            {data.map(
              (_: any, index: number) => (
                <Cell
                  key={index}
                  fill={
                    COLORS[
                      index %
                        COLORS.length
                    ]
                  }
                />
              )
            )}
          </Pie>

          <Tooltip
            contentStyle={{
              background: darkMode
                ? "#1e293b"
                : "white",

              border: "none",

              borderRadius: "10px",

              color: darkMode
                ? "white"
                : "#111827",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ExpenseChart;