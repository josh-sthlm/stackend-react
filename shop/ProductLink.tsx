import React from 'react';
import { Link } from 'react-router';

import { Product } from '@stackend/api/shop';
import { templateReplaceUrl } from '@stackend/api/api';

export default function ProductLink({
  product,
  productUrlPattern
}: {
  product: Product;
  productUrlPattern: string;
}): JSX.Element | null {
  if (!product) {
    return null;
  }

  const link = templateReplaceUrl(productUrlPattern, {
    id: product.id,
    handle: product.handle,
    title: product.title
  });

  return (
    <Link to={link as string} className="stackend-product-link">
      SHOPPA NU
    </Link>
  );
}
