import React, { Component, createRef, MouseEvent } from 'react';
import ReactDOM from 'react-dom';
import { connect, ConnectedProps } from 'react-redux';
import { openEditor } from './edit-in-place/cmsEditorActions';
import { Content as CmsContent, addContentToDom } from '@stackend/api/cms';
import * as Sc from './Content.style';
import { isRunningServerSide } from '@stackend/api/api';


type OwnProps = Props & {
  editInPlace: boolean;
  openEditor: (content: CmsContent, contentElement: any) => any;
};

function mapStateToProps({ cmsEditInPlace }: any, ownProps: any): any {
  const c = ownProps.content;
  return {
    //id: ownProps.id,
    content: c,
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
}


/**
 * Render cms content
 */
class Content extends Component<OwnProps> {
  contentRef = createRef();

  constructor(props: OwnProps) {
    super(props);
  }

  async componentDidMount() {
    this.updateContent();
  }

  componentDidUpdate(prevProps: OwnProps, prevState: OwnProps) {
    const { content } = this.props;

    if (content && content.id !== (prevProps.content ? prevProps.content.id : 0)) {
      this.updateContent();
    }
  }

  updateContent() {
    const { content } = this.props;

    if (!content || !content.body) {
      return;
    }

    if (isRunningServerSide()) {
      console.warn('updateContent run serverside');
      return;
    }

    if (content && this.contentRef.current) {
      const parent = ReactDOM.findDOMNode(this.contentRef.current as any);
      if (parent) {
        addContentToDom(parent as Element, content);
      }
    }
  }

  onContentClicked = (e: MouseEvent) => {
    const { content, openEditor } = this.props;
    if (content) {
      openEditor(content, e.target);
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
          ref={this.contentRef as any}
        />
      );
    } else {
      return (
        <Sc.Content
          editable={false}
          id={'stackend-cms-' + content.id}
          ref={this.contentRef as any}
          className={className as any}
        />
      );
    }
  }
}
export default connector(Content);
