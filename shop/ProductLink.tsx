
import React from 'react';
import Link from 'react-router';

import { Product } from '@stackend/api/shop';

export default function ProductLink({ product }: { product: Product }) {
	if (!product) {
		return null;
	}

	return (
		<Link to={'#/product/' + product.handle} className="stackend-product-link">
			SHOPPA NU
		</Link>
	);
}
