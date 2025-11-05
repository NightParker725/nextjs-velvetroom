/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useEffect, useState } from 'react';
import { getAllProducts, Product, deleteProduct } from '@/services/products';
import { useAuth } from '@/contexts/AuthContext';
import RoleGate from '@/components/RoleGate';
import ProductTable from '@/components/ProductTable';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import Link from 'next/link';
import { getCategories } from '@/services/categories';
import api from '@/services/api';

export default function MyProductsPage() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [sortBy, setSortBy] = useState('');

    useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
        try {
        const [productsRes, cats] = await Promise.all([
            api.get('/products'),
            getCategories(),
        ]);

        const all = productsRes.data;
        const mine = user.role === 'admin'
            ? all
            : all.filter((p: any) => p.seller?.id === user.id);

        setProducts(mine);
        setCategories(cats);
        } catch (error) {
        toast.error('Error cargando tus productos');
        } finally {
        setLoading(false);
        }
    };

    fetchData();
    }, [user]);

const handleDelete = async (id: number) => {
  if (!confirm('¿Seguro que deseas eliminar este producto?')) return;
  try {
    await deleteProduct(id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
    toast.success('Producto eliminado con éxito.');
  } catch (error: any) {
    if (error.response?.status === 403) {
      toast.error('No tienes permiso para eliminar este producto.');
    } else {
      toast.error('Ocurrió un error al eliminar el producto.');
    }
  }
};

    const filtered = products
        .filter((p) =>
        [p.name, p.description].some((field) =>
            field.toLowerCase().includes(search.toLowerCase())
        )
        )
        .filter((p) => !categoryFilter || p.category.name === categoryFilter)
        .sort((a, b) => {
        switch (sortBy) {
            case 'price_asc':
            return a.price_cents - b.price_cents;
            case 'price_desc':
            return b.price_cents - a.price_cents;
            case 'stock_asc':
            return a.stock - b.stock;
            case 'stock_desc':
            return b.stock - a.stock;
            case 'name_asc':
            return a.name.localeCompare(b.name);
            case 'name_desc':
            return b.name.localeCompare(a.name);
            default:
            return 0;
        }
        });

  if (loading)
    return <p style={{ textAlign: 'center', marginTop: 40 }}>Consultando el inventario...</p>;

  return (
    <RoleGate roles={['admin', 'seller']}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{ padding: 24 }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 className="vr-title">Mis Productos</h1>
          <Link href="/my-products/new" className="vr-btn">
            ➕ Nuevo producto
          </Link>
        </div>
      <div style={{ display: 'flex', gap: 8, margin: '16px 0' }}>
        <input
          className="vr-input"
          placeholder="Buscar producto..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select className="vr-input" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
          <option value="">Todas las categorías</option>
          {categories.map((c) => (
            <option key={c.id} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>
        <select className="vr-input" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="">Ordenar por...</option>
          <option value="price_asc">Precio ↑</option>
          <option value="price_desc">Precio ↓</option>
          <option value="stock_asc">Stock ↑</option>
          <option value="stock_desc">Stock ↓</option>
          <option value="name_asc">Nombre A–Z</option>
          <option value="name_desc">Nombre Z–A</option>
        </select>
      </div>

        <ProductTable products={filtered} onDelete={handleDelete} />
      </motion.div>
    </RoleGate>
  );
}
