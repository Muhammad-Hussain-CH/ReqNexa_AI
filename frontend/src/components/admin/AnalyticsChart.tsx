import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, PieChart, Pie, Cell, BarChart, Bar } from "recharts";

type Props = { type: "line" | "pie" | "bar"; data: any[]; dataKey?: string; nameKey?: string; colors?: string[] };

export default function AnalyticsChart({ type, data, dataKey = "value", nameKey = "name", colors = ["#1976D2", "#F57C00", "#43A047", "#D32F2F"] }: Props) {
  if (type === "line") {
    return (
      <div className="h-48">
        <ResponsiveContainer>
          <LineChart data={data}>
            <XAxis dataKey={nameKey} />
            <YAxis />
            <Line type="monotone" dataKey={dataKey} stroke="#1976D2" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }
  if (type === "pie") {
    return (
      <div className="h-48">
        <ResponsiveContainer>
          <PieChart>
            <Pie data={data} dataKey={dataKey} nameKey={nameKey} outerRadius={80}>
              {data.map((_, i) => (<Cell key={i} fill={colors[i % colors.length]} />))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  }
  return (
    <div className="h-48">
      <ResponsiveContainer>
        <BarChart data={data}>
          <XAxis dataKey={nameKey} />
          <YAxis />
          <Bar dataKey={dataKey} fill="#43A047" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

