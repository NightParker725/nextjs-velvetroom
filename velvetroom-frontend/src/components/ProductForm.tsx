/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useEffect, useState } from 'react';
import { getCategories } from '@/services/categories';

export default function ProductForm({
  initialData,
  onSubmit,
  submitLabel = 'Guardar',
}: {
  initialData?: any;
  onSubmit: (data: any) => void;
  submitLabel?: string;
}) {
  const [categories, setCategories] = useState<any[]>([]);
  const [form, setForm] = useState({
    name: '',
    description: '',
    price_cents: 0,
    stock: 0,
    productUrl: '',
    categoryId: '',
    condition: 'new',
  });

  useEffect(() => {
    getCategories().then(setCategories);
  }, []);


  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name ?? '',
        description: initialData.description ?? '',
        price_cents: initialData.price_cents ?? 0,
        stock: initialData.stock ?? 0,
        productUrl: initialData.productUrl ?? '',
        categoryId: initialData.category?.id ?? '',
        condition: initialData.condition ?? 'new',
      });
    }
  }, [initialData]);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="vr-card"
      style={{
        display: 'grid',
        gap: 18,
        padding: 24,
        maxWidth: 600,
        margin: '0 auto',
      }}
    >
      <h2 className="vr-title" style={{ textAlign: 'center' }}>
        Información del producto
      </h2>

      <div>
        <h3 style={{ marginBottom: 6 }}>Nombre y descripción</h3>
        <input
          className="vr-input"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Nombre del producto"
          required
        />
        <textarea
          className="vr-input"
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Descripción"
          style={{ marginTop: 8 }}
        />
      </div>

      <div>
        <h3 style={{ marginBottom: 6 }}>Precio y stock</h3>
        <input
          className="vr-input"
          name="price_cents"
          type="number"
          value={form.price_cents}
          onChange={handleChange}
          placeholder="Precio (en centavos)"
          required
        />
        <input
          className="vr-input"
          name="stock"
          type="number"
          value={form.stock}
          onChange={handleChange}
          placeholder="Cantidad disponible en inventario"
          style={{ marginTop: 8 }}
          required
        />
      </div>

      <div>
        <h3 style={{ marginBottom: 6 }}>Imagen del producto</h3>
        <input
          className="vr-input"
          name="productUrl"
          value={form.productUrl}
          onChange={handleChange}
          placeholder="URL de imagen (opcional)"
        />

        {form.productUrl && (
          <div
            style={{
              marginTop: 10,
              textAlign: 'center',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 8,
              padding: 10,
              background: 'rgba(255,255,255,0.02)',
            }}
          >
            <img
              src={form.productUrl}
              alt="Vista previa del producto"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
              style={{
                maxWidth: '100%',
                maxHeight: 200,
                borderRadius: 8,
                objectFit: 'contain',
              }}
            />
            <p style={{ fontSize: 12, color: '#aaa', marginTop: 6 }}>
              Vista previa generada desde la URL proporcionada.
            </p>
          </div>
        )}
      </div>

      <div>
        <h3 style={{ marginBottom: 6 }}>Categoría</h3>
        <select
          className="vr-input"
          name="categoryId"
          value={form.categoryId}
          onChange={handleChange}
          required
        >
          <option value="">Selecciona una categoría</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <h3 style={{ marginBottom: 6 }}>Condición del producto</h3>
        <select
          className="vr-input"
          name="condition"
          value={form.condition}
          onChange={handleChange}
        >
          <option value="new">Nuevo</option>
          <option value="fan_made">Hecho por fans</option>
          <option value="used">Usado</option>
        </select>
      </div>

      <button className="vr-btn" type="submit" style={{ marginTop: 16 }}>
        {submitLabel}
      </button>
    </form>
  );
}
