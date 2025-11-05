/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import RoleGate from '@/components/RoleGate';
import ProductList from '@/components//ProductList';
import { motion } from 'framer-motion';
import api from '@/services/api';
import { getCategories } from '@/services/categories';
import { useState, useEffect } from 'react';

export default function ProductsPage() {

      const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [sortBy, setSortBy] = useState('');

  useEffect(() => {
    api.get('/products').then((res) => setProducts(res.data));
    getCategories().then(setCategories);
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

  return (
    <RoleGate public>
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ padding: 24 }}
    >
      <h1 className="vr-title" style={{ textAlign: 'center' }}>Catálogo de Productos</h1>
      <p style={{ textAlign: 'center', color: '#ccc' }}>
        Explora los artefactos únicos traídos desde las profundidades del Velvet Room.
      </p>
      {/* 🔍 Filtros */}
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
            {/* 📦 Lista de productos filtrada */}
        <ProductList products={filtered} />
        </motion.div>
        </RoleGate>
    );
}
