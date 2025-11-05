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

export const getAllUsers = async (): Promise<User[]> => {
  const { data } = await api.get('/users');
  return data;
};

export const getUserById = async (id: number): Promise<User> => {
  const { data } = await api.get(`/users/${id}`);
  return data;
};


export const createUser = async (userData: Partial<User> & { password: string }) => {
  const { data } = await api.post('/users', userData);
  return data;
};

export const updateUser = async (id: number, userData: Partial<User>) => {
  const { data } = await api.put(`/users/${id}`, userData);
  return data;
};

export const deleteUser = async (id: number) => {
  const { data } = await api.delete(`/users/${id}`);
  return data;
};


export const getMyProfile = async () => {
  const { data } = await api.get('/users/me');
  return data;
};

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
