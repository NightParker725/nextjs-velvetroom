/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import Link from 'next/link';
import api from '@/services/api';
import RoleGate from '@/components/RoleGate';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [name, setName] = useState('');

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/categories');
      setCategories(data);
    } catch {
      toast.error('Error cargando categorías');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openModal = (category?: any) => {
    if (category) {
      setEditing(category);
      setName(category.name);
    } else {
      setEditing(null);
      setName('');
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditing(null);
    setName('');
  };

  const handleSubmit = async () => {
    if (!name.trim()) return toast.error('Debes ingresar un nombre válido.');
    try {
      if (editing) {
        await api.put(`/categories/${editing.id}`, { name });
        toast.success('Categoría actualizada.');
      } else {
        await api.post('/categories', { name });
        toast.success('Categoría creada.');
      }
      fetchCategories();
      closeModal();
    } catch (err: any) {
      if (err.response?.status === 409)
        toast.error('Ya existe una categoría con ese nombre.');
      else toast.error('Error guardando categoría.');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Seguro que deseas eliminar esta categoría?')) return;
    try {
      await api.delete(`/categories/${id}`);
      toast.success('Categoría eliminada.');
      fetchCategories();
    } catch {
      toast.error('Error eliminando la categoría.');
    }
  };

  if (loading)
    return <p style={{ textAlign: 'center', marginTop: 40 }}>Cargando categorías...</p>;

  return (
    <RoleGate roles={['admin']}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{ padding: 24 }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <h1 className="vr-title">Gestión de Categorías</h1>
          <Link href="/admin/products" className="vr-btn">
            ← Volver al gestor de productos
          </Link>
        </div>

        <div style={{ textAlign: 'right', margin: '20px 0' }}>
          <button className="vr-btn" onClick={() => openModal()}>
            ➕ Nueva Categoría
          </button>
        </div>

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
              <th style={thStyle}>#</th>
              <th style={thStyle}>Nombre</th>
              <th style={thStyle}>Fecha</th>
              <th style={thStyle}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c, i) => (
              <tr
                key={c.id}
                style={{
                  borderBottom: '1px solid rgba(255,255,255,0.05)',
                  background: i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent',
                }}
              >
                <td style={tdStyle}>{c.id}</td>
                <td style={tdStyle}>{c.name}</td>
                <td style={tdStyle}>
                  {new Date(c.created_at).toLocaleDateString('es-CO', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}
                </td>
                <td style={tdStyle}>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      className="vr-btn"
                      onClick={() => openModal(c)}
                    >
                      ✏️ Editar
                    </button>
                    <button
                      className="vr-btn"
                      style={{
                        background: 'rgba(226,77,77,0.2)',
                        borderColor: 'rgba(226,77,77,0.5)',
                      }}
                      onClick={() => handleDelete(c.id)}
                    >
                      🗑️ Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <AnimatePresence>
          {modalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0, 0, 0, 0.65)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 999,
              }}
              onClick={closeModal}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                style={{
                  background: 'rgba(20, 20, 25, 0.95)',
                  border: '1px solid var(--vr-gold)',
                  borderRadius: 16,
                  padding: 30,
                  width: 420,
                  textAlign: 'center',
                  boxShadow: '0 0 25px rgba(212,175,55,0.3)',
                }}
              >
                <h2 className="vr-title" style={{ marginBottom: 20 }}>
                  {editing ? 'Editar Categoría' : 'Nueva Categoría'}
                </h2>

                <input
                  className="vr-input"
                  placeholder="Nombre de la categoría..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />

                <div style={{ display: 'flex', gap: 10, marginTop: 20, justifyContent: 'center' }}>
                  <button className="vr-btn" onClick={handleSubmit}>
                    💾 Guardar
                  </button>
                  <button
                    className="vr-btn"
                    onClick={closeModal}
                    style={{ background: 'rgba(226,77,77,0.2)' }}
                  >
                    Cancelar
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </RoleGate>
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
