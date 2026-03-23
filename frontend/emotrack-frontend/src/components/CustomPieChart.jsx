import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { useState } from "react";

const pieData = [
  { name: "Fericire", value: 40 },
  { name: "Tristețe", value: 25 },
  { name: "Furie", value: 20 },
  { name: "Surpriză", value: 15 },
];

const COLORS = ["#FACC15", "#3B82F6", "#EF4444", "#A78BFA"];

function CustomPieChart() {
  const [activeIndex, setActiveIndex] = useState(0);

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  const renderActiveShape = (props) => {
    const RADIAN = Math.PI / 180;
    const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;

    return (
      <g>
        <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill} fontWeight={600}>
          {payload.name}
        </text>
        <text x={cx} y={cy + 20} textAnchor="middle" fill="#555" fontSize={14}>
          {`${(percent * 100).toFixed(0)}%`}
        </text>
        <Pie
          data={[payload]}
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 10}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
      </g>
    );
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={pieData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          fill="#8884d8"
          activeIndex={activeIndex}
          activeShape={renderActiveShape}
          onMouseEnter={onPieEnter}
        >
          {pieData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value, name) => [`${value}%`, name]} />
      </PieChart>
    </ResponsiveContainer>
  );
}

export default CustomPieChart;