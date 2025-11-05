/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useEffect, useState } from 'react';
import { getAllProducts, deleteProduct, Product } from '@/services/products';
import { getCategories } from '@/services/categories';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import RoleGate from '@/components/RoleGate';
import ProductTable from '@/components/ProductTable';
import Link from 'next/link';
import api from '@/services/api';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [sortBy, setSortBy] = useState('');

  useEffect(() => {
    Promise.all([api.get('/products'), getCategories()])
      .then(([prodRes, cats]) => {
        setProducts(prodRes.data);
        setCategories(cats);
      })
      .catch(() => toast.error('Error cargando productos'))
      .finally(() => setLoading(false));
  }, []);

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

  if (loading)
    return <p style={{ textAlign: 'center', marginTop: 40 }}>Cargando inventario...</p>;

  return (
    <RoleGate roles={['admin']}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{ padding: 24 }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 className="vr-title">Gestor de Productos</h1>
          <Link href="/my-products/new" className="vr-btn">
            ➕ Crear nuevo
          </Link>
        </div>

        <p style={{ color: '#ccc', marginTop: 4 }}>
          Panel administrativo para revisar, modificar o eliminar productos del sistema.
        </p>

        <div style={{ display: 'flex', gap: 8, margin: '16px 0' }}>
          <input
            className="vr-input"
            placeholder="Buscar producto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="vr-input"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
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

        <ProductTable products={filtered} onDelete={handleDelete} showSeller />
      </motion.div>
    </RoleGate>
  );
}
