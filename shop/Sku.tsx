//@flow
import React, { Component } from 'react';
import { ProductVariant } from '@stackend/api/shop';
import * as Sc from './Shop.style';

import { FormattedMessage, injectIntl, WrappedComponentProps } from 'react-intl';

export interface Props extends WrappedComponentProps {
  variant: ProductVariant | null;
}

class Sku extends Component<Props> {
  render(): JSX.Element | null {
    const { variant } = this.props;

    if (!variant) {
      return null;
    }

    return (
      <Sc.Sku>
        <Sc.SkuLabel>
          <FormattedMessage id="shop.sku" defaultMessage="Sku" />
        </Sc.SkuLabel>
        <Sc.SkuValue>{variant.sku}</Sc.SkuValue>
      </Sc.Sku>
    );
  }
}

export default injectIntl(Sku);
