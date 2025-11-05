/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import ProductForm from '@/components/ProductForm';
import { createProduct } from '@/services/products';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import RoleGate from '@/components/RoleGate';

export default function NewProductPage() {
  const router = useRouter();

  const handleSubmit = async (data: any) => {
    await createProduct(data);
    toast.success('Producto creado con éxito');
    router.push('/my-products');
  };

  return (
    <RoleGate roles={['admin', 'seller']}>
      <div style={{ maxWidth: 600, margin: '40px auto' }}>
        <button
            onClick={() => router.back()}
            className="vr-btn"
            style={{ background: 'rgba(212,175,55,0.15)', marginBottom: 12 }}
            >
            ← Volver
        </button>
        <h1 className="vr-title" style={{ textAlign: 'center' }}>
          Nuevo Producto
        </h1>
        <ProductForm onSubmit={handleSubmit} submitLabel="Crear producto" />
      </div>
    </RoleGate>
  );
}
