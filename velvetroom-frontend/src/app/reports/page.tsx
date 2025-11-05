'use client';
import { useState } from "react";
import RoleGate from "@/components/RoleGate";
import SalesReport from "./sections/SalesReport";
import InventoryReport from "./sections/InventoryReport";
import UsersReport from "./sections/UsersReport";
import { button } from "motion/react-client";
import { downloadFullReport } from "@/services/reports";
import { toast } from "sonner";

export default function ReportsPage() {
  const [tab, setTab] = useState<'sales' | 'inventory' | 'users'>('sales');

  return (
    <RoleGate roles={['admin']}>
      <div style={{ padding: 32 }}>
        <h1 className="vr-title" style={{ textAlign: 'center' }}>📊 Reportes</h1>

        <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 24 }}>
          <button className="vr-btn" onClick={() => setTab('sales')}>
            Ventas
          </button>
          <button className="vr-btn" onClick={() => setTab('inventory')}>
            Inventario
          </button>

            <button className="vr-btn" onClick={() => setTab('users')}>
              Usuarios
            </button>
        </div>

        <div style={{ marginTop: 40 }}>
          {tab === 'sales' && <SalesReport />}
          {tab === 'inventory' && <InventoryReport />}
          {tab === 'users' && <UsersReport />}
        </div>
      </div>
    <div style={{ padding: 24 , textAlign: 'center' }}>
        <button
            className="vr-btn"
            style={{ marginTop: 20 }}
            onClick={async () => {
            try {
                await downloadFullReport();
                toast.success('Reporte generado correctamente');
            } catch {
                toast.error('No se pudo generar el reporte');
            }
            }}
        >
            Descargar Reporte Consolidado (PDF)
        </button>
        </div>
    </RoleGate>
  );
}
