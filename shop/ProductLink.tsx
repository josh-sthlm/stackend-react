
import React from 'react';
import { Link } from 'react-router';

import { Product } from '@stackend/api/shop';

export default function ProductLink({ product, productUrlPattern }: { product: Product, productUrlPattern: string }) {
	if (!product) {
		return null;
	}

  const link = encodeURI(`${productUrlPattern}`);

	return (
		<Link to={link} className="stackend-product-link">
			SHOPPA NU
		</Link>
	);
}
