import get from 'lodash/get';
import React, { MouseEvent } from 'react';
import { appendQueryString } from '@stackend/api/api/LoadJson';
import type { PaginatedCollection } from '@stackend/api/api/PaginatedCollection';
import * as Sc from './Pagination.style.js';
import { injectIntl, WrappedComponentProps } from 'react-intl';

export type Props = {
  /**
   *Paginated collection
   */
  collection: PaginatedCollection<any>;
  url?: string; //Optional url
  /**
   * Callback invoked when the page is changed
   *
   */
  handleGoToPage: (p: number /*page number*/, collection: PaginatedCollection<any> /*current collection*/) => any;
  /**
   * Layout:
   *    full: «« | «       » | »»
   *    compact: Load more...
   *    lazy: lazy-loading, hidden interface
   *    numbered: numbered list of pages
   */
  layout: 'full' | 'compact' | 'lazy' | 'numbered' | 'previous-page' | 'next-page';

  /**
   * Selector to an element that is the source of lazy load scroll event
   */
  scrollSource?: string;

  /**
   * Selector to the scrolled element
   */
  scrollTarget?: string;
} & WrappedComponentProps;

type State = {
  page: number;
  pageSet: boolean;
};
/**
 * Renders a PaginatedCollection.
 *
 * @param collection {Object} Paginated collection
 * @param handleGoToPage {Function} function invoked when switching page
 *
 * @since 13 feb 2017
 *
 */
class Pagination extends React.Component<Props, State> {
  static ATTR = 'xcap-auto-pagination';

  state = {
    page: 1,
    pageSet: false
  };

  static defaultProps = {
    layout: 'compact',
    url: ''
  };

  scrollSource: any = null;
  scrollTarget: any = null;
  thresholdPixels = 500;
  scrollTimer: number | null = null;

  static getDerivedStateFromProps(props: Props, state: State) {
    if (!state.pageSet && props.collection) {
      return {
        page: props.collection.page,
        pageSet: true
      };
    }

    return state;
  }

  componentDidMount() {
    // FIXME: support scrolling in any element like auto-pagination.js
    if (this.props.layout === 'lazy') {
      this.scrollSource = this.props.scrollSource ? document.querySelector(this.props.scrollSource) : window;
      this.scrollTarget = this.props.scrollTarget ? document.querySelector(this.props.scrollTarget) : document;
      this.thresholdPixels = Math.max(1000, 2 * this.getHeight(this.scrollSource));
      this.scrollSource.addEventListener('scroll', this.handleScroll.bind(this), { passive: true });
    }
  }

  getHeight(e: any): number {
    if (e === e.window) {
      return e.document.documentElement.clientHeight;
    }

    if (e.nodeType === 9) {
      const doc = e.documentElement;
      return Math.max(e.body.scrollHeight, doc.scrollHeight, e.body.offsetHeight, doc.offsetHeight, doc.clientHeight);
    }

    return e.height;
  }

  componentWillUnmount() {
    if (this.scrollSource) {
      this.scrollSource.removeEventListener('scroll', this.handleScroll);
    }
  }

  componentDidUpdate(prevProps: Props /*, prevState, prevContext*/) {
    const { collection } = this.props;
    if (!!get(collection, 'page') && get(collection, 'page') !== get(prevProps, 'collection.page')) {
      this.setState({ page: collection.page });
    }
  }

  onFirstClicked = (e: MouseEvent): void => {
    e.preventDefault();
    const { collection } = this.props;
    if (collection && this.state.page !== collection.firstPage) {
      this.goToPage(collection.firstPage);
    }
  };

  onLastClicked = (e: MouseEvent): void => {
    e.preventDefault();
    const { collection } = this.props;
    if (collection && this.state.page !== collection.lastPage) {
      this.goToPage(collection.lastPage);
    }
  };

  onNextClicked = (e: MouseEvent): void => {
    e.preventDefault();
    const { collection } = this.props;
    if (collection && this.state.page < collection.lastPage) {
      this.goToPage(this.state.page + 1);
    }
  };

  onLazyNext = () => {
    const { collection } = this.props;
    if (collection && this.state.page < collection.lastPage) {
      this.goToPage(this.state.page + 1);
    }
  };

  onPreviousClicked = (e: MouseEvent) => {
    e.preventDefault();
    if (this.props.collection && this.state.page > 1) {
      this.goToPage(this.state.page - 1);
    }
  };

  goToPage(page: number) {
    if (!(Number.isInteger(page) && page > 0)) {
      throw 'Page must be a positive integer';
    }

    this.setState({ page });

    if (this.props.handleGoToPage) {
      this.props.handleGoToPage(page, this.props.collection);
    }
  }

  getPageUrl(p: number) {
    return appendQueryString(this.props.url || '', 'p=' + p);
  }

