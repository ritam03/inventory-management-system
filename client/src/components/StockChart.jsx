import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const StockChart = ({ data }) => {
  return (
    <div className="bg-white p-5 rounded-lg shadow">
      <h3 className="font-semibold mb-4">
        Stock Distribution
      </h3>

      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <XAxis dataKey="name" hide />
          <YAxis />
          <Tooltip />
          <Bar dataKey="quantity" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StockChart;
