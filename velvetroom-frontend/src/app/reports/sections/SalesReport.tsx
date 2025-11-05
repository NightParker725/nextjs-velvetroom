/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useEffect, useState } from "react";
import api from "@/services/api";
import { motion } from "framer-motion";
import { Line } from "react-chartjs-2";
import { chartColors } from "@/lib/chartConfig";

export default function SalesReport() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    api.get('/reports/sales?top=5').then(res => setData(res.data));
  }, []);

  if (!data) return <p style={{ textAlign:"center" }}>Cargando...</p>;

  const labels = data.monthly.map((m:any) => m.month.substring(0,10));
  const totals = data.monthly.map((m:any) => (m.total_cents / 1000).toFixed(3));

  const chartData = {
    labels,
    datasets: [
      {
        label: "Ingresos Mensuales (en miles de pesos COP)",
        data: totals,
        borderColor: chartColors.line,
        backgroundColor: chartColors.fill,
        borderWidth: 3,
        tension: 0.3,
        pointRadius: 5,
      }
    ]
  };

  const chartOptions = {
    plugins: { legend: { labels: { color: chartColors.text } } },
    scales: {
      x: { ticks: { color: chartColors.text }, grid: { color: chartColors.grid } },
      y: { ticks: { color: chartColors.text }, grid: { color: chartColors.grid } },
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ maxWidth: 800, margin: "0 auto" }}>
      <h2 className="vr-title">Ventas mensuales</h2>

      <div className="vr-card" style={{ padding: 20, marginTop: 20 }}>
        <Line data={chartData} options={chartOptions} />
      </div>
    </motion.div>
  );
}