  handleScroll = (e: Event) => {
    const { collection } = this.props;

    if (this.scrollTimer === null && collection && this.state.page < collection.lastPage) {
      const h = this.getHeight(this.scrollTarget);
      let s = 0;
      if (typeof this.scrollTarget.scrollTop !== 'undefined') {
        s = this.scrollTarget.scrollTop;
      } else {
        s = this.scrollTarget.defaultView.scrollY;
      }
      const left = h - s;

      //console.log('leftToScroll=', left, 't=', this.thresholdPixels, 's=', s, 'h=', h);
      if (left < this.thresholdPixels) {
        if (this.scrollTimer !== null) {
          clearTimeout(this.scrollTimer);
        }
        this.scrollTimer = setTimeout(() => {
          this.onLazyNext();
          this.scrollTimer = null;
        }, 1000);
      }
    }
  };

  renderCompact(): JSX.Element | null {
    const p = this.state.page;
    const { collection, layout, intl } = this.props;

    if ((layout === 'next-page' || layout === 'compact') && p === collection.lastPage) {
      return null;
    }

    if (layout === 'previous-page' && p === collection.firstPage) {
      return null;
    }

    let onClick = this.onNextClicked;
    let className = 'stackend-pagination-more';
    let icon = 'keyboard_arrow_down';

    if (layout === 'previous-page') {
      onClick = this.onPreviousClicked;
      className = 'stackend-pagination-previous';
      icon = 'keyboard_arrow_up';
    }

    return (
      <Sc.PaginationCompact className="stackend-pagination stackend-pagination-compact">
        <Sc.PaginationMoreButton onClick={onClick} className={className}>
          {intl.formatMessage({
            id: 'Pagination.load-more',
            defaultMessage: 'Load more'
          })}
          <i className="material-icons">{icon}</i>
        </Sc.PaginationMoreButton>
      </Sc.PaginationCompact>
    );
  }

  renderFull(): JSX.Element | null {
    return (
      <Sc.PaginationFull className="stackend-pagination stackend-pagination-full">
        <button className="stackend-first icon" onClick={this.onFirstClicked} aria-label="First">
          <span className="material-icons">skip_previous</span>
        </button>
        <button className="stackend-previous icon" onClick={this.onPreviousClicked} aria-label="Previous">
          <span className="material-icons">navigate_before</span>
        </button>
        <button className="stackend-next icon" onClick={this.onNextClicked} aria-label="Next">
          <span className="material-icons">navigate_next</span>
        </button>

        <button className="stackend-last icon" onClick={this.onLastClicked} aria-label="Last">
          <span className="material-icons">skip_next</span>
        </button>
      </Sc.PaginationFull>
    );
  }

  renderNumbered(): JSX.Element | null {
    const { collection } = this.props;
    return (
      <Sc.PaginationWrapper>
        {collection.page !== collection.firstPage && (
          <Sc.PaginationButtons prev onClick={this.onPreviousClicked}>
            <i className="material-icons">arrow_forward</i>
          </Sc.PaginationButtons>
        )}
        {collection.page !== collection.firstPage && (
          <Sc.PaginationButtons onClick={this.onFirstClicked}>{collection.firstPage}</Sc.PaginationButtons>
        )}
        {collection.page - 2 > collection.firstPage && (
          <Sc.PaginationButtons onClick={() => this.goToPage(collection.page - 1)}>
            {collection.page - 2}
          </Sc.PaginationButtons>
        )}
        {collection.page - 1 > collection.firstPage && (
          <Sc.PaginationButtons onClick={() => this.goToPage(collection.page - 1)}>
            {collection.page - 1}
          </Sc.PaginationButtons>
        )}

        <Sc.PaginationButtons current>{collection.page}</Sc.PaginationButtons>

        {collection.page + 1 < collection.lastPage && (
          <Sc.PaginationButtons onClick={() => this.goToPage(collection.page + 1)}>
            {collection.page + 1}
          </Sc.PaginationButtons>
        )}
        {collection.page + 2 < collection.lastPage && (
          <Sc.PaginationButtons onClick={() => this.goToPage(collection.page + 1)}>
            {collection.page + 2}
          </Sc.PaginationButtons>
        )}
        {collection.page !== collection.lastPage && (
          <span style={{ display: 'flex' }}>
            {collection.lastPage > 4 && (
              <Sc.PaginationButtons>
                <i className="material-icons">more_horiz</i>
              </Sc.PaginationButtons>
            )}
            <Sc.PaginationButtons onClick={this.onLastClicked}>{collection.lastPage}</Sc.PaginationButtons>
          </span>
        )}
        {collection.page !== collection.lastPage && (
          <Sc.PaginationButtons onClick={this.onNextClicked}>
            <i className="material-icons">arrow_forward</i>
          </Sc.PaginationButtons>
        )}
      </Sc.PaginationWrapper>
    );
  }

  renderLazy(): JSX.Element | null {
    return <div />;
    /*
		return (
			<LazyLoad offset={300} height={120} onContentVisible={() => this.onLazyNext()}>
				<div></div>
			</LazyLoad>
		);
		*/
  }

  render(): JSX.Element | null {
    const { collection, layout } = this.props;
    if (!collection || collection.firstPage === collection.lastPage) {
      return null;
    }
    switch (layout) {
      case 'full':
        return this.renderFull();
      case 'lazy':
        return this.renderLazy();
      case 'numbered':
        return this.renderNumbered();
      default:
        return this.renderCompact();
    }
  }
}

export default injectIntl(Pagination as any);
