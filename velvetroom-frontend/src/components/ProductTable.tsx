/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function ProductTable({
  products,
  onDelete,
  showSeller = false,
}: {
  products: any[];
  onDelete: (id: number) => void;
  showSeller?: boolean;
}) {
  if (!products?.length) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{ textAlign: 'center', marginTop: 40 }}
      >
        <p style={{ color: '#bbb' }}>No hay productos registrados todavía...</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        width: '100%',
        overflowX: 'auto',
        marginTop: 20,
      }}
    >
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          background: 'rgba(255,255,255,0.02)',
          borderRadius: 8,
          overflow: 'hidden',
        }}
      >
        <thead>
          <tr style={{ background: 'rgba(212,175,55,0.1)' }}>
            <th style={thStyle}>Imagen</th>
            <th style={thStyle}>Nombre</th>
            {showSeller && <th style={thStyle}>Vendedor</th>}
            <th style={thStyle}>Precio</th>
            <th style={thStyle}>Stock</th>
            <th style={thStyle}>Categoría</th>
            <th style={thStyle}>Condición</th>
            <th style={thStyle}>Fecha</th>
            <th style={thStyle}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p, i) => (
            <tr
              key={p.id}
              style={{
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                background: i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent',
              }}
            >

              <td style={tdStyle}>
                {p.productUrl ? (
                  <img
                    src={p.productUrl}
                    alt={p.name}
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: 8,
                      objectFit: 'cover',
                      border: '1px solid rgba(255,255,255,0.1)',
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: 8,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'rgba(255,255,255,0.03)',
                      color: '#777',
                      fontSize: 24,
                    }}
                  >
                    ?
                  </div>
                )}
              </td>


              <td style={tdStyle}>{p.name}</td>

              {showSeller && (
                <td style={tdStyle}>
                  {p.seller?.name || 'Desconocido'}
                  <br />
                  <small style={{ color: '#999', fontSize: 12 }}>
                    {p.seller?.email}
                  </small>
                </td>
              )}

              <td style={tdStyle}>
                {p.price_cents.toLocaleString('es-CO', {
                  style: 'currency',
                  currency: 'COP',
                  maximumFractionDigits: 0,
                })}
              </td>

              <td style={tdStyle}>{p.stock}</td>
              <td style={tdStyle}>{p.category?.name ?? 'Sin categoría'}</td>
              <td style={tdStyle}>
                {p.condition === 'new'
                  ? '🆕 Nuevo'
                  : p.condition === 'fan_made'
                  ? '🎨 Hecho por fans'
                  : '♻️ Usado'}
              </td>
              <td style={tdStyle}>
                {new Date(p.created_at).toLocaleDateString('es-CO', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })}
              </td>


              <td style={tdStyle}>
                <div style={{ display: 'flex', gap: 8 }}>
                  <Link href={`/my-products/${p.id}/edit`} className="vr-btn">
                    ✏️ Editar
                  </Link>
                  <button
                    onClick={() => onDelete(p.id)}
                    className="vr-btn"
                    style={{
                      background: 'rgba(226,77,77,0.2)',
                      borderColor: 'rgba(226,77,77,0.5)',
                    }}
                  >
                    🗑️ Eliminar
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
}

const thStyle: React.CSSProperties = {
  textAlign: 'left',
  padding: '10px 12px',
  color: 'var(--vr-gold)',
  fontWeight: 600,
  fontSize: 14,
  borderBottom: '1px solid rgba(255,255,255,0.1)',
};

const tdStyle: React.CSSProperties = {
  padding: '10px 12px',
  fontSize: 14,
  color: '#ddd',
  verticalAlign: 'middle',
};
