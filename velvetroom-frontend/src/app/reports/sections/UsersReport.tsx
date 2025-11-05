/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useEffect, useState } from "react";
import api from "@/services/api";
import { Bar } from "react-chartjs-2";
import { chartColors } from "@/lib/chartConfig";
import { motion } from "framer-motion";

export default function UsersReport() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    api.get('/reports/users').then(res => setData(res.data));
  }, []);

  if (!data) return <p style={{ textAlign:"center" }}>Cargando...</p>;

  const labels = data.byMonth.map((m:any) => m.month.substring(0,10));
  const values = data.byMonth.map((m:any) => m.users_registered);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Usuarios Registrados",
        data: values,
        backgroundColor: chartColors.fill,
        borderColor: chartColors.line,
        borderWidth: 2,
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
      <h2 className="vr-title">Nuevos usuarios por mes</h2>
      <div className="vr-card" style={{ padding: 20, marginTop: 20 }}>
        <Bar data={chartData} options={chartOptions} />
      </div>
    </motion.div>
  );
}
