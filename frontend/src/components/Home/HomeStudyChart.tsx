import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const HomeStudyChart = () => {
  const data = [
    { name: "1 day ago", study_hour: 120 },
    { name: "2 days ago", study_hour: 50 },
    { name: "3 days ago", study_hour: 95 },
    { name: "4 days ago", study_hour: 100 },
    { name: "5 days ago", study_hour: 30 },
  ];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#000000" />{" "}
        {/* Grid color */}
        <XAxis dataKey="name" stroke="#000000" /> {/* Axis line color */}
        <YAxis stroke="#000000" /> {/* Axis line color */}
        <Tooltip
          contentStyle={{ backgroundColor: "#8884d8", borderColor: "#8884d8" }} // Tooltip background and border color
          cursor={{ stroke: "#0000FF", strokeWidth: 2 }} // Tooltip cursor color
          formatter={(value) => [`${value} minutes`, "Study time"]} // Tooltip value and label
          labelFormatter={(label) => `Day: ${label}`} // Tooltip label format
        />
        <Line
          type="monotone"
          dataKey="study_hour"
          stroke="#000000"
          strokeWidth={2}
          dot={{ fill: "#ff7300", r: 5 }}
          activeDot={{ r: 8 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default HomeStudyChart;
