//@flow
import React, { Component } from 'react';
import { ProductSortKeys } from '@stackend/api/shop';
import { injectIntl, WrappedComponentProps } from 'react-intl';

type Props = WrappedComponentProps & React.SelectHTMLAttributes<HTMLSelectElement>;

class SortOptionsSelect extends Component<Props> {
  render(): JSX.Element {
    const props = this.props;
    return (
      <select {...props} size={1} className="stackend-product-sort">
        <option value={ProductSortKeys.PRICE}>
          {props.intl.formatMessage({ id: 'shop.sort.price', defaultMessage: 'Price' })}
        </option>
        <option value={ProductSortKeys.TITLE}>
          {props.intl.formatMessage({ id: 'shop.sort.name', defaultMessage: 'Name' })}
        </option>
        <option value={ProductSortKeys.RELEVANCE}>
          {props.intl.formatMessage({ id: 'shop.sort.relevance', defaultMessage: 'Relevance' })}
        </option>
        <option value={ProductSortKeys.BEST_SELLING}>
          {props.intl.formatMessage({ id: 'shop.sort.best_selling', defaultMessage: 'Best selling' })}
        </option>
      </select>
    );
  }
}

export default injectIntl(SortOptionsSelect);
