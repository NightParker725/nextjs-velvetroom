import { Chart as ChartJS, ArcElement, LineElement, BarElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";

ChartJS.register(
  ArcElement,
  LineElement,
  BarElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

export const chartColors = {
  line: "rgba(212,175,55,0.9)", // dorado
  fill: "rgba(212,175,55,0.15)",
  text: "rgba(255,255,255,0.9)",
  grid: "rgba(255,255,255,0.06)",
};
