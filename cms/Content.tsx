import React, { Component, MouseEvent } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { openEditor } from './edit-in-place/cmsEditorActions';
import { Content as CmsContent, addContentToDom } from '@stackend/api/cms';
import * as Sc from './Content.style';
import { isRunningServerSide } from '@stackend/api/api';

function mapStateToProps(
  { cmsEditInPlace }: any,
  _ownProps: any
): {
  editInPlace: boolean;
} {
  return {
    editInPlace: cmsEditInPlace.enabled
  };
}

const mapDispatchToProps = {
  openEditor
};

const connector = connect(mapStateToProps, mapDispatchToProps);

export interface Props extends ConnectedProps<typeof connector> {
  content: CmsContent | null;
  className?: string;
  setRef?: (ref: HTMLElement) => void;
}

/**
 * Render cms content
 */
class Content extends Component<Props> {
  contentRef: HTMLElement | undefined = undefined;

  componentDidMount(): void {
    this.updateContent();
  }

  componentDidUpdate(prevProps: Props): void {
    const { content } = this.props;

    if (content && content.id !== (prevProps.content ? prevProps.content.id : 0)) {
      this.updateContent();
    }
  }

  updateContent(): void {
    const { content } = this.props;

    if (!content || !content.body) {
      return;
    }

    if (isRunningServerSide()) {
      console.warn('updateContent run serverside');
      return;
    }

    if (content && this.contentRef) {
      addContentToDom(this.contentRef, content);
    }
  }

  onContentClicked = (e: MouseEvent): void => {
    const { content, openEditor } = this.props;
    if (content) {
      openEditor(content, e.target as HTMLElement);
    }
  };

  setRef = (ref: HTMLDivElement): void => {
    this.contentRef = ref;
    if (this.props.setRef) {
      this.props.setRef(ref);
    }
  };

  render(): JSX.Element | null {
    const { editInPlace, content, className } = this.props;
    if (!content) {
      return null;
    }

    if (editInPlace) {
      return (
        <Sc.Content
          id={'stackend-cms-' + content.id}
          className={('stackend-cms-editable ' + className) as any}
          onClick={this.onContentClicked}
          editable={true}
          ref={this.setRef}
        />
      );
    } else {
      return (
        <Sc.Content editable={false} id={'stackend-cms-' + content.id} ref={this.setRef} className={className as any} />
      );
    }
  }
}
export default connector(Content);
