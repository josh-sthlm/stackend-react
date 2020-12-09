import { Tags } from './Shop.style';
import React, { Fragment } from 'react';
import { Product } from '@stackend/api/shop';
import { Link } from 'react-router';

export type Props = {
  product: Product;
  createProductTagSearchLink: (tag: string, product: Product) => string;
};

function ProductTags(props: Props): JSX.Element | null {
  const { product, createProductTagSearchLink } = props;

  if (!product || !product.tags || product.tags.length === 0) {
    return null;
  }

  return (
    <Tags>
      {product.tags.map(t => {
        const link = createProductTagSearchLink(t, product);
        return (
          <Fragment key={t}>
            <Link key={t} to={link} className="stackend-tag">
              {t}
            </Link>{' '}
          </Fragment>
        );
      })}
    </Tags>
  );
}

export default ProductTags;
