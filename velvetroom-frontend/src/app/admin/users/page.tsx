/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import RoleGate from '@/components/RoleGate';
import api from '@/services/api';
import Link from 'next/link';

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({
    name: '',
    email: '',
    role: 'client',
    address: '',
    avatarUrl: '',
    password: '',
  });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/users');
      setUsers(data);
    } catch {
      toast.error('Error cargando usuarios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openModal = (user?: any) => {
    if (user) {
      setEditing(user);
      setForm({
        name: user.name || '',
        email: user.email || '',
        role: user.role || 'client',
        address: user.address || '',
        avatarUrl: user.avatarUrl || '',
        password: '',
      });
    } else {
      setEditing(null);
      setForm({
        name: '',
        email: '',
        role: 'client',
        address: '',
        avatarUrl: '',
        password: '',
      });
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditing(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.email.trim()) {
      toast.error('Nombre y correo son obligatorios.');
      return;
    }

    try {
      if (editing) {
        await api.put(`/users/${editing.id}`, form);
        toast.success('Usuario actualizado.');
      } else {
        await api.post('/users', form);
        toast.success('Usuario creado.');
      }
      fetchUsers();
      closeModal();
    } catch (err: any) {
      console.error(err);
      toast.error('Error al guardar el usuario.');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Seguro que deseas eliminar este usuario?')) return;
    try {
      await api.delete(`/users/${id}`);
      toast.success('Usuario eliminado.');
      fetchUsers();
    } catch {
      toast.error('Error eliminando usuario.');
    }
  };

  if (loading)
    return <p style={{ textAlign: 'center', marginTop: 40 }}>Cargando usuarios...</p>;

  return (
    <RoleGate roles={['admin']}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 className="vr-title">Gestión de Usuarios</h1>
        </div>

        <div style={{ textAlign: 'right', margin: '20px 0' }}>
          <button className="vr-btn" onClick={() => openModal()}>
            ➕ Nuevo Usuario
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
              <th style={thStyle}>Email</th>
              <th style={thStyle}>Rol</th>
              <th style={thStyle}>Dirección</th>
              <th style={thStyle}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u, i) => (
              <tr
                key={u.id}
                style={{
                  borderBottom: '1px solid rgba(255,255,255,0.05)',
                  background: i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent',
                }}
              >
                <td style={tdStyle}>{u.id}</td>
                <td style={tdStyle}>{u.name}</td>
                <td style={tdStyle}>{u.email}</td>
                <td style={tdStyle}>{u.role}</td>
                <td style={tdStyle}>{u.address || '—'}</td>
                <td style={tdStyle}>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="vr-btn" onClick={() => openModal(u)}>
                      ✏️ Editar
                    </button>
                    <button
                      className="vr-btn"
                      style={{
                        background: 'rgba(226,77,77,0.2)',
                        borderColor: 'rgba(226,77,77,0.5)',
                      }}
                      onClick={() => handleDelete(u.id)}
                    >
                      🗑️ Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

       {/* 💠 Modal */}
        <AnimatePresence>
        {modalOpen && (
            <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={overlayStyle}
            onClick={closeModal}
            >
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                style={modalStyle}
            >
                <h2 className="vr-title" style={{ marginBottom: 20 }}>
                {editing ? 'Editar Usuario' : 'Nuevo Usuario'}
                </h2>

                <div style={{ display: 'grid', gap: 10 }}>
                <input
                    className="vr-input"
                    placeholder="Nombre"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                />
                <input
                    className="vr-input"
                    placeholder="Correo electrónico"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    disabled={!!editing}
                />
                <select
                    className="vr-input"
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                >
                    <option value="admin">Admin</option>
                    <option value="seller">Seller</option>
                    <option value="client">Client</option>
                </select>
                <input
                    className="vr-input"
                    placeholder="Dirección"
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                />
                <input
                    className="vr-input"
                    placeholder="URL del avatar (opcional)"
                    name="avatarUrl"
                    value={form.avatarUrl}
                    onChange={handleChange}
                />

                {form.avatarUrl?.trim() && (
                    <div style={{ textAlign: 'center', marginTop: 8 }}>
                    <img
                        src={form.avatarUrl}
                        alt="Vista previa del avatar"
                        onError={(e) => ((e.target as HTMLImageElement).style.display = 'none')}
                        style={{
                        width: 100,
                        height: 100,
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: '2px solid var(--vr-gold)',
                        boxShadow: '0 0 10px rgba(212,175,55,0.3)',
                        margin: '0 auto',
                        display: 'block',
                        }}
                    />
                    </div>
                )}

                {!editing && (
                    <input
                    className="vr-input"
                    type="password"
                    placeholder="Contraseña inicial"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    />
                )}
                </div>

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

const overlayStyle: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0, 0, 0, 0.65)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 999,
};

const modalStyle: React.CSSProperties = {
  background: 'rgba(20, 20, 25, 0.95)',
  border: '1px solid var(--vr-gold)',
  borderRadius: 16,
  padding: 30,
  width: 420,
  textAlign: 'center',
  boxShadow: '0 0 25px rgba(212,175,55,0.3)',
};
