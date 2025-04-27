import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

type CryptoPriceChartProps = {
  data: number[];
  coinId?: string;
  days?: number;
};

const CryptoPriceChart: React.FC<CryptoPriceChartProps> = ({
  data,
  coinId = "",
  days = 7,
}) => {
  // Generate labels (dates) for the chart
  const generateLabels = () => {
    return Array.from({ length: data.length }, (_, i) => {
      const date = new Date();
      // Distribute the dates evenly across the 7 days (or specified period)
      const daysBack = days * (1 - i / (data.length - 1));
      date.setDate(date.getDate() - daysBack);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    });
  };

  const labels = generateLabels();

  const chartData = {
    labels,
    datasets: [
      {
        label: `${coinId.toUpperCase()} Price`,
        data: data,
        fill: false,
        borderColor: "#00ff95",
        backgroundColor: "rgba(0, 255, 149, 0.1)",
        borderWidth: 2,
        pointBackgroundColor: "#00ff95",
        pointBorderColor: "#121212",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "#00ff95",
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: "index" as const,
        intersect: false,
        backgroundColor: "rgba(18, 18, 18, 0.9)",
        titleColor: "#00ff95",
        bodyColor: "#ffffff",
        borderColor: "#00ff95",
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          color: "#888888",
          font: {
            size: 10,
          },
          // Only show a subset of ticks to avoid overcrowding
          callback: function (_: any, index: number) {
            return index % Math.ceil(labels.length / 5) === 0
              ? labels[index]
              : "";
          },
        },
      },
      y: {
        grid: {
          color: "rgba(255, 255, 255, 0.05)",
          drawBorder: false,
        },
        ticks: {
          color: "#888888",
          font: {
            size: 10,
          },
        },
      },
    },
  };

  return (
    <div className="h-[200px] w-full mt-4 px-2">
      <Line data={chartData} options={options} />
    </div>
  );
};

export default CryptoPriceChart;
