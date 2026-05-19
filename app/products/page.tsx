import ProductsList from '@/components/ProductsList';
import { Suspense } from 'react';

export default function ProductsPage() {
  return (
    <section>
      <Suspense fallback={<div>Loading products...</div>}>
        <ProductsList />
      </Suspense>
    </section>
  );
}
