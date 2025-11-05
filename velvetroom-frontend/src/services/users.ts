import api from './api';

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'seller' | 'client';
  address?: string;
  avatarUrl?: string;
  created_at: string;
  updated_at: string;
}

// ✅ Obtener todos los usuarios (solo admin)
export const getAllUsers = async (): Promise<User[]> => {
  const { data } = await api.get('/users');
  return data;
};

// ✅ Obtener un usuario por id
export const getUserById = async (id: number): Promise<User> => {
  const { data } = await api.get(`/users/${id}`);
  return data;
};

// ✅ Crear un usuario nuevo (solo admin)
export const createUser = async (userData: Partial<User> & { password: string }) => {
  const { data } = await api.post('/users', userData);
  return data;
};

// ✅ Actualizar usuario (solo admin)
export const updateUser = async (id: number, userData: Partial<User>) => {
  const { data } = await api.put(`/users/${id}`, userData);
  return data;
};

// ✅ Eliminar usuario (solo admin)
export const deleteUser = async (id: number) => {
  const { data } = await api.delete(`/users/${id}`);
  return data;
};


// 🧩 Obtener perfil actual (ya autenticado)
export const getMyProfile = async () => {
  const { data } = await api.get('/users/me');
  return data;
};

// 🧩 Actualizar perfil propio
export const updateMyProfile = async (payload: {
  name?: string;
  email?: string;
  address?: string;
  password?: string;
  currentPassword: string;
}) => {
  const { data } = await api.put('/users/me', payload);
  return data;
};
