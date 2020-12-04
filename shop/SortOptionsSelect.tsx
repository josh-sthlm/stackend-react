//@flow
import React  from 'react';
import { ProductSortKeys } from '@stackend/api/shop';
import { FormattedMessage, injectIntl, WrappedComponentProps } from 'react-intl';


const SortOptionsSelect: React.FC<React.SelectHTMLAttributes<HTMLSelectElement> & WrappedComponentProps>
  = (props): JSX.Element => (
    <select {...props} size={1} className="stackend-product-sort">
      <option value={ProductSortKeys.PRICE}>
        <FormattedMessage id="shop.sort.price" defaultMessage="Price" />
      </option>
      <option value={ProductSortKeys.TITLE}>
        <FormattedMessage id="shop.sort.name" defaultMessage="Name" />
      </option>
      <option value={ProductSortKeys.RELEVANCE}>
        <FormattedMessage id="shop.sort.relevance" defaultMessage="Relevance" />
      </option>
      <option value={ProductSortKeys.BEST_SELLING}>
        <FormattedMessage id="shop.sort.best_selling" defaultMessage="Best selling" />
      </option>
    </select>
  );

export default injectIntl(SortOptionsSelect);
