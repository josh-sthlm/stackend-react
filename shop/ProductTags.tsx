import { Tags } from './Shop.style';
import React, { Fragment } from 'react';
import { Product } from '@stackend/api/shop';
import { Link } from 'react-router';
import ShopLinkFactory from './ShopLinkFactory';
import { getLinkFactory } from '../link/LinkFactory';

export type Props = {
  /**
   * Product
   */
  product: Product | null;
};

function ProductTags(props: Props): JSX.Element | null {
  const { product } = props;

  if (!product || !product.tags || product.tags.length === 0) {
    return null;
  }

  const linkFactory = getLinkFactory<ShopLinkFactory>('shop');

  return (
    <Tags>
      {product.tags.map(t => {
        const link = linkFactory.createProductTagSearchLink(t, product);
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
