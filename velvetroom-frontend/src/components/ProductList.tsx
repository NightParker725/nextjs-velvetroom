/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useEffect, useState } from 'react';
import { getAllProducts, Product } from '@/services/products';
import ProductCard from './ProductCard';
import { motion } from 'framer-motion';

export default function ProductList({ products }: { products: any[] }) {
  if (!products || products.length === 0) {
    return <p style={{ textAlign: 'center', color: '#aaa' }}>No hay productos disponibles.</p>;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
        gap: 20,
        marginTop: 20,
      }}
    >
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </motion.div>
  );
}
