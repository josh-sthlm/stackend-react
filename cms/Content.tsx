import React, { Component, createRef, MouseEvent } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { openEditor } from './edit-in-place/cmsEditorActions';
import { Content as CmsContent, addContentToDom } from '@stackend/api/cms';
import * as Sc from './Content.style';
import { isRunningServerSide } from '@stackend/api/api';

type Props = {
  content: CmsContent | null;
  className?: string;
};

type OwnProps = Props & {
  editInPlace: boolean;
  openEditor: (content: CmsContent, contentElement: any) => any;
};

function mapStateToProps({ cmsEditInPlace }: any, ownProps: any): any {
  let c = ownProps.content;
  return {
    //id: ownProps.id,
    content: c,
    editInPlace: cmsEditInPlace.enabled
  };
}

const mapDispatchToProps = {
  openEditor
};

class Content extends Component<OwnProps> {
  constructor(props: OwnProps) {
    super(props);
  }

  contentRef = createRef();

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
      let parent = ReactDOM.findDOMNode(this.contentRef.current as any);
      if (parent) {
        addContentToDom(parent as Element, content);
      }
    }
  }

  onContentClicked = (e: MouseEvent) => {
    let { content, openEditor } = this.props;
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
          ref={this.contentRef}
        />
      );
    } else {
      return (
        <Sc.Content
          editable={false}
          id={'stackend-cms-' + content.id}
          ref={this.contentRef}
          className={className as any}
        />
      );
    }
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Content);
