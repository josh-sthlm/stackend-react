//@flow
import React, { Component } from 'react';
import * as Sc from './Shop.style';

import { ProductVariant } from '@stackend/api/shop';
import { FormattedMessage, injectIntl, WrappedComponentProps } from 'react-intl';

export interface Props extends WrappedComponentProps {
  variant?: ProductVariant | null;
}

/**
 * Render a price using the current community's locale
 */
class Weight extends Component<Props> {
  render(): JSX.Element | null {
    const { variant } = this.props;
    if (!variant || !variant.weight) {
      return null;
    }

    const key = 'shop.weight_x_' + (variant.weightUnit || 'KILOGRAMS').toLocaleLowerCase();

    return (
      <Sc.Weight>
        <FormattedMessage id={key} defaultMessage="{weight} Kg" values={{ weight: variant.weight }} />
      </Sc.Weight>
    );
  }
}

export default injectIntl(Weight);
